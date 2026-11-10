import test from 'node:test';
import assert from 'node:assert/strict';
import {computeRevenueRoutes} from '../core/revenue-routes.mjs';
import {partnerSettlement} from '../core/partners.mjs';
const forecast={finance:{ticketHT:100000,ancillary:20000,fee:2000,revenue:120000,expenses:30000},traffic:{gross:120000,visitors:4000},capex:{purchase:0},deployment:{byPhase:{before:0,after:0}}};
const route=(allocations,source='ticketHT',collector='Exploitant')=>({name:'Billetterie musée',source,collector,enabled:true,allocations});
const model=(routes,contracts=[])=>({finance:{partnership:{collector:'Exploitant',partners:[{name:'Exploitant'},{name:'Coproducteur'}],revenueRoutes:routes,contracts,expenseShares:[]}}});
test('50/30/20 calcule les montants et les retenues sans transfert vers soi',()=>{
 const r=route([{partner:'Exploitant',percent:50},{partner:'Backlight',percent:30},{partner:'Coproducteur',percent:20}]);
 const calc=computeRevenueRoutes([r],forecast);assert.equal(calc.routes[0].valid,true);assert.deepEqual(calc.routes[0].allocations.map(x=>x.amount),[50000,30000,20000]);
 const s=partnerSettlement(model([r]),forecast);assert.equal(s.records.length,2);assert.equal(s.records.reduce((sum,x)=>sum+x.amount,0),50000);assert.equal(s.consolidated,90000);
});
test('les contrats historiques ne sont pas additionnés au mode visuel',()=>{
 const r=route([{partner:'Exploitant',percent:70},{partner:'Backlight',percent:30}]);
 const s=partnerSettlement(model([r],[{type:'fixed',beneficiary:'Backlight',amount:25000,enabled:true}]),forecast);
 assert.equal(s.records.length,1);assert.equal(s.records[0].amount,30000);assert.ok(s.problems.some(x=>x.includes('ignorés')));
});
test('une ventilation incomplète reste un brouillon et ne produit aucun transfert',()=>{
 const r=route([{partner:'Exploitant',percent:50},{partner:'Backlight',percent:30}]);const s=partnerSettlement(model([r]),forecast);
 assert.equal(s.records.length,0);assert.ok(s.problems.some(x=>x.includes('80 %')));
});
test('les deux circuits sur une même famille de recettes sont rejetés',()=>{
 const a=route([{partner:'Exploitant',percent:100}]);const b=route([{partner:'Exploitant',percent:100}],'netHT');
 const c=computeRevenueRoutes([a,b],forecast);assert.equal(c.routes[1].valid,false);assert.ok(c.problems.some(x=>x.includes('déjà utilisée')));
});
test('billetterie et annexes sont indépendantes',()=>{
 const a=route([{partner:'Exploitant',percent:50},{partner:'Backlight',percent:50}]);
 const b=route([{partner:'Exploitant',percent:100}],'ancillaryHT');const c=computeRevenueRoutes([a,b],forecast);
 assert.ok(c.routes.every(x=>x.valid));assert.equal(c.routes[1].base,20000);
});
test('les centimes arrondis sont réconciliés sur la dernière ligne',()=>{
 const c=computeRevenueRoutes([route([{partner:'Exploitant',percent:33.33},{partner:'Backlight',percent:33.33},{partner:'Coproducteur',percent:33.34}])],{...forecast,finance:{...forecast.finance,ticketHT:0.01}});
 assert.equal(c.routes[0].allocations.reduce((s,x)=>s+x.amount,0),0.01);
});
test('un collecteur différent du collecteur global ne crée pas de recette supplémentaire',()=>{
 const r=route([{partner:'Backlight',percent:100}],'ticketHT','Backlight');const s=partnerSettlement(model([r]),forecast);
 assert.equal(s.revenue,120000);assert.equal(s.consolidated,90000);assert.equal(s.records.length,0);
 assert.equal(s.partners.find(x=>x.name==='Backlight').receipts,100000);
});
