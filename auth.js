(() => {
  const cfg = window.BARON_SUPABASE_CONFIG;
  if (!cfg || !window.supabase?.createClient) return;
  const client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.baronSupabase = client;
  const MGMT = 'mgt.baroncorporation@gmail.com';

  const msg = (form, text, error=false) => {
    const el = form.querySelector(error ? '.form-error' : '.form-success');
    if (!el) return;
    el.textContent = text; el.hidden = false;
    const other = form.querySelector(error ? '.form-success' : '.form-error');
    if (other) other.hidden = true;
  };

  async function signIn() {
    const form = document.getElementById('signInForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const button = form.querySelector('button[type=submit]');
      button.disabled = true; button.textContent = 'Signing in...';
      try {
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;
        const { data, error } = await client.auth.signInWithPassword({email,password});
        if (error) throw error;
        if ((data.user?.email || '').toLowerCase() === MGMT) location.href='management.html';
        else location.href='index.html';
      } catch(err) { msg(form, err.message || 'Sign in failed.', true); }
      finally { button.disabled=false; button.textContent='Sign In'; }
    });
  }

  async function createAccount() {
    const form = document.getElementById('createAccountForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const b=form.querySelector('button[type=submit]');
      const email=form.elements.email.value.trim();
      const p=form.elements.password.value, c=form.elements.confirm_password.value;
      if(p!==c) return msg(form,'Passwords do not match.',true);
      if(p.length<8 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/\d/.test(p)) return msg(form,'Use at least 8 characters with uppercase, lowercase and a number.',true);
      b.disabled=true; b.textContent='Creating account...';
      try {
        const {data,error}=await client.auth.signUp({
          email,password:p,
          options:{emailRedirectTo:'https://baroncorporation.space/sign-in.html?verified=1',data:{full_name:form.elements.full_name.value.trim()}}
        });
        if(error) throw error;
        msg(form, data.session ? 'Account created.' : 'Account created. Check your email to confirm your address.');
        if(data.session) location.href=((data.user?.email||'').toLowerCase()===MGMT?'management.html':'index.html');
      }catch(err){msg(form,err.message||'Could not create account.',true)}
      finally{b.disabled=false;b.textContent='Create Account'}
    });
  }

  async function managementGuard(){
    if(document.body.dataset.management!=='true') return;
    const {data}=await client.auth.getSession();
    const email=(data.session?.user?.email||'').toLowerCase();
    if(email!==MGMT){ location.replace('sign-in.html?management=1'); return; }
    document.body.classList.add('management-ready');
    document.querySelectorAll('[data-management-email]').forEach(el=>el.textContent=email);
    document.querySelector('[data-signout]')?.addEventListener('click', async()=>{await client.auth.signOut(); location.href='sign-in.html';});
  }

  document.addEventListener('DOMContentLoaded',()=>Promise.allSettled([signIn(),createAccount(),managementGuard()]));
})();
