/* Section-scoped reveals. Natural scroll, reversible entry, no pins. */
(()=>{
 const founder=document.querySelector('#about'),presence=document.querySelector('#price');
 if(!founder||!presence||!window.gsap||!window.ScrollTrigger)return;
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion:no-preference)',()=>{
  const entry=(id,trigger,start='top 88%')=>({id,trigger,start,toggleActions:'play none none reverse'});
  gsap.fromTo(founder.querySelector('picture'),{clipPath:'inset(0% 0% 12% 0% round 18px)'},{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:.95,ease:'power2.out',scrollTrigger:entry('mgl-founder-photo',founder.querySelector('picture'))});
  const narrative=gsap.timeline({scrollTrigger:entry('mgl-founder-narrative',founder.querySelector('.founder-copy'))});
  narrative.from(founder.querySelectorAll('.founder-line>span'),{yPercent:105,duration:.8,stagger:.08,ease:'power3.out'},0)
   .from(founder.querySelectorAll('.founder-copy>p'),{opacity:0,y:8,duration:.65,stagger:.09,ease:'power2.out'},.22)
   .from(founder.querySelector('.founder-signature'),{opacity:0,y:8,duration:.6,ease:'power2.out'},.55);
  gsap.fromTo(presence,{'--curve-reveal':.35},{'--curve-reveal':1,ease:'none',scrollTrigger:{id:'mgl-presence-curve',trigger:presence,start:'top bottom',end:'top 70%',scrub:.35,invalidateOnRefresh:true}});
  gsap.fromTo(presence.querySelector('.offer-portrait img'),{scale:1.03},{scale:1,duration:1.1,ease:'power2.out',scrollTrigger:entry('mgl-presence-photo',presence.querySelector('.offer-portrait'))});
  gsap.from(presence.querySelector('.offer-card'),{opacity:0,x:10,y:18,duration:.8,ease:'power2.out',scrollTrigger:entry('mgl-presence-card',presence.querySelector('.offer-card'))});
  gsap.from(presence.querySelectorAll('.offer-services li'),{opacity:0,y:8,stagger:.055,duration:.55,ease:'power2.out',scrollTrigger:entry('mgl-presence-bullets',presence.querySelector('.offer-services'),'top 91%')});
  const purchase=gsap.timeline({scrollTrigger:entry('mgl-presence-purchase',presence.querySelector('.country-switch'),'top 92%')});
  purchase.from(presence.querySelector('.country-switch'),{opacity:0,y:8,duration:.4,ease:'power2.out'},0)
   .from(presence.querySelector('.price-value'),{opacity:0,y:12,duration:.55,ease:'power2.out'},.12)
   .from(presence.querySelector('.mgl-cta'),{opacity:0,y:8,duration:.55,ease:'power2.out'},.3)
   .from(presence.querySelector('.underlink'),{opacity:0,duration:.4},.45);
 });
 const dispose=event=>{if(event.persisted)return;media.revert();window.removeEventListener('pagehide',dispose);};
 window.addEventListener('pagehide',dispose);
})();
