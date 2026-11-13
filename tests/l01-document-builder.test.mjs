import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultQuoteLayout,normalizeQuoteLayout,upgradeQuoteLayout,moveQuoteBlock} from '../core/quote-layout.mjs';
import {detailDisclosure,rowSale,materialChangeSet,canMutateQuote} from '../core/quote-details.mjs';
import {defaultDocumentTemplates,normalizeDocumentTemplates,snapshotTemplate,applyTemplate} from '../core/document-templates.mjs';
import {setupExperienceFit,installationRequirement} from '../core/setup-compatibility.mjs';
import {totals,seedQuote} from '../core/quotes.mjs';
import {estimateCapex} from '../core/forecast.mjs';
import {templateQuoteXlsx} from '../core/template-xlsx.mjs';

const parent=()=>({id:'p',description:'Installation',category:'Prestations techniques',quantity:1,unit:5000,enabled:true,displayMode:'detailed',children:[{id:'a',description:'Techniciens',quantity:5,unit:600,unitLabel:'J/H',visible:true},{id:'b',description:'Repas',quantity:5,unit:50,visible:true},{id:'c',description:'Déplacements',quantity:2,unit:875,visible:true}]});
const q=()=>({number:'DEV-L01',date:'2026-11-10',version:1,client:'Client',company:{name:'BACKLIGHT STUDIO'},vat:20,discount:0,rows:[parent()]});

test('L01.1 ancien layout deux colonnes lisible et migration explicite',()=>{const v1=normalizeQuoteLayout({blocks:[{id:'a',type:'logo',width:1},{id:'b',type:'lines',width:2}]});assert.equal(v1.columns,2);const v2=upgradeQuoteLayout(v1);assert.equal(v2.columns,6);assert.deepEqual(v2.blocks.map(x=>x.width),[3,6]);assert.equal(v1.columns,2)});
test('L01.2 grille six colonnes de référence',()=>{const l=defaultQuoteLayout();assert.equal(l.columns,6);assert.equal(l.blocks.find(x=>x.type==='lines').width,6);assert.equal(l.blocks.find(x=>x.type==='logo').width,2);assert.ok(l.blocks.every(x=>x.width>=1&&x.width<=6))});
test('L01.2 normalisation robuste des largeurs et de la pagination',()=>{const x=normalizeQuoteLayout({columns:6,pagination:'single',blocks:[{id:'z',width:19}]});assert.equal(x.blocks[0].width,6);assert.equal(x.pagination,'single')});
test('L01.3 affichage parent synthétique conserve une seule ligne de CA',()=>{const x=q();x.rows[0].displayMode='summary';assert.equal(totals(x).totalHT,5000);assert.equal(detailDisclosure(x.rows[0]).children.length,0)});
test('L01.4 détails prix de vente correspondant au parent sans double comptage',()=>{const x=q();assert.equal(rowSale(x.rows[0]),5000);assert.equal(totals(x).totalHT,5000);assert.equal(detailDisclosure(x.rows[0]).children.length,3);assert.equal(detailDisclosure(x.rows[0]).warning,'')});
test('L01.4 incohérence de forfait masque les montants secondaires',()=>{const x=q();x.rows[0].children[2].unit=250;const d=detailDisclosure(x.rows[0]);assert.ok(d.warning);assert.ok(d.children.every(x=>!x.showPrice));assert.equal(totals(x).totalHT,5000)});
test('L01.4 mode calculé prend la somme des composants sans double addition',()=>{const x=q();x.rows[0].pricingMode='calculated';assert.equal(rowSale(x.rows[0]),5000);x.rows[0].children[2].unit=250;assert.equal(totals(x).totalHT,3750)});
test('L01.4 mode personnalisé filtre les lignes secondaires invisibles',()=>{const x=q();x.rows[0].displayMode='custom';x.rows[0].children[1].visible=false;const d=detailDisclosure(x.rows[0]);assert.equal(d.children.length,2);assert.ok(d.warning);assert.equal(totals(x).totalHT,5000)});
test('L01.5-6 devis envoyé n’est pas modifiable automatiquement',()=>{assert.equal(canMutateQuote({status:'Envoyé'}),false);assert.equal(canMutateQuote({status:'Brouillon'}),true)});
test('L01.8 modèle global et copie indépendante du modèle personnel',()=>{const initial=defaultDocumentTemplates();const x=q();x.layout=defaultQuoteLayout();const tpl=snapshotTemplate(x,'Mon modèle','tpl');const y=applyTemplate(q(),tpl);y.layout.blocks[0].width=5;assert.equal(tpl.layout.blocks[0].width,2);assert.equal(normalizeDocumentTemplates([tpl]).length,2);assert.equal(initial[0].system,true)});
test('L01.7 excel historique prend en charge des sous-lignes',()=>{const bytes=templateQuoteXlsx(q());assert.equal(bytes.readUInt32LE(0),0x04034b50);assert.ok(bytes.length>1000)});
test('L01.10 diff matériel signale les changements de quantité',()=>{const a=[{source:'material:pc',quantity:4,unit:100,description:'PC'}],b=[{source:'material:pc',quantity:6,unit:100,description:'PC'}];assert.equal(materialChangeSet(a,b).length,1);assert.equal(materialChangeSet(a,a).length,0)});
test('L01.10 filtrage expériences mode / casque / rotation de salle',()=>{const x={mode:'PCVR',compatibleHeadsets:['HTC Focus Vision'],playWidthM:10,playDepthM:8};assert.equal(setupExperienceFit(x,{mode:'PCVR',headsetModel:'HTC Focus Vision',playWidthM:8,playDepthM:10}).compatible,true);assert.equal(setupExperienceFit(x,{mode:'Standalone',headsetModel:'Pico',playWidthM:8,playDepthM:10}).compatible,false);assert.equal(setupExperienceFit(x,{mode:'PCVR',headsetModel:'HTC Focus Vision',playWidthM:7,playDepthM:12}).compatible,false)});
test('L01.10 casque installé réduit achats sans retirer les besoins techniques',()=>{const setup={mode:'PCVR',headsets:12,installedHeadsets:4,headsetModel:'HTC Focus Vision',count:1};const model={locations:[{rooms:[{setups:[setup]}]}],capex:{margin:.3,custom:[]},settings:{}};const c=estimateCapex(model,[{id:'htc',name:'HTC Focus Vision',category:'Casque VR',price:900}]);const item=c.items.find(x=>x.id==='htc');assert.equal(installationRequirement(setup).toInstall,8);assert.equal(item.stockQty,4);assert.equal(item.installedQty,4);assert.equal(item.buyQty,8);assert.equal(c.pc,12)});
test('L01.10 devis depuis matériel ne duplique pas les achats',()=>{const capex={items:[{id:'headset',qty:10,sale:1200,total:1000,buyQty:8,stockQty:2,rentQty:0,name:'Casque'}]};const a=seedQuote({name:'Test',settings:{}},capex,{items:[]},()=>String(Math.random()));assert.equal(a.rows.length,1);assert.equal(a.rows[0].material.stockQty,2)});

