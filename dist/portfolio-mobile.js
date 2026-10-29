/* Compact mobile portfolio. Uses the original project data; no asset copies or autoplay. */
(()=>{'use strict';
 const work=document.getElementById('work'),projects=window.MGL_CONTENT?.projects;
 if(!work||!projects?.length)return;
 const mobile=matchMedia('(max-width:800px)'),motion=matchMedia('(prefers-reduced-motion:reduce)');
 const featuredIds=['vintage-culture','vinicius-figueiredo','malu-criare'];
 const featured=featuredIds.map(id=>projects.find(p=>p.id===id)).filter(Boolean);
 const others=projects.filter(p=>!featuredIds.includes(p.id));
 let root,carousel,slides,prev,next,status,fill,dialog,caseTitle,caseCategory,caseNote,caseImages,closeButton;
 let frame=0,index=0,opener=null,resumeLenis=false,revealObserver=null;
 const pad=n=>String(n).padStart(2,'0');
 function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
 function image(project,screen,sizes){
  const img=el('img');const thumb=screen.image.endsWith('-1280.webp')?screen.image.replace('-1280.webp','-640.webp'):screen.image.replace('.webp','-thumb.webp');
  img.src=thumb;img.srcset=thumb+' 640w, '+screen.image+' 1280w';img.sizes=sizes;
  img.width=1280;img.height=screen.imageHeight;img.loading='lazy';img.decoding='async';img.alt=project.title+' — '+(screen.label||'Página inicial');return img;
 }
 function card(project,number,compact){
  const li=el('li',compact?'mp-grid-item':'mp-slide');li.dataset.project=project.id;
  const button=el('button','mp-open');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','mgl-project-gallery');button.setAttribute('aria-label','Ver projeto '+project.title+(project.concept?' — conceito independente':''));
  const visual=el('span','mp-image');visual.append(image(project,project,compact?'(max-width:800px) 46vw, 360px':'(max-width:600px) 90vw, 75vw'));
  const row=el('span','mp-title-row'),name=el('span','mp-project-name',project.title),arrow=el('span','mp-arrow','↗');arrow.setAttribute('aria-hidden','true');row.append(name,arrow);button.append(visual,row);
  if(!compact){const category=el('span','mp-category'),num=el('span','',pad(number)+' /');category.append(num,document.createTextNode(project.category.toLocaleLowerCase('pt-PT')));button.append(category);}
  else if(project.concept)button.append(el('span','mp-concept','Conceito independente'));
  button.addEventListener('click',()=>openCase(project,button));li.append(button);return li;
 }
 function update(){
  frame=0;if(!mobile.matches)return;
  const left=carousel.getBoundingClientRect().left;
  let closest=0,distance=Infinity;
  slides.forEach((slide,i)=>{const d=Math.abs(slide.getBoundingClientRect().left-left);if(d<distance){distance=d;closest=i;}});
  if(closest===index&&status.childNodes.length)return;
  index=closest;status.replaceChildren(document.createTextNode(pad(index+1)+' '),el('span','','/ '+pad(slides.length)));
  fill.style.transform='translateX('+(index*100)+'%)';prev.disabled=index===0;next.disabled=index===slides.length-1;
  slides.forEach((slide,i)=>{slide.setAttribute('aria-label',pad(i+1)+' de '+pad(slides.length));});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 function go(i){const target=Math.max(0,Math.min(slides.length-1,i));carousel.scrollTo({left:slides[target].offsetLeft-slides[0].offsetLeft,behavior:motion.matches?'instant':'smooth'});}
 function openCase(project,button){
  if(!mobile.matches||dialog.open)return;
  opener=button;caseTitle.textContent=project.title;caseCategory.textContent=project.category;
  caseNote.hidden=!project.concept;caseNote.textContent=project.concept?'Conceito independente, apresentado como estudo de design.':'';
  const screens=[project,...(project.screens||[])];dialog.querySelector('.mp-case-count').textContent=pad(screens.length)+' imagens / '+project.title;
  caseImages.replaceChildren(...screens.map((screen,i)=>{const li=el('li'),figure=el('figure'),caption=el('figcaption');caption.append(el('span','',pad(i+1)),document.createTextNode(screen.label||'Página inicial'));figure.append(image(project,screen,'(max-width:800px) calc(100vw - 32px), 768px'),caption);li.append(figure);return li;}));
  const lenis=window.MGL_MOTION?.lenis;resumeLenis=!!lenis&&!lenis.isStopped;if(resumeLenis)lenis.stop();
  document.body.classList.add('mgl-portfolio-open');dialog.showModal();dialog.scrollTop=0;closeButton.focus({preventScroll:true});
 }
 function build(){
  root=el('div','mgl-mobile-portfolio');
  const header=el('header','mp-heading'),h2=el('h2','','Projetos que mostram valor.');h2.id='work-mobile-title';header.append(h2,el('p','','Websites. Marcas. Experiências.'));
  const highlight=el('section','mp-featured');highlight.setAttribute('aria-label','Projetos em destaque');highlight.setAttribute('aria-roledescription','carrossel');highlight.append(el('p','mp-section-label','PROJETOS EM DESTAQUE'));
  carousel=el('ol','mp-carousel');carousel.id='mp-featured-track';carousel.setAttribute('aria-label','Deslize para explorar os projetos em destaque');carousel.append(...featured.map((p,i)=>card(p,i+1,false)));slides=[...carousel.children];highlight.append(carousel);
  const controls=el('div','mp-controls'),positionWrap=el('div','mp-position-wrap');status=el('p','mp-position');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
  const progress=el('div','mp-progress');progress.setAttribute('aria-hidden','true');fill=el('span');progress.append(fill);positionWrap.append(status,progress);
  const nav=el('div','mp-nav');prev=el('button','','←');next=el('button','','→');
  [prev,next].forEach(b=>{b.type='button';b.setAttribute('aria-controls',carousel.id);});prev.setAttribute('aria-label','Projeto anterior');next.setAttribute('aria-label','Projeto seguinte');prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));nav.append(prev,next);controls.append(positionWrap,nav);highlight.append(controls,el('p','mp-swipe-hint','Deslize para explorar'));
  const explore=el('section','mp-explore'),exploreHeading=el('div','mp-explore-heading'),h3=el('h3','','Explorar projetos');h3.id='mp-explore-title';explore.setAttribute('aria-labelledby',h3.id);exploreHeading.append(h3,el('span','',pad(others.length)+' PROJETOS'));
  const grid=el('ul','mp-grid');grid.append(...others.map((p,i)=>card(p,i+1,true)));explore.append(exploreHeading,grid);
  root.append(header,highlight,explore,el('p','mp-disclosure','Vintage Culture e Super Bock são conceitos independentes, apresentados como estudos de design.'));
  work.querySelector('.work-bar').after(root);
  dialog=el('dialog','mp-case-dialog');dialog.id='mgl-project-gallery';dialog.setAttribute('aria-labelledby','mp-case-title');dialog.setAttribute('data-lenis-prevent','');
  const dialogHeader=el('header','mp-case-header');closeButton=el('button','mp-case-close','FECHAR');closeButton.type='button';closeButton.setAttribute('aria-label','Fechar galeria');const x=el('span','','×');x.setAttribute('aria-hidden','true');closeButton.append(x);dialogHeader.append(el('p','mp-case-count'),closeButton);
  const intro=el('div','mp-case-intro');caseTitle=el('h2');caseTitle.id='mp-case-title';caseCategory=el('p','mp-case-category');caseNote=el('p','mp-case-note');intro.append(caseTitle,caseCategory,caseNote);caseImages=el('ol','mp-case-images');dialog.append(dialogHeader,intro,caseImages);document.body.append(dialog);
  closeButton.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('mgl-portfolio-open');if(resumeLenis)window.MGL_MOTION?.lenis?.start();resumeLenis=false;if(opener&&mobile.matches)opener.focus({preventScroll:true});caseImages.replaceChildren();});
  carousel.addEventListener('scroll',schedule,{passive:true});carousel.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const focused=slides.indexOf(e.target.closest('.mp-slide')),target=Math.max(0,Math.min(slides.length-1,(focused<0?index:focused)+(e.key==='ArrowRight'?1:-1)));slides[target].querySelector('button').focus({preventScroll:true});});
  carousel.addEventListener('focusin',e=>{const slide=e.target.closest('.mp-slide');if(slide)go(slides.indexOf(slide));});
  if(window.gsap&&!motion.matches){
   revealObserver=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;revealObserver.disconnect();gsap.fromTo([header,highlight,explore],{y:12,opacity:.65},{y:0,opacity:1,duration:.55,stagger:.08,ease:'power2.out',clearProps:'transform,opacity'});},{threshold:0});revealObserver.observe(root);
  }
 }
 function sync(){
  if(mobile.matches&&!root)build();
  if(root){work.classList.toggle('has-mobile-portfolio',mobile.matches);work.setAttribute('aria-labelledby',mobile.matches?'work-mobile-title':'work-title');if(mobile.matches)schedule();else if(dialog.open)dialog.close();}
  window.MGL_MOTION?.lenis?.resize();if(!window.MGL_INTRO?.active)window.ScrollTrigger?.refresh();
 }
 sync();mobile.addEventListener('change',sync);window.addEventListener('resize',()=>{if(root&&mobile.matches)schedule();},{passive:true});
})();
