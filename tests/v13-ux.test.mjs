import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const getAreaMatch = () => {
  const part=source.match(/function areaMatch\(x,s\)\{[^\n]+\}/)?.[0];
  assert.ok(part,'Fonction de compatibilité présente');
  return vm.runInNewContext(`${part}; areaMatch`,{num:(v)=>Number(v||0)});
};
test('V1.3 accueil, estimation rapide et espace projet connectés aux pages existantes',()=>{
  for(const word of ['function home()', 'function createQuick()', 'function workspace()', 'function projectProgress(p)', 'case\'uxOpen\'', 'case\'uxLegacy\''])assert.ok(source.includes(word),word);
  assert.ok(source.includes('const pages={home,quick:createQuick,workspace,journey,dashboard,projects,') && source.includes('experiences,operations,traffic,staff,catalog,capex,deployment,finance,funding:fundingPage,contracts:contractsPage,quote:quotePage,history,exports}')); // V1.8 adds the guided journey route
});
test('l’espace rectangulaire est validé avec rotation possible, pas par simple superficie',()=>{
  const match=getAreaMatch();
  const exp={playWidthM:8,playDepthM:6.5};
  assert.equal(match(exp,{playWidthM:8,playDepthM:6.5}),true);
  assert.equal(match(exp,{playWidthM:6.5,playDepthM:8}),true);
  assert.equal(match(exp,{playWidthM:9,playDepthM:7}),true);
  assert.equal(match(exp,{playWidthM:10,playDepthM:5}),false);
  assert.equal(match(exp,{playWidthM:0,playDepthM:0}),null);
});
test('compatibilité conservatrice : options incompatibles filtrées sauf affichage volontaire',()=>{
  assert.ok(source.includes('showAllXps||setupExperienceFit(x,item).compatible'));
  assert.ok(source.includes('Incompatible'));
  assert.ok(source.includes('Dimensions à vérifier'));
});
test('suivi léger et progression par mode documentés dans les données du projet',()=>{
  for(const key of ['ux.status','ux.nextAction','ux.nextDate','ux.notes','ux.level'])assert.ok(source.includes(key),key);
  assert.ok(source.includes("const included=level==='quick'"));
});
