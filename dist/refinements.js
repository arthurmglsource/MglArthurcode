(()=>{
 const form=document.querySelector('#lead-form'), feedback=document.querySelector('#lead-feedback');
 let requestId=crypto.randomUUID(), busy=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  const payload=Object.fromEntries(new FormData(form));payload.id=requestId;
  if(payload.phone.replace(/\D/g,'').length<7){feedback.textContent='Indique um telefone válido, incluindo o indicativo.';form.elements.phone.focus();return;}
  busy=true;const button=form.querySelector('button');button.disabled=true;button.textContent='A ENVIAR…';feedback.textContent='';
  try{
   const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(!response.ok||result.ok!==true)throw Error(result.error||'Não foi possível enviar. Tente novamente.');
   feedback.innerHTML='PEDIDO RECEBIDO. Obrigado — o Arthur entrará em contacto consigo. <a href="'+(window.MGL_CONTENT.whatsappUrl||'#')+'" target="_blank" rel="noopener noreferrer" style="text-decoration:underline;margin-left:6px;display:inline-block">Iniciar conversa no WhatsApp ↗</a>';
   form.reset();requestId=crypto.randomUUID();
  }catch(error){feedback.textContent=error.name==='TimeoutError'?'A ligação demorou mais do que o esperado. Tente novamente; os seus dados continuam preenchidos.':error.message==='Failed to fetch'?'Não foi possível ligar. Verifique a ligação e tente novamente.':error.message;}
  finally{busy=false;button.disabled=false;button.innerHTML='QUERO SER CONTACTADO <span>↗</span>';}
 });
 const ig=document.querySelector('#footer-instagram');
 try{const u=new URL(window.MGL_CONTENT.instagramUrl);if(u.protocol==='https:'&&['instagram.com','www.instagram.com'].includes(u.hostname)){ig.href=u.href;ig.target='_blank';ig.rel='noopener noreferrer';ig.removeAttribute('aria-disabled');}}catch{}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&window.gsap){
  gsap.from('.lead-heading,.lead-fields label',{y:35,opacity:0,stagger:.09,duration:.8,scrollTrigger:{trigger:'.lead-section',start:'top 80%',once:true}});
  gsap.from('.footer-brand span',{yPercent:105,rotate:6,stagger:.1,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:'.footer-brand',start:'top 92%',once:true},clearProps:'transform'});
  const area=document.querySelector('.booking-area'),mark=document.querySelector('.booking-mark');
  if(area&&mark){
   area.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=area.getBoundingClientRect();gsap.to(mark,{x:(e.clientX-r.left-r.width/2)*.06,y:(e.clientY-r.top-r.height/2)*.04,duration:.6});});
   area.addEventListener('pointerleave',()=>gsap.to(mark,{x:0,y:0,duration:.6}));
  }
 }
})();
