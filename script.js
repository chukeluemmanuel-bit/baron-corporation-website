const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-accordion]').forEach(item => {
  const btn = item.querySelector('button');
  btn?.addEventListener('click', () => item.classList.toggle('open'));
});

// Public inquiry/application forms remain in preview mode for now.
// Account forms are handled by auth.js and connect to Supabase Auth.
document.querySelectorAll('form:not(#signInForm):not(#createAccountForm)').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = form.querySelector('.form-success, .career-form-success');
    if (success) {
      success.style.display = 'block';
      success.scrollIntoView({behavior:'smooth', block:'nearest'});
    }
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
