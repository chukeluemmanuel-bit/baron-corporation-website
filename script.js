(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  document.addEventListener('DOMContentLoaded',()=>{
    $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
    const header=$('.site-header'); const onScroll=()=>header?.classList.toggle('scrolled',scrollY>10); onScroll(); addEventListener('scroll',onScroll,{passive:true});
    const btn=$('[data-menu-button]'), mobile=$('[data-mobile-menu]');
    btn?.addEventListener('click',()=>{const open=mobile?.classList.toggle('open');btn.setAttribute('aria-expanded',String(!!open));});
    $$('[data-mobile-menu] a').forEach(a=>a.addEventListener('click',()=>mobile?.classList.remove('open')));
    const reveals=$$('.reveal'); if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('is-visible'));
    $$('.faq-item button').forEach(b=>b.addEventListener('click',()=>b.closest('.faq-item')?.classList.toggle('open')));
    const fab=$('[data-support-fab]'), drawer=$('[data-support-drawer]'); fab?.addEventListener('click',()=>drawer?.classList.toggle('open'));
  });
  window.BaronUI={toast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=text;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800)}};
})();