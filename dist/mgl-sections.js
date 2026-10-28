/* Scoped value progression and editorial services. No page-level scroll control. */
(()=>{'use strict';
 const value=document.querySelector('.mgl-value'),services=document.querySelector('.mgl-services');
 if(!value||!services)return;
 const cards=[...value.querySelectorAll('.mgl-principle')],buttons=cards.map(c=>c.querySelector('button')),list=value.querySelector('.mgl-principles'),rows=[...services.querySelectorAll('.mgl-service-link')];
 const subscriptions=[];const listen=(el,type,fn,options)=>{el.addEventListener(type,fn,options);subscriptions.push(()=>el.removeEventListener(type,fn,options));};
 let selected=0,interacting=false;
 const activate=index=>{if(selected===index&&buttons[index].getAttribute('aria-pressed')==='true')return;selected=index;cards.forEach((card,i)=>{card.classList.toggle('is-active',i===index);buttons[i].setAttribute('aria-pressed',String(i===index));});};
 const render=progress=>value.style.setProperty('--value-progress',String(progress));
 let control={select:i=>{activate(i);render((i+.5)/cards.length);},pause:()=>{},resume:()=>{}};
 const focusInside=()=>list.contains(document.activeElement);
 cards.forEach((card,i)=>{
  listen(card,'pointerenter',e=>{if(e.pointerType!=='mouse')return;interacting=true;control.select(i);control.pause();});
  listen(buttons[i],'focus',()=>{control.select(i);control.pause();});
  listen(buttons[i],'click',()=>control.select(i));
 });
 listen(list,'pointerleave',()=>{interacting=false;if(!focusInside())control.resume();});
 listen(list,'focusout',()=>queueMicrotask(()=>{if(!focusInside()&&!interacting)control.resume();}));
 rows.forEach(row=>{listen(row,'pointerenter',e=>{if(e.pointerType==='mouse')row.classList.add('is-active');});listen(row,'pointerleave',()=>row.classList.remove('is-active'));listen(row,'focus',()=>row.classList.add('is-active'));listen(row,'blur',()=>row.classList.remove('is-active'));});
 let media=null;
 if(window.gsap&&window.ScrollTrigger){
  media=gsap.matchMedia();
  media.add({motion:'(prefers-reduced-motion:no-preference)',desktop:'(min-width:1001px)'},context=>{
   if(!context.conditions.motion){activate(0);render(.1);return;}
   const entry=(trigger)=>({trigger,start:'top 94%',toggleActions:'play none none reverse'});
   gsap.from(value.querySelectorAll('.mgl-value-heading>*'),{y:18,opacity:.4,stagger:.07,duration:.7,ease:'power2.out',scrollTrigger:entry(value.querySelector('.mgl-value-heading'))});
   gsap.from(cards,{y:22,opacity:.4,stagger:.065,duration:.65,ease:'power2.out',scrollTrigger:entry(list)});
   gsap.from(services.querySelectorAll('.mgl-services-heading>*'),{y:18,opacity:.4,stagger:.08,duration:.7,ease:'power2.out',scrollTrigger:entry(services.querySelector('.mgl-services-heading'))});
   gsap.from(rows,{y:14,opacity:.5,stagger:.08,duration:.55,ease:'power2.out',scrollTrigger:entry(rows[0])});
   const state={progress:(selected+.5)/cards.length};let cycle=null,visible=false,observer=null,visibility=null,refreshMobile=null;
   const mobilePosition=i=>{const top=cards[i].offsetTop-list.offsetTop;return Math.max(0,Math.min(1,(top+cards[i].offsetHeight/2)/list.offsetHeight));};
   if(context.conditions.desktop){
    cycle=gsap.fromTo(state,{progress:0},{progress:1,duration:9,ease:'none',repeat:-1,paused:true,onUpdate:()=>{render(state.progress);activate(Math.min(cards.length-1,Math.floor(state.progress*cards.length)));}});
    control={select:i=>{cycle.progress((i+.5)/cards.length).pause();activate(i);},pause:()=>cycle.pause(),resume:()=>{if(visible&&!document.hidden&&!interacting&&!focusInside())cycle.play();}};
    observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)control.resume();else cycle.pause();},{threshold:.18});observer.observe(list);
    visibility=()=>{if(document.hidden)cycle.pause();else control.resume();};document.addEventListener('visibilitychange',visibility);
   }else{
    const select=i=>{activate(i);gsap.to(state,{progress:mobilePosition(i),duration:.35,ease:'power2.out',overwrite:true,onUpdate:()=>render(state.progress)});};
    control={select,pause:()=>{},resume:()=>{}};
    const followScroll=()=>{if(focusInside())return;const anchor=innerHeight*.5;let next=0,distance=Infinity;cards.forEach((card,i)=>{const rect=card.getBoundingClientRect(),delta=Math.abs(rect.top+rect.height/2-anchor);if(delta<distance){distance=delta;next=i;}});if(next!==selected)select(next);};
    ScrollTrigger.create({trigger:list,start:'top bottom',end:'bottom top',onUpdate:followScroll});
    refreshMobile=()=>render(mobilePosition(selected));ScrollTrigger.addEventListener('refresh',refreshMobile);render(mobilePosition(selected));
   }
   return()=>{
    cycle?.kill();gsap.killTweensOf(state);
    observer?.disconnect();if(visibility)document.removeEventListener('visibilitychange',visibility);if(refreshMobile)ScrollTrigger.removeEventListener('refresh',refreshMobile);
    control={select:i=>{activate(i);render((i+.5)/cards.length);},pause:()=>{},resume:()=>{}};
   };
  });
 }
 const mobileRows=new IntersectionObserver(entries=>{if(!matchMedia('(hover:none)').matches)return;entries.forEach(entry=>entry.target.classList.toggle('is-active',entry.isIntersecting));},{rootMargin:'-36% 0px -36% 0px',threshold:0});rows.forEach(row=>mobileRows.observe(row));
 const dispose=event=>{if(event.persisted)return;media?.revert();mobileRows.disconnect();subscriptions.forEach(off=>off());window.removeEventListener('pagehide',dispose);};window.addEventListener('pagehide',dispose);
})();
