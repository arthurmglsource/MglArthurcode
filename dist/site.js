/* MGL Growth — interaction layer. Project data and contact destinations: content.js. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const data=window.MGL_CONTENT, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis=null, menuOpen=false;
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);}
if(window.Lenis&&!reduced){lenis=new Lenis({duration:1.08,smoothWheel:true,touchMultiplier:1});lenis.on('scroll',()=>window.ScrollTrigger?.update());gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0);}
window.MGL_MOTION={lenis,reduced,heroProgress:0,pointer:{x:0,y:0}};
if(!reduced&&window.gsap){
 gsap.from('.booking-intro',{y:20,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:'.contact.booking',start:'top 85%',once:true}});
}
function lock(on){document.body.classList.toggle('modal-open',on);if(lenis)on?lenis.stop():lenis.start();}
const menu=$('#site-menu'),toggle=$('.menu-toggle');
function setMenu(open){menuOpen=open;menu.hidden=!open;document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');if(lenis)open?lenis.stop():lenis.start();if(open){$('.header').style.position='fixed';menu.querySelector('a').focus();}else{$('.header').style.position='absolute';toggle.focus();}}
toggle.addEventListener('click',()=>setMenu(!menuOpen));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)setMenu(false);if(e.key==='Tab'&&menuOpen){const els=[toggle,...menu.querySelectorAll('a')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();if(menuOpen)setMenu(false);if(lenis)lenis.scrollTo(target,{offset:0});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});if(a.classList.contains('skip')){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));
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
if(!reduced&&window.gsap){
 gsap.from('.portrait-move',{opacity:0,duration:1.2,ease:'power3.out'});
 gsap.from('.hero-intro',{y:20,opacity:0,duration:1,stagger:.1,delay:.4,ease:'power3.out'});
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
 $$('.section-heading,.pricing-title,.process li,.about-text,.contact h2').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 if($('.about-photo')) gsap.fromTo('.about-photo img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom top',scrub:true}});

 $$('details').forEach(el=>el.addEventListener('toggle',()=>ScrollTrigger.refresh()));
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh());
}
})();
