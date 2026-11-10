import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateDeployment,revenuesAndProfit,fullForecast} from '../core/forecast.mjs';
const mission=(o={})=>({id:'m1',name:'Installation 12 casques',phase:'before',technicians:2,days:2,hoursPerDay:8,hourlyCost:35,travelers:2,nights:2,hotelPerNight:90,mealDays:3,mealPerDay:25,transportPerPerson:100,freight:200,...o});
const model=(deployment)=>({deployment,settings:{vat:.2},finance:{opex:[],ancillary:[],feeMode:'none'},staff:{},capex:{margin:.3},locations:[],experiences:[]});
test('mission installation: coût détaillé et prix à 30 % de marge sur vente',()=>{
 const r=calculateDeployment(model({mode:'detailed',missions:[mission()]}));
 assert.equal(r.total,2030);
 assert.equal(r.items[0].breakdown.mainOeuvre,1120);
});
test('forfait simple exclut les missions détaillées, switch sans double comptage',()=>{
 const r=calculateDeployment(model({mode:'flat',flatCost:5000,missions:[mission()]}));
 assert.equal(r.total,5000);
 assert.equal(r.sale,7142.86);
});
test('marge propre à la mission et non-facturable',()=>{
 const r=calculateDeployment(model({mode:'detailed',missions:[mission({technicians:1,days:1,hoursPerDay:1,hourlyCost:100,travelers:0,nights:0,mealDays:0,transportPerPerson:0,freight:0,marginPercent:50}),mission({id:'m2',billable:false})]}));
 assert.equal(r.items[0].sale,200);
 assert.equal(r.items[1].sale,0);
});
test('ventilation temporelle: une mission en exploitation affecte OPEX sans CAPEX matériel',()=>{
 const m=model({mode:'detailed',missions:[mission({phase:'during'})]});
 const dep=calculateDeployment(m);
 const f=revenuesAndProfit(m,{gross:0,monthly:[],visitors:0,played:0,days:0,openHours:0},{cost:0},{cost:0},dep);
 assert.equal(f.expenses,dep.total);
 assert.equal(f.withCapex,-dep.total);
 assert.equal(f.deploymentOther,0);
});
test('migrations: projet antérieur sans deployment garde un coût nul',()=>{
 const r=calculateDeployment(model(undefined));
 assert.equal(r.total,0);
 assert.deepEqual(r.byPhase,{before:0,during:0,after:0});
});
test('module intégré au forecast sans altérer le CAPEX matériel',()=>{
 const m=model({mode:'flat',flatCost:5000,flatPhase:'before'});
 const r=fullForecast(m,[]);
 assert.equal(r.capex.cost,0);
 assert.equal(r.deployment.total,5000);
 assert.equal(r.finance.withCapex,-5000);
});
