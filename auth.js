(() => {
  const config = window.BARON_SUPABASE_CONFIG;
  if (!config || !window.supabase || !window.supabase.createClient) return;

  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  window.baronSupabase = client;

  const portalFor = (user) => {
    const type = user?.user_metadata?.account_type;
    return type === 'applicant' ? 'applicant-portal.html' : 'client-portal.html';
  };

  const safeText = (value) => String(value ?? '').replace(/[<>]/g, '');

  const setMessage = (form, message, kind = 'success') => {
    if (!form) return;
    let box = form.querySelector(kind === 'error' ? '.form-error' : '.form-success');
    if (!box) {
      box = document.createElement('div');
      box.className = kind === 'error' ? 'form-error' : 'form-success';
      form.appendChild(box);
    }
    box.textContent = message;
    box.style.display = 'block';
    const other = form.querySelector(kind === 'error' ? '.form-success' : '.form-error');
    if (other) other.style.display = 'none';
  };

  const setLoading = (button, loading, loadingText) => {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = loadingText;
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  };

  async function updateNavigation() {
    const { data } = await client.auth.getSession();
    const session = data?.session;
    if (!session) return;

    const portalHref = portalFor(session.user);
    document.querySelectorAll('.nav-auth-actions').forEach((wrap) => {
      wrap.innerHTML = `<a class="auth-link" href="${portalHref}">Portal</a><button class="btn btn-black nav-signout" type="button">Sign Out</button>`;
    });
    document.querySelectorAll('.mobile-auth-links').forEach((wrap) => {
      wrap.innerHTML = `<a href="${portalHref}">Portal</a><a href="#" class="mobile-signout">Sign Out</a>`;
    });
    document.querySelectorAll('.nav-signout,.mobile-signout').forEach((el) => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        await client.auth.signOut();
        window.location.href = 'sign-in.html';
      });
    });
  }

  async function setupCreateAccount() {
    const form = document.getElementById('createAccountForm');
    if (!form) return;

    const { data: sessionData } = await client.auth.getSession();
    if (sessionData?.session) {
      window.location.replace(portalFor(sessionData.session.user));
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const button = form.querySelector('button[type="submit"]');
      const accountType = form.elements.account_type?.value;
      const firstName = form.elements.first_name?.value.trim();
      const lastName = form.elements.last_name?.value.trim();
      const email = form.elements.email?.value.trim();
      const phone = form.elements.phone?.value.trim();
      const company = form.elements.company?.value.trim();
      const password = form.elements.password?.value || '';
      const confirmPassword = form.elements.confirm_password?.value || '';

      if (!accountType) return setMessage(form, 'Please select an account type.', 'error');
      if (password !== confirmPassword) return setMessage(form, 'The two passwords do not match.', 'error');
      if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        return setMessage(form, 'Use at least 8 characters with a lowercase letter, uppercase letter, and number.', 'error');
      }

      setLoading(button, true, 'Creating account...');
      try {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://baroncorporation.space/sign-in.html?verified=1',
            data: {
              account_type: accountType,
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
              phone: phone || null,
              company: company || null
            }
          }
        });

        if (error) throw error;

        if (data?.session) {
          window.location.href = portalFor(data.user);
        } else {
          setMessage(form, `Account created for ${safeText(email)}. Check your email and confirm your address, then return here to sign in.`);
          form.reset();
        }
      } catch (error) {
        setMessage(form, error?.message || 'We could not create your account. Please try again.', 'error');
      } finally {
        setLoading(button, false);
      }
    }, true);
  }

  async function setupSignIn() {
    const form = document.getElementById('signInForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === '1') {
      setMessage(form, 'Email confirmed. You can now sign in.');
    }

    const { data: sessionData } = await client.auth.getSession();
    if (sessionData?.session) {
      window.location.replace(portalFor(sessionData.session.user));
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const button = form.querySelector('button[type="submit"]');
      const email = form.elements.email?.value.trim();
      const password = form.elements.password?.value || '';
      setLoading(button, true, 'Signing in...');

      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const requested = params.get('redirect');
        const allowed = ['client-portal.html', 'applicant-portal.html'];
        const destination = allowed.includes(requested) ? requested : portalFor(data.user);
        window.location.href = destination;
      } catch (error) {
        setMessage(form, error?.message || 'Sign in failed. Check your email and password.', 'error');
      } finally {
        setLoading(button, false);
      }
    }, true);
  }

  async function protectPortal() {
    const portal = document.body.dataset.portal;
    if (!portal) return;

    const { data, error } = await client.auth.getSession();
    const session = data?.session;
    if (error || !session) {
      const target = portal === 'applicant' ? 'applicant-portal.html' : 'client-portal.html';
      window.location.replace(`sign-in.html?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const user = session.user;
    const type = user?.user_metadata?.account_type || 'client';
    if (type !== portal) {
      window.location.replace(portalFor(user));
      return;
    }

    const fullName = user.user_metadata?.full_name || user.user_metadata?.first_name || (portal === 'applicant' ? 'Applicant' : 'Client');
    document.querySelectorAll('[data-user-name]').forEach((el) => el.textContent = fullName);
    document.querySelectorAll('[data-user-email]').forEach((el) => el.textContent = user.email || '');

    document.querySelectorAll('[data-sign-out]').forEach((el) => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        el.setAttribute('aria-busy', 'true');
        await client.auth.signOut();
        window.location.href = 'sign-in.html';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.allSettled([
      updateNavigation(),
      setupCreateAccount(),
      setupSignIn(),
      protectPortal()
    ]);
  });
})();
