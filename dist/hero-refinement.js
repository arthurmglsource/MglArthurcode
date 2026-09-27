/* Bounded parallax, separate from the existing scroll transforms. No idle loop. */
(()=>{
 const hero=document.querySelector('.hero');if(!hero)return;
 const allowed=matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 let targetX=0,targetY=0,x=0,y=0,frame=0,last=0,rect=null;
 const clamp=n=>Math.max(-1,Math.min(1,n));
 function draw(){
  hero.style.setProperty('--portrait-x',(x*5).toFixed(3)+'px');hero.style.setProperty('--portrait-y',(y*5).toFixed(3)+'px');
  hero.style.setProperty('--lines-x',(-x*8).toFixed(3)+'px');hero.style.setProperty('--lines-y',(-y*8).toFixed(3)+'px');
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
