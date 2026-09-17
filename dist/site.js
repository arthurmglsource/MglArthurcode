/* MGL Growth — interaction layer. Project data and contact destinations: content.js. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const data=window.MGL_CONTENT, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis=null, menuOpen=false;
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);}
if(window.Lenis&&!reduced){lenis=new Lenis({duration:1.08,smoothWheel:true,touchMultiplier:1});lenis.on('scroll',()=>window.ScrollTrigger?.update());gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0);}
window.MGL_MOTION={lenis,reduced,heroProgress:0,pointer:{x:0,y:0}};
function lock(on){document.body.classList.toggle('modal-open',on);if(lenis)on?lenis.stop():lenis.start();}
const menu=$('#site-menu'),toggle=$('.menu-toggle');
function setMenu(open){menuOpen=open;menu.hidden=!open;document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');if(lenis)open?lenis.stop():lenis.start();if(open){$('.header').style.position='fixed';menu.querySelector('a').focus();}else{$('.header').style.position='absolute';toggle.focus();}}
toggle.addEventListener('click',()=>setMenu(!menuOpen));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuOpen)setMenu(false);if(e.key==='Tab'&&menuOpen){const els=[toggle,...menu.querySelectorAll('a')];const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();if(menuOpen)setMenu(false);if(lenis)lenis.scrollTo(target,{offset:0});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});if(a.classList.contains('skip')){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}}));
const projects=data.projects,map=$('#gallery-map'),index=$('#project-index');
// Asymmetric archive: the empty centre keeps the editorial headline readable.
const positions=[[-3,8],[17,8],[82,0],[-3,36],[62,8],[82,29],[-3,65],[17,65],[37,77],[62,66],[82,63],[17,94],[62,95]];
positions.forEach(([x,y],i)=>{const p=projects[i%projects.length],button=document.createElement('button');button.className='project-tile';button.style.left=x+'%';button.style.top=y+'%';button.dataset.project=p.id;button.setAttribute('aria-label',p.title+' — abrir conceito visual');const img=document.createElement('img');img.src=p.image.replace('.webp','-thumb.webp');img.alt='Conceito visual não comissionado para '+p.title;img.loading='lazy';img.width=640;img.height=427;if(i>2){img.style.setProperty('--crop',i%2?'1.48':'1.22');img.style.transformOrigin=(i%2?'30%':'70%')+' 50%';}const cap=document.createElement('span');cap.className='tile-caption';cap.innerHTML='<span>'+p.title+'</span><span>↗</span>';button.append(img,cap);map.append(button);});
projects.forEach((p,i)=>{const b=document.createElement('button');b.className='index-project';b.dataset.project=p.id;b.innerHTML='<small>0'+(i+1)+'</small><img src="'+p.image.replace('.webp','-thumb.webp')+'" alt=""><span><h3>'+p.title+'</h3><span class="index-category">'+p.category+'</span></span><b aria-hidden="true">↗</b>';index.append(b);});
const projectDialog=$('#project-dialog'),contactDialog=$('#contact-dialog');
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{const p=projects.find(p=>p.id===b.dataset.project);$('#project-image').src=p.image;$('#project-image').alt='Estudo visual para '+p.title+' — conceito não comissionado';$('#project-title').textContent=p.title;$('#project-description').textContent=p.description;$('#project-scope').textContent=p.scope;projectDialog.showModal();projectDialog.scrollTop=0;lock(true);}));
$$('dialog').forEach(dialog=>{dialog.setAttribute('data-lenis-prevent','');dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>lock(false));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
$('.project-cta').addEventListener('click',()=>{projectDialog.close();if(lenis)lenis.scrollTo('#contact');else $('#contact').scrollIntoView({behavior:'smooth'});});
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>{const showIndex=b.dataset.view==='index';$('.gallery-stage').hidden=showIndex;index.hidden=!showIndex;$$('[data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));window.ScrollTrigger?.refresh();}));
$$('[data-country]').forEach(b=>b.addEventListener('click',()=>{$('#price-amount').textContent=data.prices[b.dataset.country];$$('[data-country]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));}));
$$('[data-contact]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.contact==='whatsapp'&&data.whatsappNumber){window.open('https://wa.me/'+data.whatsappNumber.replace(/\D/g,'')+'?text='+encodeURIComponent(data.whatsappMessage),'_blank','noopener');return;}if(b.dataset.contact==='meeting'&&data.meetingUrl){window.open(data.meetingUrl,'_blank','noopener');return;}$('#contact-dialog-description').textContent=b.dataset.contact==='whatsapp'?'O WhatsApp estará disponível assim que o número de contacto da MGL for adicionado. Esta é uma prévia do site; nenhuma mensagem foi enviada.':'O agendamento estará disponível assim que o link de reuniões da MGL for adicionado. Esta é uma prévia do site; nenhuma reunião foi marcada.';contactDialog.showModal();lock(true);}));$('.dialog-dismiss').addEventListener('click',()=>contactDialog.close());$('#year').textContent=new Date().getFullYear();
if(data.whatsappNumber&&data.meetingUrl)$('.contact-pending').hidden=true;
const stage=$('.gallery-stage'),cursor=$('.gallery-cursor'),active=$('#gallery-active');
let gx=0,gy=0,gTargetX=0,gTargetY=0;
const fine=matchMedia('(hover:hover) and (pointer:fine)');
stage.addEventListener('pointermove',e=>{if(!fine.matches||reduced)return;const r=stage.getBoundingClientRect();gTargetX=-(e.clientX-r.left-r.width/2)*.095;gTargetY=-(e.clientY-r.top-r.height/2)*.12;cursor.style.left=e.clientX-r.left+'px';cursor.style.top=e.clientY-r.top+'px';});
stage.addEventListener('pointerleave',()=>{gTargetX=gTargetY=0;cursor.style.opacity=0;active.textContent='MGL / EXPLORAÇÕES VISUAIS';});
$$('.project-tile').forEach(b=>{b.addEventListener('pointerenter',()=>{active.textContent=projects.find(p=>p.id===b.dataset.project).title.toUpperCase()+' / CONCEITO';if(fine.matches&&!reduced)cursor.style.opacity=1;});b.addEventListener('pointerleave',()=>{cursor.style.opacity=0;});});
if(matchMedia('(max-width:700px)').matches)$('.gallery-instruction').textContent='Toque nas imagens para descobrir cada conceito.';
const hero=$('.hero');hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();window.MGL_MOTION.pointer.x=(e.clientX-r.left)/r.width-.5;window.MGL_MOTION.pointer.y=(e.clientY-r.top)/r.height-.5;});hero.addEventListener('pointerleave',()=>{window.MGL_MOTION.pointer.x=0;window.MGL_MOTION.pointer.y=0;});
if(!reduced&&window.gsap){
 gsap.from('.hero-portrait',{y:35,opacity:0,duration:1.4,ease:'power3.out'});
 gsap.from('.hero-intro,.hero-label,.hero-index,.hero-signature',{y:20,opacity:0,duration:1,stagger:.1,delay:.4,ease:'power3.out'});
 const timeline=gsap.timeline({scrollTrigger:{trigger:'.hero-scroll',start:'top top',end:()=>'+='+innerHeight*1.3,pin:'.hero',scrub:1,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{window.MGL_MOTION.heroProgress=self.progress;document.querySelectorAll('.hero-index,.scroll-note').forEach(a=>{a.inert=self.progress>.35;});}}});
 timeline.to('.portrait-move',{scale:1.07,yPercent:3,duration:.45,ease:'none'},0)
 .to('.hero-intro,.hero-label,.hero-index,.hero-signature,.scroll-note',{opacity:0,y:-25,duration:.22},.15)
 .to('.hero-wipe',{clipPath:'circle(150% at 50% 72%)',duration:.5,ease:'power2.inOut'},.4)
 .fromTo('.wipe-title',{y:90,opacity:0,scale:.95},{y:0,opacity:1,scale:1,duration:.3,ease:'power2.out'},.62)
 .fromTo('.wipe-kicker',{opacity:0,y:12},{opacity:1,y:0,duration:.2},.8)
 .to({},{duration:.18});
 gsap.from('.manifesto h2>span',{opacity:.18,y:45,stagger:.15,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top 70%',end:'center 45%',scrub:1}});
 gsap.from('.gallery-map .project-tile',{opacity:0,y:45,stagger:.025,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.work',start:'top 80%',once:true}});
 $$('.section-heading,.pricing-title,.price-panel,.process li,.about-text,.contact h2').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 gsap.fromTo('.about-photo img',{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom top',scrub:true}});
 const tick=()=>{if(fine.matches){gx+=(gTargetX-gx)*.055;gy+=(gTargetY-gy)*.055;map.style.transform=`translate3d(${gx}px,${gy}px,0)`;}};gsap.ticker.add(tick);
 $$('details').forEach(el=>el.addEventListener('toggle',()=>ScrollTrigger.refresh()));
 document.fonts.ready.then(()=>ScrollTrigger.refresh());window.addEventListener('load',()=>ScrollTrigger.refresh());
}
// Quiet topographic field, drawn at capped device resolution. Suspended when offscreen.
const canvas=$('#field-canvas'),ctx=canvas.getContext('2d');let cw=0,ch=0,visible=true,last=0;
function resizeField(){const d=Math.min(devicePixelRatio,1.5);cw=hero.clientWidth;ch=hero.clientHeight;canvas.width=cw*d;canvas.height=ch*d;ctx.setTransform(d,0,0,d,0,0);drawField(0);}
function drawField(time){ctx.clearRect(0,0,cw,ch);ctx.strokeStyle='#c6c9bd';ctx.lineWidth=.65;ctx.globalAlpha=.52;const drift=reduced?0:time*.000065;const pointer=window.MGL_MOTION.pointer;for(let k=0;k<13;k++){ctx.beginPath();for(let i=0;i<=170;i++){const a=i/170*Math.PI*2,r=180+k*110;const wave=Math.sin(a*3+drift)*45+Math.cos(a*5-drift*.8)*20;const x=cw*.51+(r+wave)*Math.cos(a)*1.55+pointer.x*9;const y=ch*.5+(r+wave)*Math.sin(a)*.72+pointer.y*9;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();}}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(hero);resizeField();window.addEventListener('resize',resizeField);function loop(t){if(visible&&!reduced&&t-last>40){drawField(t);last=t;}requestAnimationFrame(loop);}if(!reduced)requestAnimationFrame(loop);
})();
