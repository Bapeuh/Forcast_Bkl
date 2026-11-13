import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import net from 'node:net';

function freePort(){return new Promise((resolve,reject)=>{const socket=net.createServer();socket.once('error',reject);socket.listen(0,'127.0.0.1',()=>{const port=socket.address().port;socket.close(()=>resolve(port));});});}
async function serve(t){
 const root=path.resolve(import.meta.dirname,'..');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forecast-http-'));

 for (const name of ['server.mjs','core','public','assets']) fs.cpSync(path.join(root,name),path.join(dir,name),{recursive:true});
 fs.mkdirSync(path.join(dir,'data'));
 for(const name of ['catalog.json','state.example.json'])fs.copyFileSync(path.join(root,'data',name),path.join(dir,'data',name));
 const port=await freePort(),proc=spawn(process.execPath,['server.mjs'],{cwd:dir,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
 let stderr='';
 proc.stderr.on('data',data=>{stderr=(stderr+data.toString()).slice(-10000);});
 proc.stdout.on('data',()=>{});
 const closed=new Promise(resolve=>proc.once('close',resolve));
 t.after(async()=>{
  if(proc.exitCode===null && proc.signalCode===null) proc.kill();
  let timer;
  await Promise.race([closed,new Promise(resolve=>{timer=setTimeout(resolve,5000);})]);
  clearTimeout(timer);
  try {fs.rmSync(dir,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  catch(err){throw new Error(`Nettoyage du test HTTP impossible (${dir}): ${err.message}`);}
 });
 const base=`http://127.0.0.1:${port}`;
 for(let attempt=0;attempt<60;attempt++){
  if(proc.exitCode!==null)throw new Error(`Le serveur ne démarre pas (code ${proc.exitCode}): ${stderr}`);
  try {const r=await fetch(base+'/api/state');if(r.ok)return {base,dir};}catch{}
  await new Promise(r=>setTimeout(r,50));
 }
 throw new Error(`Serveur inaccessible sur ${base}; code=${proc.exitCode}; stderr=${stderr}`);
}

test('HTTP: UI, modules, état et export Excel répondent',async t=>{
 const {base}=await serve(t);
 for(const url of ['/', '/app.js','/app.css','/core/quotes.mjs','/core/quote-details.mjs','/core/document-templates.mjs','/core/setup-compatibility.mjs','/core/experience-groups.mjs']){
  const r=await fetch(base+url);assert.equal(r.status,200,url);assert.ok((await r.text()).length>50,url);
 }
 const state=await (await fetch(base+'/api/state')).json();assert.ok(Array.isArray(state.projects));
 const quote={number:'DEV-L00',date:'2026-11-09',client:'Test',company:{name:'BACKLIGHT STUDIO'},projectName:'L00',vat:20,discount:0,rows:[{enabled:true,category:'Matériel',description:'Casque',quantity:1,unit:100}]};
 const response=await fetch(base+'/api/quote/template-xlsx',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(quote)});
 assert.equal(response.status,200);const buf=Buffer.from(await response.arrayBuffer());assert.equal(buf.subarray(0,2).toString(),'PK');
});
test('HTTP: import, sauvegarde et restauration ne perdent pas les anciennes données',async t=>{
 const {base,dir}=await serve(t);
 const request=async(url,obj)=>{const r=await fetch(base+url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(obj)});assert.equal(r.status,200,url);return r.json();};
 const previous=await (await fetch(base+'/api/state')).json();
 await request('/api/state',{...previous,projects:[{...previous.projects[0],name:'Projet modifié'}]});
 const list=await (await fetch(base+'/api/backups')).json();
 const backup=list.find(n=>n.startsWith('pre-change-'));assert.ok(backup);
 await request('/api/restore',{file:backup});
 assert.equal((await (await fetch(base+'/api/state')).json()).projects[0].name,previous.projects[0].name);
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'data/state.json'))).projects[0].name,previous.projects[0].name);
});
