import {stateStore} from './core/state-store.mjs';
import {templateQuoteXlsx} from './core/template-xlsx.mjs';
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import crypto from 'node:crypto';
const DIR=path.dirname(fileURLToPath(import.meta.url)),DATA=path.join(DIR,'data'),PUBLIC=path.join(DIR,'public'),STATE=path.join(DATA,'state.json');
fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(path.join(DATA,'backups'),{recursive:true});
const catalog=JSON.parse(fs.readFileSync(path.join(DATA,'catalog.json'),'utf8'));
function uid(){return crypto.randomUUID()}
const week=[{open:true,start:'10:00',end:'18:00'},{open:true,start:'10:00',end:'18:00'},{open:true,start:'10:00',end:'18:00'},{open:true,start:'10:00',end:'18:00'},{open:true,start:'10:00',end:'18:00'},{open:true,start:'10:00',end:'18:00'},{open:false,start:'10:00',end:'18:00'}];
const sample={id:uid(),name:'Projet de démonstration — 12 casques PCVR',currency:'EUR',settings:{sessionRate:.65,fillRate:.85,vat:.20,chargerCapacity:2},experiences:[{id:'xp-demo',name:'Expérience de démonstration',capacity:12,duration:35,interval:35,ticketPrice:35,operatorsRatio:.6,mode:'PCVR',compatibleHeadsets:['Pico 4 Ultra Enterprise']}],locations:[{id:'loc-demo',name:'Lieu de démonstration',startDate:'2026-12-01',endDate:'2026-12-31',week,exceptions:[],rooms:[{id:'room-demo',name:'Salle immersive',setups:[{id:'setup-demo',name:'Setup A',experienceId:'xp-demo',mode:'PCVR',count:1,capacity:12,headsets:12,headsetModel:'Pico 4 Ultra Entreprise - casque VR',ticketPrice:35}]}]}],staff:{hourlyCost:23,operatorsPerSetup:.6,reception:1,beforeMinutes:60,afterMinutes:60,pauseThresholdHours:6,pauseMinutes:60,pauseCoverage:true,extraStaff:[]},finance:{opex:[{name:'Loyer',amount:3500,frequency:'monthly'},{name:'Électricité',amount:450,frequency:'monthly'},{name:'Assurance',amount:120,frequency:'monthly'}],ancillary:[],feeMode:'none',feeRate:0,feeFixed:0,variablePerVisitor:0,variablePerSession:0,variableRate:0},capex:{margin:.3,custom:[]}};
const initial={version:1,activeId:sample.id,projects:[sample],scenarios:[],catalog:catalog.items,templates:catalog.templates,createdAt:new Date().toISOString()};
const store=stateStore(DATA,initial);
function respond(res,code,obj,type='application/json; charset=utf-8'){res.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(type.startsWith('application/json')?JSON.stringify(obj):obj)}
const MAX=12*1024*1024;
function readBody(req){return new Promise((resolve,reject)=>{let s='',size=0;req.on('data',c=>{size+=c.length;if(size>MAX){reject(new Error('Fichier trop grand'));req.destroy()}else s+=c});req.on('end',()=>{try{resolve(JSON.parse(s))}catch{reject(new Error('JSON invalide'))}});req.on('error',reject)})}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/api/quote/template-xlsx'){
    const quote=await readBody(req);
    const workbook=templateQuoteXlsx(quote);
    res.writeHead(200,{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="devis-backlight.xlsx"','Content-Length':workbook.length,'Cache-Control':'no-store'});
    return res.end(workbook);
  }
  if(req.method==='GET'&&url.pathname==='/api/state')return respond(res,200,store.get());
  if(req.method==='POST'&&url.pathname==='/api/state'){
   const s=await readBody(req);const updated=store.replace(s);return respond(res,200,{ok:true,updatedAt:updated.updatedAt});
  }
  if(req.method==='POST'&&url.pathname==='/api/backup')return respond(res,200,{ok:true,file:store.snapshot()});
  if(req.method==='GET'&&url.pathname==='/api/backups')return respond(res,200,store.listBackups());
  if(req.method==='POST'&&url.pathname==='/api/restore'){
    const {file}=await readBody(req);store.restore(file);return respond(res,200,{ok:true});
  }
  if(req.method==='GET'&&url.pathname==='/api/export')return respond(res,200,store.get());
  if(req.method==='POST'&&url.pathname==='/api/import'){
    const s=await readBody(req);store.replace(s);return respond(res,200,{ok:true});
  }
  if(req.method!=='GET')return respond(res,405,{error:'Méthode non autorisée'});
  if(url.pathname==='/core/experience-groups.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','experience-groups.mjs')).pipe(res)}
  if(url.pathname==='/core/oz-experiences.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','oz-experiences.mjs')).pipe(res)}
  if(url.pathname==='/core/quote-layout.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','quote-layout.mjs')).pipe(res)}
  if(url.pathname==='/core/quotes.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','quotes.mjs')).pipe(res)}
  if(url.pathname==='/core/lifecycle.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','lifecycle.mjs')).pipe(res)}
  if(url.pathname==='/core/rooms.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','rooms.mjs')).pipe(res)}
  if(url.pathname==='/core/revenue-routes.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','revenue-routes.mjs')).pipe(res)}
  if(url.pathname==='/core/partners.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','partners.mjs')).pipe(res)}
  if(url.pathname==='/core/forecast.mjs'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-cache'});return fs.createReadStream(path.join(DIR,'core','forecast.mjs')).pipe(res)}
  const requested=path.normalize(decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  const target=path.resolve(PUBLIC,'.'+requested);if(!target.startsWith(PUBLIC+path.sep))return respond(res,403,{error:'Accès refusé'});
  if(!fs.existsSync(target)||!fs.statSync(target).isFile())return respond(res,404,{error:'Introuvable'});
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(target).pipe(res);
 }catch(err){console.error(err);if(!res.headersSent)respond(res,400,{error:err.message})}
});
const port=Number(process.env.PORT||4173);server.listen(port,'127.0.0.1',()=>console.log(`\nForecast Backlight démarré : http://127.0.0.1:${port}\nDonnées : ${STATE}\nCtrl+C pour arrêter.\n`));
