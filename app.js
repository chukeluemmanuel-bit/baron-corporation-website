(() => {
  const catalog = () => Array.isArray(window.BARON_JOB_CATALOG) ? window.BARON_JOB_CATALOG : [];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const qs = id => document.getElementById(id);
  const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

  function applyUrl(title, family='', state=''){
    const p=new URLSearchParams({role:title}); if(family)p.set('family',family); if(state)p.set('state',state); return 'apply.html?'+p.toString();
  }

  function setupHome(){
    const browse=qs('browseRole'), input=qs('roleSearch'), auto=qs('roleAutocomplete'), state=qs('preferredState'), results=qs('roleResults');
    if(!browse && !input) return;
    const data=catalog();
    if(browse){
      const frag=document.createDocumentFragment();
      data.forEach(r=>{const o=document.createElement('option');o.value=r.title;o.textContent=`${r.title} — ${r.family}`;frag.appendChild(o)});browse.appendChild(frag);
      browse.addEventListener('change',()=>{if(browse.value){const r=data.find(x=>x.title===browse.value);location.href=applyUrl(r.title,r.family,state?.value||'')}});
    }
    const showMatches=(value)=>{
      const q=value.trim().toLowerCase();
      if(!q){auto?.classList.add('hidden'); return []}
      const matches=data.filter(r=>r.title.toLowerCase().includes(q) || r.family.toLowerCase().includes(q)).slice(0,12);
      if(auto){auto.innerHTML=matches.map(r=>`<button type="button" data-title="${esc(r.title)}" data-family="${esc(r.family)}"><b>${esc(r.title)}</b><span>${esc(r.family)}</span></button>`).join('') || '<div class="auto-empty">No exact suggestion. You can still apply using the title you typed.</div>';auto.classList.remove('hidden');auto.querySelectorAll('button').forEach(b=>b.onclick=()=>location.href=applyUrl(b.dataset.title,b.dataset.family,state?.value||''));}
      return matches;
    };
    input?.addEventListener('input',e=>showMatches(e.target.value));
    document.addEventListener('click',e=>{if(auto && !auto.contains(e.target) && e.target!==input) auto.classList.add('hidden')});
    qs('roleSearchForm')?.addEventListener('submit',e=>{e.preventDefault();const raw=input.value.trim();if(!raw)return;const m=showMatches(raw)[0];location.href=applyUrl(m?.title||raw,m?.family||'Other',state?.value||'')});
    if(results){ renderResults(data.slice(0,72),results,state?.value||''); }
    qs('showAllRoles')?.addEventListener('click',()=>renderResults(data,results,state?.value||''));
    document.querySelectorAll('[data-family]').forEach(btn=>btn.addEventListener('click',()=>{
      const fam=btn.dataset.family; if(input) input.value=fam; const subset=data.filter(r=>r.family===fam); renderResults(subset,results,state?.value||''); results?.scrollIntoView({behavior:'smooth'});
    }));
  }

  function renderResults(list, el, state){
    if(!el) return;
    el.innerHTML=list.map(r=>`<article class="role-card"><div><span class="role-family">${esc(r.family)}</span><h3>${esc(r.title)}</h3><p>Submit your interest for this type of work. Baron will review your profile and may source a matching opportunity.</p></div><a class="btn btn-gold" href="${applyUrl(r.title,r.family,state)}">Apply</a></article>`).join('');
    const count=qs('roleCount'); if(count) count.textContent=`${list.length.toLocaleString()} job titles`;
  }

  function setupApply(){
    const form=qs('applicationForm'); if(!form) return;
    const p=new URLSearchParams(location.search); const role=p.get('role')||''; const family=p.get('family')||'Other'; const pref=p.get('state')||'';
    const roleInput=form.elements.job_title_snapshot; roleInput.value=role;
    qs('selectedRole').textContent=role || 'Choose or type a job title below';
    qs('selectedFamily').textContent=family;
    const prefSel=form.elements.preferred_state; if(prefSel && states.includes(pref)) prefSel.value=pref;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const errorBox=form.querySelector('.form-error'); errorBox.hidden=true;
      const btn=form.querySelector('button[type=submit]'); btn.disabled=true;btn.textContent='Submitting...';
      try{
        if(!window.baronSupabase) throw new Error('Application service is not available. Please refresh and try again.');
        const fd=new FormData(form); if(fd.get('website')) return;
        const {data:sessionData}=await window.baronSupabase.auth.getSession();
        const preferred=fd.get('preferred_state')||'Any state';
        const notes=[`Preferred work state: ${preferred}`, fd.get('additional_info')||''].filter(Boolean).join('\n\n');
        const payload={
          job_id:null,
          job_title_snapshot:String(fd.get('job_title_snapshot')||'').trim(),
          user_id:sessionData?.session?.user?.id||null,
          first_name:String(fd.get('first_name')||'').trim(),
          last_name:String(fd.get('last_name')||'').trim(),
          email:String(fd.get('email')||'').trim(),
          phone:String(fd.get('phone')||'').trim()||null,
          city:String(fd.get('city')||'').trim(),
          state:String(fd.get('state')||'').trim(),
          years_experience:fd.get('years_experience')===''?null:Number(fd.get('years_experience')),
          recent_job_title:String(fd.get('recent_job_title')||'').trim()||null,
          certification:String(fd.get('certification')||'').trim()||null,
          availability:String(fd.get('availability')||'').trim()||null,
          professional_summary:String(fd.get('professional_summary')||'').trim(),
          additional_info:notes||null,
          consent:true,
          review_status:'waiting_review'
        };
        if(!payload.job_title_snapshot) throw new Error('Please enter the job title you are interested in.');
        const {error}=await window.baronSupabase.from('applications').insert(payload);
        if(error) throw error;
        const cp=new URLSearchParams({role:payload.job_title_snapshot,email:payload.email}); location.href='application-confirmation.html?'+cp.toString();
      }catch(err){errorBox.textContent=err.message||'Could not submit application.';errorBox.hidden=false;btn.disabled=false;btn.textContent='Submit Application';}
    });
  }

  function setupConfirmation(){
    const el=qs('confirmationRole'); if(!el)return; const p=new URLSearchParams(location.search); el.textContent=p.get('role')||'your selected job type';
  }

  async function setupManagement(){
    const list=qs('applicationsList'); if(!list)return;
    const wait=()=>new Promise(r=>setTimeout(r,250));
    for(let i=0;i<20 && !window.baronSupabase;i++) await wait();
    if(!window.baronSupabase){list.innerHTML='<div class="notice">Could not connect to the application database.</div>';return;}
    const {data:sessionData}=await window.baronSupabase.auth.getSession();
    if((sessionData?.session?.user?.email||'').toLowerCase()!=='mgt.baroncorporation@gmail.com') return;
    const {data,error}=await window.baronSupabase.from('applications').select('*').order('created_at',{ascending:false}).limit(200);
    if(error){list.innerHTML=`<div class="notice error">${esc(error.message)}</div>`;return}
    if(!data?.length){list.innerHTML='<div class="empty-state"><h3>No applications yet</h3><p>New submissions will appear here.</p></div>';return}
    list.innerHTML=data.map(a=>{
      const subject=encodeURIComponent(`Baron Corporation - ${a.job_title_snapshot} application`);
      const body=encodeURIComponent(`Hello ${a.first_name},\n\nWe are contacting you regarding your ${a.job_title_snapshot} application submitted through Baron Corporation.\n\n`);
      return `<article class="application-card"><div class="application-top"><div><span class="status-pill">Waiting for Review</span><h3>${esc(a.job_title_snapshot)}</h3><p>${esc(a.first_name)} ${esc(a.last_name)} · ${esc(a.city)}, ${esc(a.state)}</p></div><time>${new Date(a.created_at).toLocaleString()}</time></div><div class="application-details"><p><b>Email:</b> <a href="mailto:${encodeURIComponent(a.email)}">${esc(a.email)}</a></p><p><b>Phone:</b> ${esc(a.phone||'Not provided')}</p><p><b>Experience:</b> ${a.years_experience ?? 'Not provided'} years</p><p><b>Recent role:</b> ${esc(a.recent_job_title||'Not provided')}</p><p><b>Availability:</b> ${esc(a.availability||'Not provided')}</p><p><b>Certification:</b> ${esc(a.certification||'Not provided')}</p><p class="wide"><b>Professional summary:</b><br>${esc(a.professional_summary||'')}</p><p class="wide"><b>Additional information:</b><br>${esc(a.additional_info||'None')}</p></div><a class="btn btn-dark" href="mailto:${encodeURIComponent(a.email)}?subject=${subject}&body=${body}">Email Applicant</a></article>`
    }).join('');
  }

  document.addEventListener('DOMContentLoaded',()=>{setupHome();setupApply();setupConfirmation();setupManagement();});
})();
