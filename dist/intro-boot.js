/* Activate on every document load, before first paint. */
(()=>{
 const active=true,restoration=history.scrollRestoration;
 const overflow=[document.documentElement.style.overflow];
 history.scrollRestoration='manual';
 document.documentElement.style.overflow='hidden';
 const state=window.MGL_INTRO={active,ready:false,timeline:null,cleanup:null,finish:null};
 let watchdog=0;
 state.finish=()=>{
  if(!state.active)return;
  state.active=false;clearTimeout(watchdog);state.cleanup?.();
  document.documentElement.style.overflow=overflow[0];
  document.documentElement.classList.remove('mgl-intro-active');
  document.getElementById('mgl-intro')?.remove();
  history.scrollRestoration=restoration;
  window.MGL_MOTION?.heroEntry?.progress(1).pause();
  if(location.hash&&location.hash!=='#top'){
   const target=document.getElementById(location.hash.slice(1));
   if(target)requestAnimationFrame(()=>target.scrollIntoView());
  }
 };
 if(active){document.documentElement.classList.add('mgl-intro-active');watchdog=setTimeout(state.finish,5000);}
})();
