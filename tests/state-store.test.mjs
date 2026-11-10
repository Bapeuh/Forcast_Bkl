import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {stateStore,validateState} from '../core/state-store.mjs';

const initial=()=>({version:1,activeId:'a',projects:[{id:'a',name:'Original'}],catalog:[],scenarios:[]});
function sandbox(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forecast-store-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}

test('premier démarrage crée un état et une sauvegarde quotidienne',t=>{
 const dir=sandbox(t), s=stateStore(dir,initial());
 assert.equal(s.get().projects[0].name,'Original');
 assert.ok(fs.existsSync(path.join(dir,'state.json')));
 assert.ok(s.listBackups().some(x=>x.startsWith('daily-')));
});
test('le remplacement sauvegarde exactement l’ancienne version avant écriture',t=>{
 const dir=sandbox(t),s=stateStore(dir,initial());
 s.replace({...initial(),projects:[{id:'a',name:'Modifié'}]});
 const backup=s.listBackups().find(x=>x.startsWith('pre-change-'));
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'backups',backup))).projects[0].name,'Original');
 assert.equal(s.get().projects[0].name,'Modifié');
});
test('la restauration conserve une sauvegarde de la version précédente',t=>{
 const dir=sandbox(t),s=stateStore(dir,initial());
 s.replace({...initial(),projects:[{id:'a',name:'Modifié'}]});
 const old=s.listBackups().find(x=>x.startsWith('pre-change-'));
 s.restore(old);
 assert.equal(s.get().projects[0].name,'Original');
 assert.ok(s.listBackups().filter(x=>x.startsWith('pre-change-')).length>=2);
});
test('les états invalides ne modifient jamais le fichier sur disque',t=>{
 const dir=sandbox(t),s=stateStore(dir,initial()),original=fs.readFileSync(path.join(dir,'state.json'),'utf8');
 assert.throws(()=>s.replace({projects:[],catalog:[]}),/Structure invalide/);
 assert.equal(fs.readFileSync(path.join(dir,'state.json'),'utf8'),original);
});
test('fichier JSON corrompu : arrêt explicite sans écrasement',t=>{
 const dir=sandbox(t);fs.writeFileSync(path.join(dir,'state.json'),'{JSON CORROMPU');
 assert.throws(()=>stateStore(dir,initial()),/Aucune écriture effectuée/);
 assert.equal(fs.readFileSync(path.join(dir,'state.json'),'utf8'),'{JSON CORROMPU');
});
test('restauration empêche la traversée de répertoires',t=>{
 const dir=sandbox(t),s=stateStore(dir,initial());
 assert.throws(()=>s.restore('../state.json'),/Nom de sauvegarde invalide/);
});
test('références de projets invalides refusées',()=>{
 assert.throws(()=>validateState({projects:[{name:'sans id'}],catalog:[],scenarios:[]}),/Projet invalide/);
});
