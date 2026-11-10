import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../public/app.css',import.meta.url),'utf8');
test('le selecteur projet apparait dans la barre de gauche et non en haut a droite',()=>{
 assert.match(html,/<aside class="sidebar">[\s\S]*<select id="projectSelect"/);
 assert.equal((html.match(/id="projectSelect"/g)||[]).length,1);
 assert.doesNotMatch(html,/<div class="topActions">\s*<select id="projectSelect"/);
});
test('le projet actif reste visible sur toutes les vues',()=>{
 assert.match(html,/id="projectContext"/);
 assert.match(js,/\$\('#projectContext'\)\.innerHTML=contextHeader\(p\)/);
 assert.match(js,/function projectNameDisplay\(p\)/);
});
test('renommage inline sauvegardable, annulable et non vide',()=>{
 assert.match(js,/case'startRename'/);
 assert.match(js,/case'finishRename'/);
 assert.match(js,/case'cancelRename'/);
 assert.match(js,/Le nom du projet ne peut pas être vide/);
 assert.match(js,/if\(e\.key==='Escape'\)/);
});
test('navigation memorisee lors du passage dun projet a un autre',()=>{
 assert.match(js,/projectContext\.set\(state\.activeId,\{workspaceTab,selectedNode,tab\}\)/);
 assert.match(js,/const ctx=projectContext\.get\(id\)/);
 assert.match(js,/switchProject\(e\.target\.value\)/);
});
test('dimensions regroupees avec surface calculee',()=>{
 assert.match(js,/dimension-group/);
 assert.match(js,/num\(x\.playWidthM\)\*num\(x\.playDepthM\)/);
 assert.match(css,/\.dimension-row\{display:grid;grid-template-columns:repeat\(2/);
});
