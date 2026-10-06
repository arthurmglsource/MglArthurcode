/* Six chapters, fifteen supplied screens. One timeline per chapter, never per word. */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const media = gsap.matchMedia();
  media.add({desktop:'(min-width:801px)', motion:'(prefers-reduced-motion:no-preference)'}, context => {
    if (!context.conditions.motion) return;
    const chapters = [...document.querySelectorAll('.story-chapter')];
    if (context.conditions.desktop) {
      chapters.forEach((chapter, index) => {
        chapter.classList.add('story-motion');
        const screens = [...chapter.querySelectorAll('.story-screen')];
        const timeline = gsap.timeline({scrollTrigger:{id:'mgl-story-'+index,trigger:chapter,start:'top top',end:()=>'+='+innerHeight * Math.max(.5,(screens.length-1)*.65),pin:true,scrub:.55,anticipatePin:1,invalidateOnRefresh:true}});
        timeline.to({}, {duration:.3});
        screens.slice(1).forEach((screen,i) => {
          gsap.set(screen,{yPercent:115,rotation:i%2 ? -3 : 3,scale:.96,clipPath:'inset(0% 0% 16% 0%)'});
          timeline.to(screen,{yPercent:0,rotation:0,scale:1,clipPath:'inset(0% 0% 0% 0%)',duration:1,ease:'none'});
          timeline.to({}, {duration:.3});
        });
        if (screens.length===1) timeline.fromTo(screens[0],{scale:.97},{scale:1,duration:1,ease:'none'});
      });
    } else {
      chapters.forEach((chapter,index) => gsap.from(chapter.querySelectorAll('.story-screen'),{y:18,opacity:.7,stagger:.15,ease:'none',scrollTrigger:{id:'mgl-story-mobile-'+index,trigger:chapter.querySelector('.story-screens'),start:'top 92%',end:'bottom 75%',scrub:.25}}));
    }
    gsap.from('.ecosystem-stage',{y:16,opacity:.25,stagger:.18,duration:.55,ease:'power2.out',scrollTrigger:{id:'mgl-ecosystem',trigger:'.ecosystem-funnel',start:'top 85%',once:true}});
    return () => chapters.forEach(chapter => chapter.classList.remove('story-motion'));
  });
  const dispose = event => {if(event.persisted)return;media.revert();window.removeEventListener('pagehide',dispose);};
  window.addEventListener('pagehide',dispose);
})();
