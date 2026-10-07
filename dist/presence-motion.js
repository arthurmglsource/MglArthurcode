/* Section-scoped reveals. Natural scroll, reversible entry, no pins. */
(()=>{
 const founder=document.querySelector('#about');
 if(!founder||!window.gsap||!window.ScrollTrigger)return;
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion:no-preference)',()=>{
  const entry=(id,trigger,start='top 88%')=>({id,trigger,start,toggleActions:'play none none reverse'});
  gsap.fromTo(founder.querySelector('picture'),{clipPath:'inset(0% 0% 12% 0% round 18px)'},{clipPath:'inset(0% 0% 0% 0% round 18px)',duration:.95,ease:'power2.out',scrollTrigger:entry('mgl-founder-photo',founder.querySelector('picture'))});
  const narrative=gsap.timeline({scrollTrigger:entry('mgl-founder-narrative',founder.querySelector('.founder-copy'))});
  narrative.from(founder.querySelectorAll('.founder-line>span'),{yPercent:105,duration:.8,stagger:.08,ease:'power3.out'},0)
   .from(founder.querySelectorAll('.founder-copy>p'),{opacity:0,y:8,duration:.65,stagger:.09,ease:'power2.out'},.22)
   .from(founder.querySelector('.founder-signature'),{opacity:0,y:8,duration:.6,ease:'power2.out'},.55);

 });
 const dispose=event=>{if(event.persisted)return;media.revert();window.removeEventListener('pagehide',dispose);};
 window.addEventListener('pagehide',dispose);
})();
