/* MGL Growth — interaction layer. Project data and contact destinations: content.js. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const data=window.MGL_CONTENT, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis=null, menuOpen=false;
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);}
if(window.Lenis&&!reduced){lenis=new Lenis({duration:1.08,smoothWheel:true,touchMultiplier:1});lenis.on('scroll',()=>window.ScrollTrigger?.update());gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0);}
window.MGL_MOTION={lenis,reduced,heroProgress:0,pointer:{x:0,y:0}};
// Service tabs keep the full journey compact and work with keyboard and touch.
const presenceTabs=$$('.presence-tabs [role="tab"]'), presencePanels=$$('.presence-stage [role="tabpanel"]');
function selectPresence(index,focus=false){
 presenceTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;presencePanels[i].hidden=i!==index;});
 if(focus)presenceTabs[index].focus();
 if(!reduced&&window.gsap){gsap.killTweensOf(presencePanels);gsap.fromTo(presencePanels[index],{opacity:0,y:14},{opacity:1,y:0,duration:.45,ease:'power3.out',clearProps:'transform,opacity'});}
}
presenceTabs.forEach((tab,i)=>{
 tab.addEventListener('click',()=>selectPresence(i));
 tab.addEventListener('keydown',event=>{
  let next=i;
  if(['ArrowDown','ArrowRight'].includes(event.key))next=(i+1)%presenceTabs.length;
  else if(['ArrowUp','ArrowLeft'].includes(event.key))next=(i+presenceTabs.length-1)%presenceTabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=presenceTabs.length-1;
  else return;
  event.preventDefault();selectPresence(next,true);
 });
});
if(!reduced&&window.gsap){
 gsap.from('.presence-intro,.presence-experience,.presence-bottom',{y:28,opacity:0,duration:.8,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.presence',start:'top 78%',once:true}});
 gsap.from('.booking-area',{y:20,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:'.booking-area',start:'top 90%',once:true}});
}
function lock(on){document.body.classList.toggle('modal-open',on);if(lenis)on?lenis.stop():lenis.start();}
const menu=$('#site-menu'),toggle=$('.menu-toggle');
function setMenu(open){menuOpen=open;menu.hidden=!open;document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');if(lenis)open?lenis.stop():lenis.start();if(open){$('.header').style.position='fixed';menu.querySelector('a').focus();}else{$('.header').style.position='absolute';toggle.focus();}}
toggle.addEventListener('click',()=>setMenu(!menuOpen));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)setMenu(false);if(e.key==='Tab'&&menuOpen){const els=[toggle,...menu.querySelectorAll('a')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();if(menuOpen)setMenu(false);if(lenis)lenis.scrollTo(target,{offset:0});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});if(a.classList.contains('skip')){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));
const projects=data.projects,map=$('#gallery-map');
// Asymmetric archive: the empty centre keeps the editorial headline readable.
const positions=[[0,9],[20,9],[80,0],[80,29],[60,9],[0,38],[0,68],[20,68],[40,80],[60,68],[80,65],[20,96],[60,97]];
positions.forEach(([x,y],i)=>{const p=projects[i%projects.length],button=document.createElement('div');button.className='project-tile';button.style.left=x+'%';button.style.top=y+'%';button.dataset.project=p.id;const img=document.createElement('img');img.src=p.image.replace('.webp','-thumb.webp');img.alt=(p.concept?'Conceito visual para ':'Website de ')+p.title;img.loading='lazy';img.width=640;img.height=427;if(p.concept&&i>6){img.style.setProperty('--crop',i%2?'1.48':'1.22');img.style.transformOrigin=(i%2?'30%':'70%')+' 50%';}const cap=document.createElement('span');cap.className='tile-caption';cap.textContent=p.title+(p.concept?' · Conceito':'');button.append(img,cap);map.append(button);});
const contactDialog=$('#contact-dialog');
contactDialog.setAttribute('data-lenis-prevent','');contactDialog.querySelector('.dialog-close').addEventListener('click',()=>contactDialog.close());contactDialog.addEventListener('close',()=>lock(false));contactDialog.addEventListener('click',e=>{if(e.target===contactDialog){const r=contactDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contactDialog.close();}});
$$('[data-country]').forEach(b=>b.addEventListener('click',()=>{$('#price-amount').textContent=data.prices[b.dataset.country];$$('[data-country]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));}));
function validGoogleBookingUrl(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&((u.hostname==='calendar.google.com'&&u.pathname.startsWith('/calendar/appointments/'))||(u.hostname==='calendar.app.google'&&u.pathname.length>1))?u.href:null;}catch{return null;}
}
const bookingUrl=validGoogleBookingUrl(data.meetingUrl), bookingAction=$('#google-booking-action');
if(bookingUrl){bookingAction.href=bookingUrl;bookingAction.target='_blank';bookingAction.rel='noopener noreferrer';bookingAction.removeAttribute('aria-disabled');$('#booking-status').textContent='Consulte os horários reais no Google Calendar. Abre numa nova aba.';}
else{bookingAction.tabIndex=0;bookingAction.addEventListener('click',e=>e.preventDefault());}
$$('[data-contact]').forEach(b=>b.addEventListener('click',()=>{
 if(b.dataset.contact==='meeting'){if(lenis)lenis.scrollTo('#contact');else $('#contact').scrollIntoView({behavior:reduced?'auto':'smooth'});return;}
 if(data.whatsappNumber){window.open('https://wa.me/'+data.whatsappNumber.replace(/\D/g,'')+'?text='+encodeURIComponent(data.whatsappMessage),'_blank','noopener');return;}
 $('#contact-dialog-description').textContent='O WhatsApp estará disponível assim que o número de contacto da MGL for adicionado. Esta é uma prévia do site; nenhuma mensagem foi enviada.';contactDialog.showModal();lock(true);
}));
$('.dialog-dismiss').addEventListener('click',()=>contactDialog.close());$('#year').textContent=new Date().getFullYear();
const stage=$('.gallery-stage'),active=$('#gallery-active');
let gx=0,gy=0,gTargetX=0,gTargetY=0;
const fine=matchMedia('(hover:hover) and (pointer:fine)');
stage.addEventListener('pointermove',e=>{if(!fine.matches||reduced)return;const r=stage.getBoundingClientRect();gTargetX=-(e.clientX-r.left-r.width/2)*.095;gTargetY=-(e.clientY-r.top-r.height/2)*.12;});
stage.addEventListener('pointerleave',()=>{gTargetX=gTargetY=0;active.textContent='MGL / PROJETOS SELECIONADOS';});
$$('.project-tile').forEach(tile=>{tile.addEventListener('pointerenter',()=>{const p=projects.find(p=>p.id===tile.dataset.project);active.textContent=p.title.toUpperCase()+' / '+(p.concept?'CONCEITO':'WEBSITE');});});
if(matchMedia('(max-width:700px)').matches)$('.gallery-instruction').textContent='Explore os projetos abaixo.';
const hero=$('.hero');hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();window.MGL_MOTION.pointer.x=(e.clientX-r.left)/r.width-.5;window.MGL_MOTION.pointer.y=(e.clientY-r.top)/r.height-.5;});hero.addEventListener('pointerleave',()=>{window.MGL_MOTION.pointer.x=0;window.MGL_MOTION.pointer.y=0;});
if(!reduced&&window.gsap){
 gsap.from('.hero-portrait',{y:35,opacity:0,duration:1.4,ease:'power3.out'});
 gsap.from('.hero-intro,.hero-label,.hero-index,.hero-signature',{y:20,opacity:0,duration:1,stagger:.1,delay:.4,ease:'power3.out'});
 const timeline=gsap.timeline({scrollTrigger:{trigger:'.hero-scroll',start:'top top',end:()=>'+='+innerHeight*1.3,pin:'.hero',scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{window.MGL_MOTION.heroProgress=self.progress;document.querySelectorAll('.hero-index,.scroll-note').forEach(a=>{a.inert=self.progress>.35;});}}});
 timeline.to('.portrait-move',{scale:1.035,yPercent:0,duration:.45,ease:'none'},0)
 .to('.hero-intro,.hero-label,.hero-index,.hero-signature,.scroll-note',{opacity:0,y:-25,duration:.22},.15)
 .to('.hero-wipe',{clipPath:'circle(150% at 50% 72%)',duration:.5,ease:'power2.inOut'},.4)
 .fromTo('.wipe-title',{y:90,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.3,ease:'power2.out'},.62)
 .fromTo('.wipe-kicker',{opacity:0,y:12},{opacity:1,y:0,duration:.2},.8)
 .to({},{duration:.18});
 gsap.from('.manifesto h2>span',{opacity:.18,y:45,stagger:.15,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top 70%',end:'center 45%',scrub:1}});
 gsap.from('.gallery-map .project-tile',{opacity:0,y:45,stagger:.025,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.work',start:'top 80%',once:true}});
 $$('.section-heading,.pricing-title,.price-panel,.process li,.about-text,.contact h2').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 if($('.about-photo')) gsap.fromTo('.about-photo img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom top',scrub:true}});
 const tick=()=>{if(fine.matches){gx+=(gTargetX-gx)*.055;gy+=(gTargetY-gy)*.055;map.style.transform=`translate3d(${gx}px,${gy}px,0)`;}};gsap.ticker.add(tick);
 $$('details').forEach(el=>el.addEventListener('toggle',()=>ScrollTrigger.refresh()));
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh());
}
})();
