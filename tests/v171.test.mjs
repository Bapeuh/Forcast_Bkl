import test from 'node:test';
import assert from 'node:assert/strict';
import {duplicateRoom,incrementRoomName} from '../core/rooms.mjs';
import {partnerSettlement} from '../core/partners.mjs';

test('incrémente nom de salle en gérant collisions',()=>{
 assert.equal(incrementRoomName('Salle 1',['Salle 1','Salle 2']),'Salle 3');
 assert.equal(incrementRoomName('Studio',['Studio 2']),'Studio 3');
});
test('dupliquer salle profonde sans toucher à la source et avec nouveaux IDs',()=>{
 const src={id:'r1',name:'Salle 1',width:12,setups:[{id:'s1',name:'Setup A',assignments:[{experienceId:'xp',share:100,ticketPrice:35}]}]};
 const clone=duplicateRoom(src,['Salle 1'],()=>crypto.randomUUID(),true);
 assert.equal(clone.name,'Salle 2');assert.notEqual(clone.id,src.id);assert.notEqual(clone.setups[0].id,src.setups[0].id);
 clone.setups[0].assignments[0].ticketPrice=10;assert.equal(src.setups[0].assignments[0].ticketPrice,35);
});
test('partage incohérent crée une alerte côté calcul',()=>{
 const forecast={finance:{ticketHT:1000,revenue:1000,expenses:100},traffic:{gross:1200,visitors:50},capex:{purchase:0},deployment:{byPhase:{before:0,after:0}}};
 const model={finance:{partnership:{collector:'Backlight',partners:[{name:'Musée'}],expenseShares:[{name:'Backlight',percent:40},{name:'Musée',percent:50}],contracts:[]}}};
 assert.ok(partnerSettlement(model,forecast).problems.some(x=>x.includes('100')));
});
