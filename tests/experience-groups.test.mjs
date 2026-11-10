import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {upgradeExperienceGroups,variantForProject,syncLegacyVariant} from '../core/experience-groups.mjs';
const file=new URL('./fixtures/experience-groups.json',import.meta.url);
test('catalogue importé en fiches : Toyland et Icecube à deux variantes',()=>{
 const state=JSON.parse(fs.readFileSync(file));upgradeExperienceGroups(state);
 assert.equal(state.experienceGroups.length,11);
 assert.equal(state.experienceGroups.find(x=>x.title==='Toyland').variants.length,2);
 assert.equal(state.experienceGroups.find(x=>x.title==='Icecube Protocol').variants.length,2);
 assert.equal(state.experienceGroups.reduce((n,x)=>n+x.variants.length,0),13);
});
test('migration idempotente et identifiants conservés',()=>{
 const state=JSON.parse(fs.readFileSync(file));const orig=state.experienceLibrary.map(x=>x.id);
 upgradeExperienceGroups(state);const once=JSON.stringify(state);upgradeExperienceGroups(state);
 assert.equal(JSON.stringify(state),once);assert.deepEqual(state.experienceLibrary.map(x=>x.id),orig);
});
test('projet Birdy corrigé sans écrasement des paramètres',()=>{
 const state=JSON.parse(fs.readFileSync(file));const xp=state.projects[0].experiences.find(x=>x.name==='Birdy Kingland');const duration=xp.duration;
 upgradeExperienceGroups(state);assert.equal(xp.libraryId,'oz-birdy-king-land-1-si-ge');assert.equal(xp.duration,duration);
});
test('une variante importée est une copie indépendante',()=>{
 const state=JSON.parse(fs.readFileSync(file));upgradeExperienceGroups(state);
 const group=state.experienceGroups.find(g=>g.title==='Toyland');const x=variantForProject(group,group.variants[1],'local-id');
 assert.equal(x.id,'local-id');assert.equal(x.capacity,6);assert.equal(x.variantId,group.variants[1].id);
 x.capacity=9;assert.equal(group.variants[1].capacity,6);
});
test('synchronisation rétrocompatible avec le catalogue plat',()=>{
 const state=JSON.parse(fs.readFileSync(file));upgradeExperienceGroups(state);
 const v=state.experienceGroups.find(g=>g.title==='Toyland').variants[0];v.ticketPrice=37;
 syncLegacyVariant(state,v);assert.equal(state.experienceLibrary.find(x=>x.id===v.id).ticketPrice,37);
});
