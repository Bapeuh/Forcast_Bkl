import test from 'node:test';
import assert from 'node:assert/strict';
import {partnerSettlement} from '../core/partners.mjs';
const forecast={traffic:{gross:12000,visitors:300},finance:{ticketHT:10000,fee:500,revenue:10500,expenses:4000},capex:{purchase:2000},deployment:{byPhase:{before:500,after:0}}};
const base={finance:{partnership:{collector:'Backlight',partners:[{name:'Exploitant'},{name:'Coproducteur'}],contracts:[]}}};
function calc(contracts=[],rest={}){return partnerSettlement({finance:{partnership:{...base.finance.partnership,contracts,...rest}}},forecast)}
test('Aucune convention: équilibre global sans double revenu',()=>{const x=calc();assert.equal(x.consolidated,4000);assert.equal(x.partners.find(p=>p.name==='Backlight').balance,4000)});
test('Revenue share 30 % sur CA HT',()=>{const x=calc([{type:'share',name:'RS',beneficiary:'Coproducteur',base:'ticketHT',percent:30,enabled:true}]);assert.equal(x.records[0].amount,3000);assert.equal(x.consolidated,4000)});
test('Assiette HT après billetterie',()=>{const x=calc([{type:'share',beneficiary:'Coproducteur',base:'netHT',percent:30,enabled:true}]);assert.equal(x.records[0].amount,2850)});
test('Prix par visiteur',()=>{const x=calc([{type:'ppp',beneficiary:'Coproducteur',perVisitor:3,enabled:true}]);assert.equal(x.records[0].amount,900)});
test('Licence fixe',()=>{const x=calc([{type:'fixed',beneficiary:'Exploitant',amount:1200,enabled:true}]);assert.equal(x.records[0].amount,1200)});
test('Minimum garanti récupérable',()=>{const x=calc([{type:'mg',beneficiary:'Coproducteur',base:'ticketHT',percent:20,amount:2500,recoverable:true,enabled:true}]);assert.equal(x.records[0].amount,2500)});
test('Minimum garanti non récupérable',()=>{const x=calc([{type:'mg',beneficiary:'Coproducteur',base:'ticketHT',percent:20,amount:2500,recoverable:false,enabled:true}]);assert.equal(x.records[0].amount,4500)});
test('Répartition coûts 30 / 70 %',()=>{const x=calc([],{expenseShares:[{name:'Backlight',percent:30},{name:'Exploitant',percent:70}]});assert.equal(x.partners.find(p=>p.name==='Backlight').expenses,1950);assert.equal(x.partners.find(p=>p.name==='Exploitant').expenses,4550);assert.equal(x.consolidated,4000)});
test('Part invalide signalée',()=>{const x=calc([],{expenseShares:[{name:'Backlight',percent:90}]});assert.ok(x.problems.some(p=>p.includes('100 %')))});
test('Contrat désactivé ignoré',()=>{const x=calc([{type:'fixed',beneficiary:'Exploitant',amount:700,enabled:false}]);assert.equal(x.records.length,0)});
test('Destinataire et collecteur identiques refusés',()=>{const x=calc([{type:'fixed',beneficiary:'Backlight',amount:700,enabled:true}]);assert.equal(x.records.length,0);assert.ok(x.problems.length)});
