import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financingSchedule} from '../core/forecast.mjs';

// Protects the browser binding against the generic *Percent conversion.
test('Taux nominal de financement stocké en pourcentage et non en fraction', () => {
 const app=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
 assert.match(app,/b==='finance\.funding\.annualRatePercent'\)setPath\(target,path,input\.value===''\?0:num\(input\.value\)\)/);
 const p=financingSchedule({purchase:12000},{mode:'loan',amount:12000,deposit:2000,months:12,annualRatePercent:12},'2026-12');
 assert.equal(p.annualRatePercent,12);
 assert.equal(p.rows[0].interest,100);
 assert.ok(p.totalInterest>0);
});
