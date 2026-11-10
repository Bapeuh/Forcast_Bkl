import test from 'node:test';
import assert from 'node:assert/strict';
import {OZ_EXPERIENCES,mergeOzExperiences} from '../core/oz-experiences.mjs';
test('11 configurations OZ distinctes',()=>{assert.equal(OZ_EXPERIENCES.length,11);assert.equal(new Set(OZ_EXPERIENCES.map(x=>x.sourceKey)).size,11)});
test('import idempotent sans altérer les expériences préexistantes',()=>{const original={id:'user1',name:'Ma référence',capacity:8};const s={experienceLibrary:[original]};assert.equal(mergeOzExperiences(s),11);assert.equal(mergeOzExperiences(s),0);assert.deepEqual(s.experienceLibrary[0],original);assert.equal(s.experienceLibrary.length,12)});
test('variantes Toyland et Icecube distinctes',()=>{assert.equal(OZ_EXPERIENCES.filter(x=>x.sourceTitle==='Toyland').length,2);assert.equal(OZ_EXPERIENCES.filter(x=>x.sourceTitle==='Icecube Protocol').length,2)});
test('dimensions non fournies non inventées',()=>{for(const x of OZ_EXPERIENCES.filter(x=>x.sourceTitle==='Lady Liberty'||x.sourceTitle==='Icecube Protocol'))assert.equal(x.playWidthM,null)});
