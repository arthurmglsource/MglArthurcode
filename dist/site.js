(() => {
 'use strict';
 const content = window.MGL_CONTENT;
 const $ = (s) => document.querySelector(s);
 const $$ = (s) => [...document.querySelectorAll(s)];
 const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const hero = $('.hero-scroll'), portrait = $('.portrait-layer'), brand = $('.hero-brand');
 const journey = $('.journey-scroll'), stage = $('.journey'), scenes = $$('[data-scene]');
 let step = -1, scheduled = false;
 function setStep(index) {
   if(index === step) return;
   step=index;
   const data=content.journey[index];
   $('#journey-title').textContent=data.title;
   $('#journey-description').textContent=data.description;
   $('.journey-number').textContent=String(index+1).padStart(2,'0');
   $('.journey-step-label').textContent=data.label;
   scenes.forEach((s,i)=>{s.hidden=!motion.matches && i!==index;});
   $$('.journey-steps li').forEach((s,i)=>s.classList.toggle('active',i===index));
 }
 function renderScroll(){
   scheduled=false;
   if(motion.matches){portrait.style.transform='';brand.style.transform='translateX(-50%)';scenes.forEach(s=>s.hidden=false);return;}
   const heroRect=hero.getBoundingClientRect();
   const hp=clamp(-heroRect.top/Math.max(1,hero.offsetHeight-$('.hero').offsetHeight));
   portrait.style.transform=`translateY(${hp*35}px) scale(${1+hp*.055})`;
   brand.style.transform=`translate(-50%, ${-hp*60}px)`;
   const rect=journey.getBoundingClientRect();
   const jp=clamp(-rect.top/Math.max(1,journey.offsetHeight-stage.offsetHeight));
   // Piecewise timeline: search hold, discovery, trust, contact hold.
   const index=jp<.22?0:jp<.47?1:jp<.73?2:3;
   setStep(index);
   $('.journey-progress span').style.transform=`scaleX(${jp})`;
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(renderScroll);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 motion.addEventListener('change',()=>{step=-1;setStep(0);schedule();});
 setStep(0);renderScroll();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});
 $$('.section-heading, .problem h2, .about-copy, .process-grid li, .contact h2').forEach(el=>{if(!motion.matches){el.classList.add('reveal');observer.observe(el);}});
 const menuButton=$('.menu-button'), menu=$('#mobile-nav');
 const closeMenu=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');};
 menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
 $$('[data-country]').forEach(btn=>btn.addEventListener('click',()=>{
   $$('[data-country]').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
   $('#price-amount').textContent=content.prices[btn.dataset.country];
 }));
 const dialog=$('#contact-dialog');
 function contact(type){
   const number=content.whatsappNumber.replace(/\D/g,'');
   let url='';
   if(type==='whatsapp'&&number)url='https://wa.me/'+number+'?text='+encodeURIComponent(content.whatsappMessage);
   if(type==='meeting'&&/^https:\/\//.test(content.meetingUrl))url=content.meetingUrl;
   if(url){window.open(url,'_blank','noopener,noreferrer');return;}
   $('#dialog-description').textContent=type==='whatsapp'?'O número de WhatsApp ainda não foi fornecido. Este botão será ligado ao contacto real da MGL antes da abertura ao público.':'O link para marcar reuniões ainda não foi fornecido. Esta prévia não envia pedidos nem simula agendamentos.';
   dialog.showModal();
 }
 $$('[data-contact]').forEach(btn=>btn.addEventListener('click',()=>contact(btn.dataset.contact)));
 $$('.dialog-close,.dialog-dismiss').forEach(btn=>btn.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 if(content.whatsappNumber&&content.meetingUrl)$('#contact-note').hidden=true;
 content.projects.forEach(project=>{
   if(!project.title||!project.image||!/^https:\/\//.test(project.url))return;
   const link=document.createElement('a');link.className='project-item';link.href=project.url;link.target='_blank';link.rel='noopener noreferrer';
   const img=document.createElement('img');img.src=project.image;img.alt=project.imageAlt||project.title;img.loading='lazy';
   const caption=document.createElement('div');caption.className='project-caption';
   const title=document.createElement('h3');title.textContent=project.title+' ↗';
   const category=document.createElement('p');category.textContent=project.category||'';
   caption.append(title,category);link.append(img,caption);$('#project-list').append(link);
 });
 if($('#project-list').children.length){$('#work').hidden=false;$$('[data-work-link]').forEach(el=>el.hidden=false);}
 $('#year').textContent=new Date().getFullYear();
})();
