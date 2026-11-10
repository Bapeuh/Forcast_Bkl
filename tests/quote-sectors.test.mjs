import test from 'node:test';
import assert from 'node:assert/strict';
import {sortedQuoteRows,totals,quoteCsv,quoteXlsx} from '../core/quotes.mjs';
import {calculateDeployment} from '../core/forecast.mjs';
const mk=()=>({vat:20,discount:0,rows:[{category:'Formation',description:'Z',unit:100,quantity:1},{category:'Matériel',description:'A',unit:200,quantity:1},{category:'Formation',description:'B',unit:50,quantity:2}]});
test('ordre libre préservé pour anciens devis',()=>{const q=mk();assert.deepEqual(sortedQuoteRows(q).map(x=>x.description),['Z','A','B']);});
test('secteurs regroupés, montants identiques',()=>{const q=mk();q.sortMode='sector';assert.deepEqual(sortedQuoteRows(q).map(x=>x.description),['A','Z','B']);assert.equal(totals(q).totalHT,400);assert.equal(totals(q).totalTTC,480);assert.match(quoteCsv(q),/Matériel/);assert.ok(quoteXlsx(q).byteLength>2000);});
test('tri alphabétique interne au secteur',()=>{const q=mk();q.sortMode='sector-alpha';assert.deepEqual(sortedQuoteRows(q).map(x=>x.description),['A','B','Z']);});
test('secteur choisi dans mission propagé à la ligne devis',()=>{const d=calculateDeployment({deployment:{missions:[{id:'f',name:'Installation',sector:'Formation',phase:'before',technicians:1,days:1,hoursPerDay:2,hourlyCost:100}]}});assert.equal(d.items[0].sector,'Formation');});