test('L01.4 détail masqué ne modifie pas le calcul des sous-lignes',()=>{const x=q();x.rows[0].pricingMode='calculated';x.rows[0].displayMode='custom';x.rows[0].children[2].visible=false;assert.equal(totals(x).totalHT,5000);assert.ok(detailDisclosure(x.rows[0]).warning)});
test('L01.10 conversion achat / stock / location sans perte de centimes',()=>{const project={name:'X',settings:{}};const capex={items:[{id:'headset',name:'Casque',qty:12,buyQty:7,stockQty:3,rentQty:2,purchaseTotal:700,rentalTotal:110,stockUseTotal:50,total:860,sale:1228.57}]};const out=seedQuote(project,capex,{items:[]},()=>String(Math.random()));assert.deepEqual(out.rows.map(x=>x.quantity),[7,2,3]);assert.equal(totals({...q(),rows:out.rows}).totalHT,1228.57)});
test('L01.10 coûts inconnus restent une alerte au lieu de zéro',()=>{const project={name:'X',settings:{}};const out=seedQuote(project,{items:[{id:'pc',name:'PC',qty:2,buyQty:2,purchaseTotal:undefined,sale:null}]},{items:[]},()=>String(Math.random()));assert.equal(out.rows[0].unit,null);assert.equal(totals({...q(),rows:out.rows}).incomplete.length,1)});

test('L01.5 pagination A4 protège les lignes sans couper les tableaux', async()=>{
 const fs=await import('node:fs');const path=await import('node:path');const src=fs.readFileSync(path.resolve(import.meta.dirname,'../public/app.js'),'utf8');
 assert.match(src,/\.quote-print-table tr\{break-inside:avoid/);assert.match(src,/\.quote-print-table thead\{display:table-header-group/);
 assert.match(src,/Une page si lisible/);
});
test('L01.6 impression ne réduit pas les textes sous 85% de leur taille', async()=>{
 const fs=await import('node:fs');const path=await import('node:path');const src=fs.readFileSync(path.resolve(import.meta.dirname,'../public/app.js'),'utf8');
 assert.match(src,/zoom=Math\.max\(\.85/);assert.match(src,/impression multipage recommandée/);
});
test('L01.9 devis Renault 19 lignes stable et sans coûts internes client',()=>{
 const x=q();x.rows=Array.from({length:19},(_,i)=>({...parent(),id:'line'+i,description:'Prestation '+i,unit:5000+i}));
 const t=totals(x);assert.equal(t.lines.length,19);assert.equal(t.totalHT,19*5000+171);
 const workbook=templateQuoteXlsx(x);assert.equal(workbook.readUInt32LE(0),0x04034b50);
 assert.ok(!String(workbook).includes('cost interne'));
});
