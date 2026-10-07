/* Logo assembly → background mask → approved Hero entry, on every load. */
(()=>{
 const state=window.MGL_INTRO,loader=document.getElementById('mgl-intro');
 if(!state?.active){loader?.remove();return;}
 const logo=document.querySelector('.header .logo'),mark=loader?.querySelector('.mgl-intro-mark');
 if(!loader||!logo||!mark||!window.gsap){state.finish();return;}
 const lenis=window.MGL_MOTION?.lenis,wasStopped=lenis?.isStopped;
 const bodyOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 lenis?.stop();lenis?.scrollTo(0,{immediate:true,force:true});window.scrollTo(0,0);
 // Keep pin geometry, but suspend only the Hero's scroll animation during entry.
 const hero=document.querySelector('.hero');
 const heroScroll=(window.ScrollTrigger?.getAll()||[]).filter(t=>t.pin===hero||t.vars.id==='mgl-mobile-hero-reveal');
 heroScroll.forEach(t=>{t.disable(false);t.animation?.progress(0).pause();});
 const image=hero?.querySelector('.portrait-move img');
 let imageTimeout;
 const imageReady=Promise.race([
  image?.decode().catch(()=>{})||Promise.resolve(),
  new Promise(resolve=>{imageTimeout=setTimeout(resolve,2500);})
 ]).then(()=>clearTimeout(imageTimeout));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:800px)');
 const guarded=[...document.querySelectorAll('header,main,footer,.skip')].map(el=>({el,inert:el.inert}));
 guarded.forEach(({el})=>{el.inert=true;});
 const interrupt=e=>{if(e.type==='keydown')state.finish();else e.preventDefault();};
 const leave=()=>state.finish();
 const scroll=()=>{if(state.active&&scrollY>2)window.scrollTo(0,0);};
 window.addEventListener('wheel',interrupt,{passive:false,capture:true});
 window.addEventListener('touchmove',interrupt,{passive:false,capture:true});
 window.addEventListener('keydown',interrupt,true);
 window.addEventListener('scroll',scroll,{passive:true});
 window.addEventListener('pagehide',leave);
 reduced.addEventListener('change',leave);
 state.cleanup=()=>{
  clearTimeout(imageTimeout);
  state.timeline?.kill();guarded.forEach(({el,inert})=>{el.inert=inert;});
  window.removeEventListener('wheel',interrupt,true);window.removeEventListener('touchmove',interrupt,true);
  window.removeEventListener('keydown',interrupt,true);window.removeEventListener('scroll',scroll);
  window.removeEventListener('pagehide',leave);reduced.removeEventListener('change',leave);
  document.body.style.overflow=bodyOverflow;
  lenis?.scrollTo(0,{immediate:true,force:true});window.scrollTo(0,0);
  heroScroll.forEach(t=>{t.enable(false,false);t.update();t.getTween()?.progress(1);t.animation?.progress(0);});
  window.MGL_MOTION?.heroEntry?.progress(1).pause();
  if(lenis&&!wasStopped)lenis.start();
 };
 const count=reduced.matches?1:6;
 for(let i=0;i<count;i++){
  const slice=document.createElement('div');slice.className='mgl-intro-slice';
  slice.style.setProperty('--slice-top',i/count*100+'%');slice.style.setProperty('--slice-bottom',(count-i-1)/count*100+'%');
  const wordmark=document.createElement('span');wordmark.className=logo.className;
  wordmark.innerHTML=logo.innerHTML;wordmark.querySelector('small')?.remove();
  slice.append(wordmark);mark.append(slice);
 }
 // Switch to one intact copy after alignment, avoiding subpixel seams in the hold.
 const whole=document.createElement('div');whole.className='mgl-intro-whole';
 const complete=mark.querySelector('.logo').cloneNode(true);whole.append(complete);mark.append(whole);
 const start=()=>{
  if(!state.active||state.ready)return;
  const slices=mark.querySelectorAll('.mgl-intro-slice'),entry=()=>window.MGL_MOTION?.heroEntry?.play();
  const timeline=gsap.timeline({onComplete:state.finish});state.timeline=timeline;
  const reveal=()=>{imageReady.then(()=>{if(state.active){entry();timeline.play();}});};
  if(reduced.matches){
   timeline.to(slices,{opacity:1,duration:.08,ease:'none'},.04)
    .addPause(.22,reveal).to(loader,{opacity:0,duration:.16,ease:'none'},.22);
  }else{
   const distance=mobile.matches?8:18,exit=mobile.matches?1.26:1.3;
   timeline.fromTo(mark,{scale:.985},{scale:1,duration:.22,ease:'power2.out'},.68)
    .fromTo(slices,{x:i=>(i%2?1:-1)*distance,opacity:0},{x:0,opacity:1,duration:.35,stagger:.045,ease:'power2.out'},.15)
    .set(whole,{opacity:1},.76).set(slices,{visibility:'hidden'},.76)
    .addPause(exit-.2,reveal)
    .to(mark,{y:-18,opacity:0,duration:.24,ease:'power2.in'},exit)
    .to(loader,{clipPath:'inset(0% 0% 100% 0%)',duration:.42,ease:'power3.inOut'},exit);
  }
  state.ready=true;
 };
 // Load only the existing bold wordmark font; no wait for images or other fonts.
 let fontTimeout=setTimeout(start,500);
 document.fonts.load('700 120px "DM Sans"','MGL.').then(()=>{clearTimeout(fontTimeout);start();},()=>{clearTimeout(fontTimeout);start();});
})();
