/* Shared behaviour for every page */
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  window.$=$; window.$$=$$;
  const EMAIL='luthfinabilramadhan@gmail.com';

  /* theme */
  const root=document.documentElement;
  try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t;else if(matchMedia('(prefers-color-scheme: dark)').matches)root.dataset.theme='dark'}catch(e){}
  const tb=$('#theme');
  if(tb)tb.onclick=()=>{const n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}};

  /* mobile nav */
  const nav=$('#nav'),bg=$('#burger');
  if(bg)bg.onclick=()=>nav.classList.toggle('open');
  $$('#nav ul a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  /* reveal */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  window.observeReveal=(scope=document)=>$$('.rv',scope).forEach(el=>io.observe(el));
  observeReveal();

  /* progress bar */
  const pr=$('#progress');
  function prog(){const h=document.documentElement,max=h.scrollHeight-h.clientHeight;if(pr)pr.style.width=(max>0?h.scrollTop/max*100:0)+'%'}
  addEventListener('scroll',prog,{passive:true});prog();

  /* toast */
  const toast=$('#toast');let tt;
  window.say=m=>{if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2200)};

  /* cursor (fine pointers only) */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    const cur=$('#cur');
    if(cur){
      let x=0,y=0,cx=0,cy=0;
      addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cur.style.opacity=1});
      (function loop(){cx+=(x-cx)*.22;cy+=(y-cy)*.22;cur.style.transform=`translate(${cx-6}px,${cy-6}px)`;requestAnimationFrame(loop)})();
      document.addEventListener('mouseover',e=>{cur.classList.toggle('big',!!e.target.closest('a,button,.chip,.svc,.slide,.logo-box,.pj-row'))});
    }
  }

  /* modal helpers */
  let lastFocus=null,openModalEl=null;
  window.openModal=id=>{
    const m=document.getElementById(id);if(!m)return;
    lastFocus=document.activeElement;openModalEl=m;
    m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('lock');
    setTimeout(()=>{const f=$('.x',m);f&&f.focus()},60);
  };
  window.closeModal=()=>{
    if(!openModalEl)return;
    openModalEl.classList.remove('open');openModalEl.setAttribute('aria-hidden','true');
    document.body.classList.remove('lock');openModalEl=null;
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  };
  document.addEventListener('click',e=>{
    const o=e.target.closest('[data-open]');
    if(o){e.preventDefault();openModal(o.dataset.open);return}
    if(e.target.closest('[data-close]'))closeModal();
  });
  addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  /* copy email */
  $$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
    (navigator.clipboard?navigator.clipboard.writeText(EMAIL):Promise.reject()).then(()=>say('Email copied ✓')).catch(()=>{location.href='mailto:'+EMAIL});
  }));

  /* contact form -> mailto */
  const f=$('#form');
  if(f)f.addEventListener('submit',e=>{
    e.preventDefault();
    const n=$('#fn').value.trim(),m=$('#fe').value.trim(),b=$('#fm').value.trim();
    location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Project inquiry from '+n)}&body=${encodeURIComponent(b+'\n\n— '+n+' ('+m+')')}`;
    say('Opening your email app…');closeModal();
  });

  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();

/* Connect footer: the word fits the width, then its height is tied to the scroll position.
   p = 0 when the footer starts to appear, p = 1 at the very bottom of the page.
   Scrolling down stretches it taller, scrolling up squeezes it flat again. */
(function(){
  const box=document.getElementById('connWord'),t=document.getElementById('connText'),sec=document.getElementById('connect');
  if(!box||!t||!sec)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN=0.16;let max=1.6;
  function fit(){
    t.style.transform='none';t.style.fontSize='100px';
    const cs=getComputedStyle(box),target=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    const w=t.getBoundingClientRect().width;
    if(w>0)t.style.fontSize=(100*target/w)+'px';
    const h0=t.offsetHeight||1;
    max=Math.min(3.2,Math.max(1.3,innerHeight*0.62/h0));
    box.style.height=Math.ceil(h0*max*1.05)+'px';
  }
  function stretch(){
    const r=sec.getBoundingClientRect();
    const p=Math.min(1,Math.max(0,(innerHeight-r.top)/r.height));
    t.style.transform='scaleY('+(reduce?1:(MIN+(max-MIN)*p).toFixed(4))+')';
  }
  let busy=false;
  function onScroll(){if(busy)return;busy=true;requestAnimationFrame(function(){busy=false;stretch()})}
  function all(){fit();stretch()}
  all();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
  addEventListener('load',all);
  addEventListener('resize',all);
  addEventListener('scroll',onScroll,{passive:true});
})();
