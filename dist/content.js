/* Substituir contactos e conceitos pelos dados reais e voltar a publicar. */
// Google Calendar appointment schedule: 30 minutes, Google Meet.
// In Google's booking form, add Company and WhatsApp alongside name/email.
// Only this setting needs changing to activate all meeting actions.
const GOOGLE_BOOKING_URL = "[ADD REAL GOOGLE CALENDAR BOOKING LINK]";
window.MGL_CONTENT={
 whatsappNumber:'',
 whatsappMessage:'Olá, gostaria de conversar sobre a presença digital do meu negócio.',
 meetingUrl:GOOGLE_BOOKING_URL,
 prices:{PT:'€89',BR:'R$497'},
 projects:[
  {id:'organiza-pj',title:'Organiza PJ',category:'FINANCEIRO & BPO / WEBSITE',image:'assets/project-organiza-pj.webp',description:'Uma presença digital para a Organiza PJ, com uma mensagem direta sobre clareza financeira, controlo e crescimento. A composição aproxima as pessoas por trás do negócio e a sua proposta de valor.',scope:'Website',concept:false},
  {id:'super-bock-website',title:'Super Bock — Website',category:'BEBIDAS / WEBSITE',image:'assets/project-super-bock-site.webp',description:'Vermelho, tipografia de grande escala e produto em primeiro plano. Um website que explora a presença visual da Super Bock e o ritual à volta da marca.',scope:'Website',concept:false},
  {id:'jonaas',title:'Jonaas',category:'MARCA PESSOAL / WEBSITE',image:'assets/project-jonaas.webp',description:'O retrato como ponto de partida. Uma apresentação digital centrada na identidade de Jonaas, com fotografia em grande escala e uma assinatura tipográfica expressiva.',scope:'Website',concept:false},
  {id:'madeireira-hr',title:'Madeireira HR',category:'MADEIRAS / WEBSITE',image:'assets/project-madeireira-hr.webp',description:'A empresa e as pessoas que a representam no centro da experiência. Uma apresentação que liga o produto, a estrutura do negócio e o contacto direto.',scope:'Website',concept:false},
  {id:'super-bock',title:'Super Bock',category:'DIREÇÃO DE ARTE / EXPERIÊNCIA DIGITAL',image:'assets/concept-super-bock.webp',description:'Uma exploração visual sobre intensidade, matéria e reconhecimento. Fotografia de produto, contraste e composição pensados para uma experiência digital expressiva.',scope:'Direção de arte · Conceito digital',concept:true},
  {id:'padaria',title:'A Padaria Portuguesa',category:'IDENTIDADE / NARRATIVA EDITORIAL',image:'assets/concept-padaria.webp',description:'Uma exploração do lado tátil do pão: textura, luz e proximidade. Um estudo editorial que coloca o produto e o gesto artesanal no centro da composição.',scope:'Direção de arte · Narrativa editorial',concept:true},
  {id:'millennium',title:'Millennium bcp',category:'DESIGN / EXPLORAÇÃO DE MARCA',image:'assets/concept-millennium.webp',description:'Um estudo de presença através de cor, matéria e espaço. Uma abordagem visual contida que explora o contraste entre precisão e movimento.',scope:'Design visual · Exploração de marca',concept:true}
 ]
};
