import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Test de non-régression : l'événement 'change' ne contient pas la valeur du champ.
const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const match = source.match(/function parseInput\(e\)\{[^}]+\}/);
assert.ok(match, 'La fonction parseInput doit exister');
const parseInput = vm.runInNewContext(`(${match[0].replace(/^function parseInput/, 'function')})`, {num:Number});

test('une saisie texte conserve la valeur et ne devient pas undefined',()=>{
  assert.equal(parseInput({type:'change',target:{type:'text',value:'Musée d’Orsay'}}),'Musée d’Orsay');
});
test('une saisie numérique conserve la valeur et convertit en nombre',()=>{
  assert.equal(parseInput({type:'change',target:{type:'number',value:'12'}}),12);
  assert.equal(parseInput({type:'change',target:{type:'number',value:''}}),null);
});
test('une case à cocher conserve le booléen',()=>{
  assert.equal(parseInput({type:'change',target:{type:'checkbox',checked:false}}),false);
  assert.equal(parseInput({type:'change',target:{type:'checkbox',checked:true}}),true);
});
test('un menu déroulant conserve la sélection',()=>{
  assert.equal(parseInput({type:'change',target:{type:'select-one',value:'Standalone'}}),'Standalone');
});
