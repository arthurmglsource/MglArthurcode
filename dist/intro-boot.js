/* Decide before first paint; fail open if storage or the animation is unavailable. */
(()=>{
 const key='mgl:intro:v1';let active=false;
 try{active=!sessionStorage.getItem(key)&&(!location.hash||location.hash==='#top');sessionStorage.setItem(key,'seen');}catch{}
 const state=window.MGL_INTRO={active,ready:false,timeline:null,cleanup:null,finish:null};
 let watchdog=0;
 state.finish=()=>{
  if(!state.active)return;
  state.active=false;clearTimeout(watchdog);state.cleanup?.();
  document.documentElement.classList.remove('mgl-intro-active');
  document.getElementById('mgl-intro')?.remove();
  window.MGL_MOTION?.heroEntry?.play();
 };
 if(active){document.documentElement.classList.add('mgl-intro-active');watchdog=setTimeout(state.finish,3000);}
})();
