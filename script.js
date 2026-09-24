document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-scroll-jobs]').forEach(el => el.addEventListener('click', () => document.getElementById('jobs')?.scrollIntoView({behavior:'smooth'})));
});
