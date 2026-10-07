/* Bounded parallax, separate from the existing scroll transforms. No idle loop. */
(()=>{
 const hero=document.querySelector('.hero');if(!hero)return;
 const allowed=matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 let targetX=0,targetY=0,x=0,y=0,frame=0,last=0,rect=null;
 const clamp=n=>Math.max(-1,Math.min(1,n));
 function draw(){
  hero.style.setProperty('--portrait-x',(x*5).toFixed(3)+'px');hero.style.setProperty('--portrait-y',(y*5).toFixed(3)+'px');
  hero.style.setProperty('--ui-x',(x*2).toFixed(3)+'px');hero.style.setProperty('--ui-y',(y*2).toFixed(3)+'px');
 }
 function tick(time){
  const dt=Math.min(40,last?time-last:16.7);last=time;
  const ease=1-Math.exp(-dt/150);x+=(targetX-x)*ease;y+=(targetY-y)*ease;draw();
  if(Math.abs(targetX-x)+Math.abs(targetY-y)>.001)frame=requestAnimationFrame(tick);
  else{x=targetX;y=targetY;draw();frame=0;last=0;}
 }
 function animate(){if(!frame)frame=requestAnimationFrame(tick);}
 hero.addEventListener('pointerenter',()=>{rect=hero.getBoundingClientRect();});
 hero.addEventListener('pointermove',e=>{
  if(!allowed.matches||e.pointerType!=='mouse')return;
  rect??=hero.getBoundingClientRect();
  targetX=clamp(((e.clientX-rect.left)/rect.width-.5)*2);targetY=clamp(((e.clientY-rect.top)/rect.height-.5)*2);animate();
 });
 function leave(){targetX=targetY=0;rect=null;if(allowed.matches)animate();}
 hero.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
 window.addEventListener('resize',()=>{rect=null;});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 function reset(){cancelAnimationFrame(frame);frame=0;last=0;targetX=targetY=x=y=0;rect=null;draw();}
 allowed.addEventListener('change',reset);
 const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)reset();});observer.observe(hero);
})();

/* A short, unpinned BE FOUND transition immediately after the mobile hero. */
(()=>{
 const section=document.querySelector('.mobile-found');
 if(!section||!window.gsap||!window.ScrollTrigger)return;
 const media=gsap.matchMedia();
 media.add('(min-width:901px) and (max-width:1023px) and (prefers-reduced-motion:no-preference)',()=>{
  const title=section.querySelector('.mobile-found-title');
  const timeline=gsap.timeline({scrollTrigger:{id:'mgl-mobile-found',trigger:section,start:'top 85%',end:'center 50%',scrub:.45}});
  timeline.fromTo(title,{opacity:.25,y:28,scale:.96},{opacity:1,y:0,scale:1,duration:1,ease:'none'},0)
   .fromTo(section.querySelector('.mobile-found-kicker'),{opacity:.3},{opacity:1,duration:.6,ease:'none'},.2);
 });
 // Same circle, title rise and progression as desktop, with a shorter mobile pin.
 media.add('(max-width:900px) and (prefers-reduced-motion:no-preference)',()=>{
  const hero=document.querySelector('.hero');
  const scrollNote=hero?.querySelector('.scroll-note');
  const timeline=gsap.timeline({scrollTrigger:{id:'mgl-mobile-hero-reveal',trigger:'.hero-scroll',start:'top top',end:()=>'+='+hero.clientHeight*.85,pin:hero,scrub:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{if(scrollNote)scrollNote.inert=self.progress>.35;}}});
  timeline.to('.portrait-move',{scale:1.035,yPercent:0,duration:.45,ease:'none'},0)
   .to('.hero-intro,.scroll-note',{opacity:0,y:-25,duration:.22},.15)
   .to('.hero-wipe',{clipPath:'circle(150% at 50% 72%)',duration:.5,ease:'power2.inOut'},.4)
   .fromTo('.wipe-title',{y:90,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.3,ease:'power2.out'},.62)
   .fromTo('.wipe-kicker',{opacity:0,y:12},{opacity:1,y:0,duration:.2},.8)
   .to({},{duration:.18});
  return ()=>{if(scrollNote)scrollNote.inert=false;};
 });
 const dispose=event=>{if(event.persisted)return;media.revert();window.removeEventListener('pagehide',dispose);};
 window.addEventListener('pagehide',dispose);
})();
