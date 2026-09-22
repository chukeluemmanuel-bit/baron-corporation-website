
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

document.querySelectorAll('form').forEach(form => {
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


// V14 preview account forms
document.getElementById('signInForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.currentTarget.querySelector('.form-success');
  if (msg) msg.style.display = 'block';
});
document.getElementById('createAccountForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.currentTarget.querySelector('.form-success');
  if (msg) msg.style.display = 'block';
});
