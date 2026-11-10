import test from 'node:test';import assert from 'node:assert/strict';
import {seedQuote,totals,frenchCsv,quoteXlsx,quoteCsv} from '../core/quotes.mjs';
const q=()=>seedQuote({name:'Test',settings:{vat:.2}}, {items:[{id:'a',name:'Casque',qty:2,sale:2000,total:1100}]},{items:[{name:'Installation',sale:800,cost:400}]},()=>String(Math.random()));
test('matériel et missions présents une seule fois',()=>{const x=q();assert.equal(x.rows.length,2);assert.equal(totals(x).totalHT,2800);assert.equal(totals(x).totalTTC,3360)});
test('remise HT et TVA calculées en séquence',()=>{const x=q();x.discount=10;const t=totals(x);assert.equal(t.discount,280);assert.equal(t.totalHT,2520);assert.equal(t.vat,504);assert.equal(t.totalTTC,3024)});
test('une ligne sans tarif déclenche une alerte',()=>{const x=q();x.rows[0].unit=null;assert.equal(totals(x).incomplete.length,1)});
test('CSV français : séparateur point virgule et virgule décimale',()=>{assert.match(frenchCsv([['A',1428.57]]),/"1428,57"/);assert.ok(quoteCsv(q()).startsWith('\ufeff'))});
test('export xlsx a signature ZIP valide',()=>{const bytes=quoteXlsx(q());assert.deepEqual([...bytes.slice(0,4)],[80,75,3,4]);assert.ok(bytes.byteLength>2000)});
