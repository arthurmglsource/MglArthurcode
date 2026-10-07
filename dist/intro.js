/* Logo assembly → background mask → approved Hero entry, once per session. */
(()=>{
 const state=window.MGL_INTRO,loader=document.getElementById('mgl-intro');
 if(!state?.active){loader?.remove();return;}
 const logo=document.querySelector('.header .logo'),mark=loader?.querySelector('.mgl-intro-mark');
 if(!loader||!logo||!mark||!window.gsap){state.finish();return;}
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:800px)');
 const guarded=[...document.querySelectorAll('header,main,footer,.skip')].map(el=>({el,inert:el.inert}));
 guarded.forEach(({el})=>{el.inert=true;});
 const interrupt=e=>{if(e.type==='keydown')state.finish();else e.preventDefault();};
 const leave=()=>state.finish();
 const scroll=()=>{if(scrollY>2)state.finish();};
 window.addEventListener('wheel',interrupt,{passive:false,capture:true});
 window.addEventListener('touchmove',interrupt,{passive:false,capture:true});
 window.addEventListener('keydown',interrupt,true);
 window.addEventListener('scroll',scroll,{passive:true});
 window.addEventListener('pagehide',leave);
 reduced.addEventListener('change',leave);
 state.cleanup=()=>{
  state.timeline?.kill();guarded.forEach(({el,inert})=>{el.inert=inert;});
  window.removeEventListener('wheel',interrupt,true);window.removeEventListener('touchmove',interrupt,true);
  window.removeEventListener('keydown',interrupt,true);window.removeEventListener('scroll',scroll);
  window.removeEventListener('pagehide',leave);reduced.removeEventListener('change',leave);
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
  if(!state.active)return;
  if(scrollY>2){state.finish();return;}
  const slices=mark.querySelectorAll('.mgl-intro-slice'),entry=()=>window.MGL_MOTION?.heroEntry?.play();
  const timeline=gsap.timeline({onComplete:state.finish});state.timeline=timeline;
  if(reduced.matches){
   timeline.to(slices,{opacity:1,duration:.08,ease:'none'},.04)
    .call(entry,[],.22).to(loader,{opacity:0,duration:.16,ease:'none'},.22);
  }else{
   const distance=mobile.matches?8:18,exit=mobile.matches?1.26:1.3;
   timeline.fromTo(mark,{scale:.985},{scale:1,duration:.22,ease:'power2.out'},.68)
    .fromTo(slices,{x:i=>(i%2?1:-1)*distance,opacity:0},{x:0,opacity:1,duration:.35,stagger:.045,ease:'power2.out'},.15)
    .set(whole,{opacity:1},.76).set(slices,{visibility:'hidden'},.76)
    .to(mark,{y:-18,opacity:0,duration:.24,ease:'power2.in'},exit)
    .call(entry,[],exit)
    .to(loader,{clipPath:'inset(0% 0% 100% 0%)',duration:.42,ease:'power3.inOut'},exit);
  }
  state.ready=true;
 };
 // Load only the existing bold wordmark font; no wait for images or other fonts.
 let fontTimeout=setTimeout(()=>state.finish(),500);
 document.fonts.load('700 120px "DM Sans"','MGL.').then(()=>{clearTimeout(fontTimeout);start();},()=>state.finish());
})();
