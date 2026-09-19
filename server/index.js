const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
function database(env){if(!env.DB)throw Error('Storage unavailable');return env.DB;}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname!=='/api/leads')return env.ASSETS.fetch(request);
  if(request.method!=='POST')return reply({error:'Método não permitido.'},405);
  if(request.headers.get('origin')!==url.origin)return reply({error:'Origem inválida.'},403);
  if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Formato inválido.'},415);
  try{
   const raw=await request.text();
   if(raw.length>4096)return reply({error:'Pedido demasiado grande.'},413);
   let input;try{input=JSON.parse(raw)}catch{return reply({error:'Pedido inválido.'},400)}
   if(!input||typeof input!=='object')return reply({error:'Pedido inválido.'},400);
   if(input.website)return reply({error:'Não foi possível enviar. Tente novamente.'},400);
   const {id,company,name,phone,email}=input;
   if(typeof id!=='string'||!/^[a-f0-9-]{36}$/i.test(id)||[company,name,phone,email].some(v=>typeof v!=='string')||company.trim().length<2||company.length>120||name.trim().length<2||name.length>120||phone.length>35||phone.replace(/\D/g,'').length<7||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return reply({error:'Verifique os campos e tente novamente.'},400);
   const db=database(env);
   // An idempotency key makes network retries safe, without exposing saved leads.
   const existing=await db.prepare('SELECT id FROM leads WHERE id = ?').bind(id).first();
   if(existing)return reply({ok:true});
   const recent=await db.prepare('SELECT COUNT(*) AS total FROM leads WHERE email = ? AND created_at > ?').bind(email.trim().toLowerCase(),Date.now()-3600000).first();
   if(recent.total>=3)return reply({error:'Já recebemos os seus pedidos. Tente novamente mais tarde.'},429);
   await db.prepare('INSERT INTO leads (id,company,name,phone,email,created_at) VALUES (?,?,?,?,?,?)').bind(id,company.trim(),name.trim(),phone.trim(),email.trim().toLowerCase(),Date.now()).run();
   return reply({ok:true},201);
  }catch(error){console.error('Lead storage failed',error?.name);return reply({error:'Não foi possível guardar o pedido. Os seus dados continuam no formulário; tente novamente.'},503);}
 }
};
