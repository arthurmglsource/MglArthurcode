/* The manifesto follows scroll in reading order; its layout stays untouched. */
(() => {
  const heading = document.querySelector('#manifesto h2');
  if (!heading || !window.gsap || !window.ScrollTrigger) return;

  const media = gsap.matchMedia();
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 700px)'
  }, context => {
    if (!context.conditions.motion) return;

    // Keep inline spans (not inline-blocks), original spaces and line wrappers.
    // This preserves wrapping, tracking, emphasis and the accessible heading.
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const words = [];
    const replacements = [];
    nodes.forEach(original => {
      if (!original.textContent.trim()) return;
      const fragment = document.createDocumentFragment();
      const generated = original.textContent.split(/(\s+)/).filter(Boolean).map(token => {
        if (/^\s+$/.test(token)) return document.createTextNode(token);
        const word = document.createElement('span');
        word.className = 'manifesto-word';
        word.textContent = token;
        words.push(word);
        return word;
      });
      generated.forEach(node => fragment.append(node));
      original.replaceWith(fragment);
      replacements.push({original, generated});
    });

    const mobile = context.conditions.mobile;
    // Animate a scoped colour variable, bypassing the shared dark span rules.
    gsap.set(words, {'--word-color':'#484848', opacity:1});
    gsap.to(words, {
      '--word-color':'#f7f7f7',
      duration:0.22,
      stagger:{amount:1},
      ease:'none',
      scrollTrigger:{
        id:'mgl-manifesto-words', trigger:heading,
        start:mobile ? 'top 82%' : 'top 85%',
        end:()=>'+='+Math.max(heading.offsetHeight,innerHeight*(mobile ? .43 : .55)),
        scrub:mobile ? .18 : .3,
        invalidateOnRefresh:true
      }
    });

    return () => {
      replacements.forEach(({original, generated}) => {
        const first = generated[0];
        if (first.parentNode) first.before(original);
        generated.forEach(node => node.remove());
      });
    };
  });

  // Revert only this component. Keep BFCache snapshots alive when navigating back.
  const dispose = event => {
    if (event.persisted) return;
    media.revert();
    window.removeEventListener('pagehide', dispose);
  };
  window.addEventListener('pagehide', dispose);
})();
