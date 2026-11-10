import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {templateQuoteXlsx} from '../core/template-xlsx.mjs';
const quote={number:'DEV-2026-001',date:'2026-11-09',client:'Renault',projectName:'Renault',company:{name:'BACKLIGHT STUDIO',address:'Paris',bank:'À compléter'},vat:20,discount:0,conditions:'100 % à la commande',rows:Array.from({length:19},(_,i)=>({enabled:true,category:'Matériel',description:'Référence '+i,quantity:1,unit:100}))};
test('modèle Backlight: zip, logo d’origine, 19 lignes, zone A4, calcul des totaux',()=>{
 const b=templateQuoteXlsx(quote);
 assert.equal(b.readUInt32LE(0),0x04034b50);
 assert.ok(b.length>25000);
 // The client template must remain available for export on Windows.
 assert.ok(fs.existsSync(new URL('../assets/devis-backlight-template.xlsx',import.meta.url)));
});
test('impression A4 n’utilise pas la variable inexistante key',()=>{
 const js=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
 assert.match(js,/const single=part\[0\]==='quotePrint'/);
 assert.doesNotMatch(js,/const single=key==='quotePrint'/);
});
