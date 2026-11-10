import test from 'node:test';import assert from 'node:assert/strict';import {defaultQuoteLayout,normalizeQuoteLayout,moveQuoteBlock} from '../core/quote-layout.mjs';
test('layout par défaut est présentable et inclut le logo',()=>{const l=defaultQuoteLayout();assert.equal(l.blocks[0].type,'logo');assert.ok(l.blocks.some(x=>x.type==='lines'));assert.ok(l.blocks.some(x=>x.type==='totals'));});
test('layout hérité migre sans perte',()=>{const l=normalizeQuoteLayout(undefined);assert.equal(l.spacing,16);assert.equal(l.blocks.length,10);});
test('masquer un bloc préserve ses propriétés',()=>{const l=normalizeQuoteLayout({spacing:26,blocks:[{id:'notes',type:'notes',visible:false,width:1}]});assert.equal(l.blocks[0].visible,false);assert.equal(l.blocks[0].width,1);});
test('déplacement est immuable',()=>{const a=defaultQuoteLayout().blocks,b=moveQuoteBlock(a,0,1);assert.equal(b[1].type,'logo');assert.equal(a[0].type,'logo');});
test('indice hors plage ne modifie pas le plan',()=>{const a=defaultQuoteLayout().blocks;assert.deepEqual(moveQuoteBlock(a,-1,200),a);});
