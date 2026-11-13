import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const css=fs.readFileSync(path.join(root,'public/app.css'),'utf8');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
test('navigation latérale et page principale disposent de zones de scroll indépendantes',()=>{
 assert.match(html,/<nav id="nav"><\/nav>/);
 assert.match(css,/\.sidebar #nav\{[^}]*overflow-y:auto/);
 assert.match(css,/\.main\{[^}]*overflow-y:auto/);
 assert.match(css,/\.sidebar #nav\{[^}]*overscroll-behavior:contain/);
});
test('défilement mobile et impression conservent un comportement adapté',()=>{
 assert.match(css,/@media screen and \(max-width:760px\)/);
 assert.match(css,/@media print\{\s*html,body\{height:auto!important/);
});
