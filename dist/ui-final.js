/* Mobile reuses the existing screenshots. The desktop canvas keeps its exact DOM. */
(()=>{
 const map=document.getElementById('gallery-map'),projects=window.MGL_CONTENT?.projects;
 if(!map||!projects)return;
 const tiles=[...map.children],mobile=matchMedia('(max-width:800px)');
 const order=['malu-criare','jonaas','madeireira-hr','vinicius-figueiredo','super-bock','organiza-pj'];
 function sync(){
  tiles.forEach(tile=>map.append(tile));map.querySelectorAll('.portfolio-group').forEach(group=>group.remove());
  if(mobile.matches)order.forEach(id=>{
   const project=projects.find(p=>p.id===id),screens=tiles.filter(t=>t.dataset.project===id);if(!project||!screens.length)return;
   const section=document.createElement('section');section.className='portfolio-group';section.setAttribute('aria-label',project.title+(project.concept?' · CONCEPT PROJECT':''));
   const heading=document.createElement('h3');heading.className='portfolio-group-heading';
   const title=document.createElement('strong');title.textContent=project.title+(project.concept?' · CONCEPT PROJECT':'');
   const count=document.createElement('span');count.textContent=String(screens.length).padStart(2,'0')+' '+(screens.length===1?'PRINT':'PRINTS');heading.append(title,count);
   const track=document.createElement('div');track.className='portfolio-track';track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-label','Prints de '+project.title);track.setAttribute('data-lenis-prevent','');
   screens.forEach(tile=>{track.append(tile);tile.querySelector('img').sizes='(max-width:800px) 86vw, 20vw';});
   section.append(heading,track);map.append(section);
  });
  else tiles.forEach(tile=>tile.querySelector('img').sizes='(max-width:700px) calc(100vw - 36px), 20vw');
  refresh();
 }
 // Refresh after actual layout assets arrive, coalesced instead of once per image.
 let frame=0;
 function refresh(){clearTimeout(frame);frame=setTimeout(()=>{frame=0;if(window.MGL_INTRO?.active){refresh();return;}window.ScrollTrigger?.refresh();},150);}
 sync();mobile.addEventListener('change',sync);
 document.querySelectorAll('img').forEach(image=>{if(!image.complete)image.addEventListener('load',refresh,{once:true});});
 document.fonts.ready.then(refresh);window.addEventListener('pageshow',refresh);
})();
