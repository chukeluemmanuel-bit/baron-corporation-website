document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const menu = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(!!open));
  });
});
