import {mkdir, readdir, cp, rm} from 'node:fs/promises';
await rm('dist/client',{recursive:true,force:true});
await mkdir('dist/client',{recursive:true});
for(const entry of await readdir('dist')) {
 if(['client','server','.openai'].includes(entry))continue;
 await cp('dist/'+entry,'dist/client/'+entry,{recursive:true});
}
await mkdir('dist/server',{recursive:true});
await cp('server/index.js','dist/server/index.js');
