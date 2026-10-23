/* The portfolio headline shares its reserved space on the virtual canvas.
   On mobile it returns above the same case families, without cloned images. */
(()=>{
 const map=document.getElementById('gallery-map'),title=document.querySelector('#work .gallery-center');
 if(!map||!title)return;
 const mobile=matchMedia('(max-width:800px)');
 function sync(){
  if(mobile.matches)map.before(title);else map.prepend(title);
  window.MGL_MOTION?.lenis?.resize();
  // Case dimensions are explicit; images do not trigger global refresh loops.
  if(!window.MGL_INTRO?.active)window.ScrollTrigger?.refresh();
 }
 sync();mobile.addEventListener('change',sync);
})();
