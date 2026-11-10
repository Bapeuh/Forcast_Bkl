import fs from 'node:fs';
import path from 'node:path';

export function validateState(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
      !Array.isArray(payload.projects) || !Array.isArray(payload.catalog) ||
      !Array.isArray(payload.scenarios)) throw new Error('Structure invalide');
  if (payload.projects.length > 5000 || payload.catalog.length > 30000) throw new Error('Trop de données');
  if (payload.projects.some(p => !p || typeof p !== 'object' || typeof p.id !== 'string'))
    throw new Error('Projet invalide');
  return true;
}

export function atomicWrite(filename, value) {
  const tmp = `${filename}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(value, null, 2), {encoding:'utf8', flag:'wx'});
    fs.renameSync(tmp, filename);
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}

export function stateStore(dataDir, defaultState) {
  const statePath = path.join(dataDir, 'state.json');
  const backupDir = path.join(dataDir, 'backups');
  fs.mkdirSync(backupDir, {recursive:true});
  let current;
  if (fs.existsSync(statePath)) {
    // Fail closed: never replace a damaged project file with demonstration data.
    try { current = JSON.parse(fs.readFileSync(statePath,'utf8')); validateState(current); }
    catch (error) { throw new Error(`Données existantes invalides (${statePath}). Aucune écriture effectuée : ${error.message}`); }
  } else { validateState(defaultState); current=structuredClone(defaultState); atomicWrite(statePath,current); }

  function snapshot(prefix='backup') {
    const name = `${prefix}-${new Date().toISOString().replace(/[:.]/g,'-')}-${Math.random().toString(36).slice(2,8)}.json`;
    atomicWrite(path.join(backupDir,name),current);
    return name;
  }
  function dailyBackup() {
    const name=`daily-${new Date().toISOString().slice(0,10)}.json`;
    const file=path.join(backupDir,name);
    if (!fs.existsSync(file)) atomicWrite(file,current);
  }
  function replace(next) {
    validateState(next);
    // Save the *previous* state before changing memory or disk.
    snapshot('pre-change');
    const updated={...structuredClone(next),updatedAt:new Date().toISOString()};
    atomicWrite(statePath,updated);
    current=updated;
    dailyBackup();
    return current;
  }
  function restore(name) {
    if (typeof name !== 'string' || !/^[\w.-]+\.json$/.test(name) || name.includes('..')) throw new Error('Nom de sauvegarde invalide');
    const parsed=JSON.parse(fs.readFileSync(path.join(backupDir,name),'utf8'));
    return replace(parsed);
  }
  dailyBackup();
  return {
    get:()=>current,
    replace,
    restore,
    snapshot,
    listBackups:()=>fs.readdirSync(backupDir).filter(x=>x.endsWith('.json')).sort().reverse(),
  };
}
