import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const js = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/app.css', import.meta.url), 'utf8');
test('V1.8 provides six coherent journey steps from project to reports',()=>{
  for(const title of ['Définir le contexte','Choisir le contenu','Configurer les installations','Vérifier les résultats','Chiffrer les coûts','Finaliser la proposition']) assert.ok(js.includes(title),title);
  assert.ok(js.includes('function journey()'));
  assert.ok(js.includes("case'journeyStep'"));
  assert.ok(js.includes('pages={home,quick:createQuick,workspace,journey'));
});
test('guided fields reuse project settings and forecasts instead of parallel storage',()=>{
 for(const key of ['project.name','experiences.0.capacity','locations.0.startDate','locations.0.rooms.0.setups.0.headsets','settings.sessionRatePercent','settings.fillRatePercent']) assert.ok(js.includes(key),key);
 for(const key of ['results.traffic','results.capex','results.finance','scheduleSave']) assert.ok(js.includes(key),key);
});
test('journey exposes library import, set-up creation, and legacy access',()=>{
 for(const key of ['journeyExperienceSelect','journeyCreateRoom','journeyCreateSetup','uxQuickStructure','uxLegacy:finance','uxLegacy:capex','uxLegacy:exports']) assert.ok(js.includes(key),key);
 assert.ok(css.includes('.journey-layout'));
 assert.ok(css.includes('@media(max-width:850px)'));
});
