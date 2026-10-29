/* MGL Growth — interaction layer. Project data and contact destinations: content.js. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const data=window.MGL_CONTENT, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis=null, menuOpen=false;
const isTouch=matchMedia('(hover: none) and (pointer: coarse)').matches||matchMedia('(max-width: 1024px)').matches||('ontouchstart' in window)||(navigator.maxTouchPoints>0);
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});}
if(window.Lenis&&!reduced&&!isTouch){lenis=new Lenis({duration:.9,smoothWheel:true,syncTouch:false,touchMultiplier:1});lenis.on('scroll',()=>window.ScrollTrigger?.update());gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0);}
window.MGL_MOTION={lenis,reduced,heroEntry:null,heroProgress:0,pointer:{x:0,y:0}};
if(!reduced&&window.gsap){
 gsap.from('.booking-intro',{y:20,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:'.contact.booking',start:'top 85%',once:true}});
}
function lock(on){document.body.classList.toggle('modal-open',on);if(lenis)on?lenis.stop():lenis.start();}
const menu=$('#site-menu'),toggle=$('.menu-toggle');
let headerPosition='',returnFocus=true;
const menuItems=[...menu.querySelectorAll('.menu-links a,.menu-bottom')];
const finishClose=()=>{if(menuOpen)return;menu.hidden=true;menu.inert=true;$('.header').style.position=headerPosition;if(returnFocus)toggle.focus({preventScroll:true});};
const menuTimeline=window.gsap&&!reduced ? gsap.timeline({paused:true,onReverseComplete:finishClose})
 .fromTo(menu,{clipPath:'inset(0% 0% 100% 0% round 14px)',opacity:0},{clipPath:'inset(0% 0% 0% 0% round 14px)',opacity:1,duration:.38,ease:'power3.inOut'})
 .fromTo(menuItems,{y:8,opacity:0},{y:0,opacity:1,stagger:.027,duration:.23,ease:'power2.out'},.15) : null;
menu.inert=true;
function setMenu(open,focus=true){
 if(menuOpen===open)return;
 menuOpen=open;returnFocus=focus;
 document.body.classList.toggle('menu-open',open);
 toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
 if(open){if(menu.hidden)headerPosition=$('.header').style.position;$('.header').style.position='fixed';menu.hidden=false;menu.inert=false;if(menuTimeline)menuTimeline.play();menu.querySelector('a').focus({preventScroll:true});}
 else{menu.inert=true;if(menuTimeline)menuTimeline.reverse();else finishClose();}
}
toggle.addEventListener('click',()=>setMenu(!menuOpen));
document.addEventListener('pointerdown',e=>{if(menuOpen&&!menu.contains(e.target)&&!toggle.contains(e.target))setMenu(false,false);});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&menuOpen)setMenu(false);
 if(e.key==='Tab'&&menuOpen){const els=[toggle,...menu.querySelectorAll('a')],first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.getAttribute('href').slice(1));if(!target)return;e.preventDefault();if(menuOpen)setMenu(false,false);if(lenis)lenis.scrollTo(target,{offset:0});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});if(a.classList.contains('skip')){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));
const projects=data.projects,map=$('#gallery-map');
// One case family per project. Screens retain their supplied aspect ratios.
projects.forEach(p=>{
 const group=document.createElement('section');group.className='portfolio-group';group.dataset.project=p.id;
 group.setAttribute('aria-label',p.title+' / '+p.category);
 group.style.setProperty('--case-x',p.position[0]+'px');group.style.setProperty('--case-y',p.position[1]+'px');
 const heading=document.createElement('h3');heading.className='portfolio-group-heading';heading.textContent=p.title+' / '+p.category;
 const track=document.createElement('div');track.className='portfolio-track';
 [p,...(p.screens||[])].forEach((screen,index)=>{
  const tile=document.createElement('figure');tile.className='project-tile';tile.dataset.project=p.id;tile.tabIndex=0;
  tile.style.setProperty('--screen-x',(screen.offset?.[0]||0)+'px');tile.style.setProperty('--screen-y',(screen.offset?.[1]||0)+'px');
  tile.style.setProperty('--screen-width',screen.tileWidth+'px');tile.style.setProperty('--tile-ratio','1280 / '+screen.imageHeight);
  const img=document.createElement('img');
  const thumb=screen.image.endsWith('-1280.webp')?screen.image.replace('-1280.webp','-640.webp'):screen.image.replace('.webp','-thumb.webp');
  img.src=thumb;img.srcset=thumb+' 640w, '+screen.image+' 1280w';img.sizes='(max-width:800px) calc(100vw - 36px), '+screen.tileWidth+'px';
  img.alt=p.title+' / '+(screen.label||'Hero do website');img.loading='lazy';img.decoding='async';img.width=1280;img.height=screen.imageHeight;
  const caption=document.createElement('figcaption');caption.className='tile-caption';caption.textContent=index===0?p.title+' / '+p.category:screen.label||p.title;
  tile.append(img,caption);track.append(tile);
 });
 group.append(heading,track);map.append(group);
});
const contactDialog=$('#contact-dialog');
contactDialog.setAttribute('data-lenis-prevent','');contactDialog.querySelector('.dialog-close').addEventListener('click',()=>contactDialog.close());contactDialog.addEventListener('close',()=>lock(false));contactDialog.addEventListener('click',e=>{if(e.target===contactDialog){const r=contactDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contactDialog.close();}});
$$('[data-country]').forEach(b=>b.addEventListener('click',()=>{$('#price-amount').textContent=data.prices[b.dataset.country];$$('[data-country]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));}));
function validGoogleBookingUrl(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&((u.hostname==='calendar.google.com'&&u.pathname.startsWith('/calendar/appointments/'))||(u.hostname==='calendar.app.google'&&u.pathname.length>1))?u.href:null;}catch{return null;}
}
const bookingUrl=validGoogleBookingUrl(data.meetingUrl), bookingAction=$('#google-booking-action');
if(bookingAction){
 if(bookingUrl){bookingAction.href=bookingUrl;bookingAction.target='_blank';bookingAction.rel='noopener noreferrer';bookingAction.removeAttribute('aria-disabled');}
 else{bookingAction.tabIndex=0;bookingAction.addEventListener('click',e=>e.preventDefault());}
}
$$('[data-contact]').forEach(b=>b.addEventListener('click',()=>{
 if(b.dataset.contact==='meeting'){if(lenis)lenis.scrollTo('#contact');else $('#contact').scrollIntoView({behavior:reduced?'auto':'smooth'});return;}
 const targetUrl=data.whatsappUrl||(data.whatsappNumber?'https://api.whatsapp.com/send/?phone='+data.whatsappNumber.replace(/\D/g,'')+'&text='+encodeURIComponent(data.whatsappMessage)+'&type=phone_number&app_absent=0':null);
 if(targetUrl){window.open(targetUrl,'_blank','noopener,noreferrer');return;}
 $('#contact-dialog-description').textContent='O WhatsApp estará disponível assim que o número de contacto da MGL for adicionado. Esta é uma prévia do site; nenhuma mensagem foi enviada.';contactDialog.showModal();lock(true);
}));
$('.dialog-dismiss').addEventListener('click',()=>contactDialog.close());$('#year').textContent=new Date().getFullYear();
const stage=$('.gallery-stage'),active=$('#gallery-active');
let gx=0,gy=0,gTargetX=0,gTargetY=0,panFrame=0,inView=false;
const fine=matchMedia('(hover:hover) and (pointer:fine)'),archiveMedia=matchMedia('(max-width:800px)');
const bounds=()=>({x:Math.max(0,(map.offsetWidth-stage.clientWidth)/2),y:Math.max(0,(map.offsetHeight-stage.clientHeight)/2)});
const clamp=(v,max)=>Math.max(-max,Math.min(max,v));
// The responsive canvas reports geometry changes; reset only its local pan.
stage.addEventListener('mgl:gallery-layout',()=>{cancelAnimationFrame(panFrame);panFrame=0;gx=gy=gTargetX=gTargetY=0;map.style.transform='';});
const familyFits=tile=>{if(!stage.classList.contains('is-editorial-gallery'))return true;const r=tile.closest('.portfolio-group').getBoundingClientRect(),s=stage.getBoundingClientRect();return r.left>=s.left&&r.right<=s.right&&r.top>=s.top&&r.bottom<=s.bottom;};
function pan(){
 gx+=(gTargetX-gx)*.055;gy+=(gTargetY-gy)*.055;
 if(Math.abs(gTargetX-gx)<.08&&Math.abs(gTargetY-gy)<.08){gx=gTargetX;gy=gTargetY;panFrame=0;}else panFrame=requestAnimationFrame(pan);
 map.style.transform=`translate3d(${gx}px,${gy}px,0)`;
}
function move(x,y){if(archiveMedia.matches)return;const limit=bounds();gTargetX=clamp(x,limit.x);gTargetY=clamp(y,limit.y);if(reduced){gx=gTargetX;gy=gTargetY;map.style.setProperty('transform',`translate3d(${gx}px,${gy}px,0)`,'important');}else if(!panFrame&&inView)panFrame=requestAnimationFrame(pan);}
let drag=null;
stage.addEventListener('pointermove',e=>{
 if(archiveMedia.matches)return;
 if(drag){move(drag.x+e.clientX-drag.clientX,drag.y+e.clientY-drag.clientY);return;}
 if(!fine.matches||reduced)return;
 const hovered=e.target.closest('.project-tile');if(hovered&&familyFits(hovered)){move(gx,gy);return;}
 const r=stage.getBoundingClientRect(),limit=bounds();move((.5-(e.clientX-r.left)/r.width)*2*limit.x,(.5-(e.clientY-r.top)/r.height)*2*limit.y);
});
stage.addEventListener('pointerdown',e=>{if(archiveMedia.matches||e.pointerType==='mouse')return;drag={x:gTargetX,y:gTargetY,clientX:e.clientX,clientY:e.clientY};stage.setPointerCapture(e.pointerId);});
const release=()=>{drag=null;};stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
stage.addEventListener('pointerleave',e=>{if(drag||e.pointerType!=='mouse')return;move(0,0);active.textContent='MGL / PROJETOS SELECIONADOS';});
stage.tabIndex=0;stage.setAttribute('aria-label','Portfólio. Explore com o rato ou com as teclas de seta.');
stage.addEventListener('keydown',e=>{if(archiveMedia.matches||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();const delta={ArrowLeft:[160,0],ArrowRight:[-160,0],ArrowUp:[0,120],ArrowDown:[0,-120],Home:[-gTargetX,-gTargetY]}[e.key];move(gTargetX+delta[0],gTargetY+delta[1]);});
$$('#work .project-tile').forEach(tile=>{
 const p=projects.find(p=>p.id===tile.dataset.project);
 const identify=()=>{active.textContent=p.title.toUpperCase()+' / '+p.category;};
 tile.addEventListener('pointerenter',()=>{identify();if(fine.matches&&!drag&&!stage.contains(document.activeElement)&&familyFits(tile))move(gx,gy);});
 tile.addEventListener('focus',()=>{identify();if(archiveMedia.matches)return;const target=stage.classList.contains('is-editorial-gallery')?tile.closest('.portfolio-group'):tile;const r=target.getBoundingClientRect(),s=stage.getBoundingClientRect();move(gx+s.x+s.width/2-r.x-r.width/2,gy+s.y+s.height/2-r.y-r.height/2);});
});
const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView){cancelAnimationFrame(panFrame);panFrame=0;}else if(!panFrame&&(gx!==gTargetX||gy!==gTargetY))panFrame=requestAnimationFrame(pan);});observer.observe(stage);
function archiveHint(){move(0,0);if(archiveMedia.matches){cancelAnimationFrame(panFrame);panFrame=0;gx=gy=gTargetX=gTargetY=0;map.style.transform='';}$('.gallery-instruction').textContent=archiveMedia.matches?'Explore os projetos abaixo.':reduced?'Use as teclas de seta para explorar.':'Mova o rato para explorar.';}
archiveHint();archiveMedia.addEventListener('change',archiveHint);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(panFrame);observer.disconnect();},{once:true});
if(!reduced&&window.gsap){
 const heroEntry=gsap.timeline({paused:!!window.MGL_INTRO?.active});
 heroEntry.from('.portrait-move',{opacity:0,duration:1.2,ease:'power3.out'},0)
  .from('.hero-intro',{y:20,opacity:0,duration:1,ease:'power3.out'},.4);
 window.MGL_MOTION.heroEntry=heroEntry;
 gsap.matchMedia().add('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)',()=>{
 const timeline=gsap.timeline({scrollTrigger:{trigger:'.hero-scroll',start:'top top',end:()=>'+='+innerHeight*1.3,pin:'.hero',scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{window.MGL_MOTION.heroProgress=self.progress;document.querySelectorAll('.scroll-note').forEach(a=>{a.inert=self.progress>.35;});}}});
 timeline.to('.portrait-move',{scale:1.035,yPercent:0,duration:.45,ease:'none'},0)
 .to('.hero-intro,.scroll-note',{opacity:0,y:-25,duration:.22},.15)
 .to('.hero-wipe',{clipPath:'circle(150% at 50% 72%)',duration:.5,ease:'power2.inOut'},.4)
 .fromTo('.wipe-title',{y:90,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.3,ease:'power2.out'},.62)
 .fromTo('.wipe-kicker',{opacity:0,y:12},{opacity:1,y:0,duration:.2},.8)
 .to({},{duration:.18});
 return ()=>{window.MGL_MOTION.heroProgress=0;document.querySelectorAll('.scroll-note').forEach(a=>{a.inert=false;});};
 });
 gsap.from('#work .portfolio-group',{opacity:0,y:25,stagger:.055,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.work',start:'top 80%',once:true}});
 $$('.section-heading,.pricing-title,.process li,.about-text,.contact h2').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 if($('.about-photo')) gsap.fromTo('.about-photo img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom top',scrub:true}});


 $$('details').forEach(el=>el.addEventListener('toggle',()=>ScrollTrigger.refresh()));
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh());
}
})();
