
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
test('conserve ouverture des volets via position dans DOM',()=>{assert.match(app,/querySelectorAll\('#body details'\)/);assert.match(app,/details\[i\]\.open=true/)});
test('horaires saisis via champ texte et copie sur jours',()=>{assert.match(app,/function hourInput/);assert.ok(app.includes('class="copy-day"'));assert.match(app,/case'importExperience'/)});
test('bibliothèque réutilisée sans partager les identifiants de projets',()=>{assert.match(app,/function copyExperience/);assert.match(app,/experienceLibrary/);assert.match(app,/case'saveExperience'/)});
