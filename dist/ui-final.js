/* Keep the approved mobile browser intact; compose desktop project families
   around the headline inside a canvas sized to the visible gallery. */
(()=>{'use strict';
 const map=document.getElementById('gallery-map'),title=document.querySelector('#work .gallery-center'),stage=document.querySelector('#work .gallery-stage');
 if(!map||!title||!stage)return;
 const mobile=matchMedia('(max-width:800px)'),projects=window.MGL_CONTENT.projects;
 const families=new Map([...map.querySelectorAll('.portfolio-group')].map(group=>[group.dataset.project,{group,project:projects.find(p=>p.id===group.dataset.project),tiles:[...group.querySelectorAll('.project-tile')]}]));
 const originalSizes=new Map([...map.querySelectorAll('img')].map(img=>[img,img.sizes]));
 let signature='',pending=0;
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const property=(node,name,value)=>node.style.setProperty(name,value+'px');
 function composition(id,desiredWidth,heightBudget){
  const family=families.get(id),screens=[family.project,...family.project.screens],count=screens.length-1;
  const gap=18,caption=28,subGap=12;
  const fractions=count===1?[.58]:count===2?[.49,.43]:[.31,.31,.31];
  const maxSubRatio=Math.max(...screens.slice(1).map(screen=>screen.imageHeight/1280));
  const subRatio=count===3?maxSubRatio/3:Math.max(...screens.slice(1).map((screen,i)=>fractions[i]*screen.imageHeight/1280));
  const ratio=screens[0].imageHeight/1280+subRatio,reserved=gap+caption-(count===3?subGap*2/3*maxSubRatio:0);
  const width=Math.min(desiredWidth,(heightBudget-reserved)/ratio),mainHeight=width*screens[0].imageHeight/1280;
  const positions=[{x:0,y:0,width}];let x=0;
  screens.slice(1).forEach((screen,i)=>{const w=count===3?(width-2*subGap)/3:width*fractions[i];positions.push({x,y:mainHeight+gap,width:w});x+=w+subGap;});
  // Secondary rows are aligned as a family; widths vary, original aspect ratios remain intact.
  const rowWidth=x-subGap,shift=count===1?width-rowWidth:0;
  positions.slice(1).forEach(p=>p.x+=shift);
  const height=Math.max(...positions.map((p,i)=>p.y+p.width*screens[i].imageHeight/1280))+caption;
  return{...family,id,width,height,positions};
 }
 function place(family,x,y){
  property(family.group,'--desktop-case-x',x);property(family.group,'--desktop-case-y',y);property(family.group,'--desktop-case-width',family.width);property(family.group,'--desktop-case-height',family.height);
  family.tiles.forEach((tile,i)=>{const p=family.positions[i];property(tile,'--desktop-screen-x',p.x);property(tile,'--desktop-screen-y',p.y);property(tile,'--desktop-screen-width',p.width);tile.querySelector('img').sizes='(max-width:800px) calc(100vw - 36px), '+Math.ceil(p.width)+'px';});
 }
 function layout(force=false){
  if(mobile.matches||!families.size)return;
  const w=stage.clientWidth,h=stage.clientHeight,key=w+':'+h;if(!force&&key===signature)return;signature=key;
  const gutter=clamp(w*.018,20,42),budget=(h-2.4*gutter)/2,column=(w-4*gutter)/3;
  const headingStyle=getComputedStyle(title.querySelector('h2')),measure=document.createElement('canvas').getContext('2d');measure.font=headingStyle.fontWeight+' '+headingStyle.fontSize+' '+headingStyle.fontFamily;
  const tracking=parseFloat(headingStyle.letterSpacing)||0,titleTarget=Math.min(700,Math.max(...['Projetos que','mostram valor.'].map(line=>measure.measureText(line).width+tracking*(line.length-1)))+24);
  const leftX=gutter+w*.025,rightInset=gutter+w*.015,sideSpace=(w-titleTarget)/2;
  const vintage=composition('vintage-culture',column*.98,budget),malu=composition('malu-criare',column*.86,budget*.87),guarana=composition('guarana-antarctica',column*.95,budget*.96);
  const vinicius=composition('vinicius-figueiredo',Math.min(column*.98,sideSpace-leftX-gutter),budget),beauty=composition('im-beauty',Math.min(column*.89,sideSpace-rightInset-gutter),budget);
  const outerWidth=Math.max(vintage.width,vinicius.width);
  const left=[composition('depra',outerWidth*.96,budget),composition('jonaas',outerWidth*.9,budget*.96),composition('organiza-pj',outerWidth*.95,budget)];
  const right=[composition('madeireira-hr',outerWidth*.96,budget),composition('super-bock',outerWidth,budget),composition('odonto',outerWidth*.9,budget*.94)];
  const side=Math.max(...[...left,...right].map(p=>p.width))+2*gutter;
  const canvasHeight=Math.max(h*1.76,left.reduce((n,p)=>n+p.height,0)+4*gutter,right.reduce((n,p)=>n+p.height,0)+4*gutter),originY=(canvasHeight-h)/2;
  property(stage,'--desktop-canvas-width',w+2*side);property(stage,'--desktop-canvas-height',canvasHeight);
  place(vintage,side+gutter,originY+gutter);place(malu,side+(w-malu.width)/2,originY+gutter+gutter*.45);place(guarana,side+w-gutter-guarana.width,originY+gutter+gutter*.2);
  const rightX=w-rightInset-beauty.width;
  place(vinicius,side+leftX,originY+h-gutter-vinicius.height);place(beauty,side+rightX,originY+h-gutter-beauty.height);
  const titleWidth=Math.min(700,2*Math.min(w/2-leftX-vinicius.width-gutter,rightX-gutter-w/2));
  property(stage,'--desktop-title-width',Math.max(280,titleWidth));property(stage,'--desktop-title-x',side+w/2);property(stage,'--desktop-title-y',originY+(gutter*1.45+malu.height+h)/2);
  [left,right].forEach((column,index)=>column.forEach((family,row)=>{const x=index===0?gutter+(side-2*gutter-family.width)/2:side+w+gutter+(side-2*gutter-family.width)/2;const y=row===0?gutter:row===1?(canvasHeight-family.height)/2:canvasHeight-gutter-family.height;place(family,x,y);}));
  stage.classList.add('is-editorial-gallery');stage.dispatchEvent(new Event('mgl:gallery-layout'));
 }
 function schedule(){if(!pending&&!mobile.matches)pending=requestAnimationFrame(()=>{pending=0;layout();});}
 function sync(){
  if(mobile.matches){map.before(title);stage.classList.remove('is-editorial-gallery');originalSizes.forEach((sizes,img)=>img.sizes=sizes);signature='';}
  else{map.prepend(title);layout(true);}
  window.MGL_MOTION?.lenis?.resize();if(!window.MGL_INTRO?.active)window.ScrollTrigger?.refresh();
 }
 const resize=new ResizeObserver(schedule);resize.observe(stage);sync();mobile.addEventListener('change',sync);document.fonts.ready.then(()=>layout(true));
 window.addEventListener('pagehide',event=>{if(event.persisted)return;resize.disconnect();cancelAnimationFrame(pending);mobile.removeEventListener('change',sync);},{once:true});
})();
