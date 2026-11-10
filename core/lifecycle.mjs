/** V1.9.1 : dossiers et phases. Les simulations existantes restent des projets d’exploitation indépendants. */
export function migrateLifecycle(state, makeId) {
  if (!Array.isArray(state.projectGroups)) state.projectGroups=[];
  for(const project of state.projects||[]){
    if(project.groupId && state.projectGroups.some(g=>g.id===project.groupId))continue;
    const id=makeId();
    state.projectGroups.push({id,name:project.name,development:{enabled:false,status:'later',notes:''},createdAt:new Date().toISOString()});
    project.groupId=id;
    project.phaseType='operation';
    project.operationLabel=project.operationLabel||project.name;
  }
  state.lifecycleVersion=1;
  return state;
}
export function groupOperations(state,groupId){return (state.projects||[]).filter(p=>p.groupId===groupId);}
export function createGroup(state,name,makeId){
  const group={id:makeId(),name:name.trim(),development:{enabled:false,status:'later',notes:''},createdAt:new Date().toISOString()};
  state.projectGroups??=[];state.projectGroups.push(group);return group;
}
export function attachOperation(project,group,makeId, name){
  const next=structuredClone(project);
  next.id=makeId();next.groupId=group.id;next.phaseType='operation';next.name=name;
  next.operationLabel=name;
  // Independent setup/location/expertise IDs; maintain references inside the copied operation.
  const xpMap=new Map();
  for(const xp of next.experiences||[]){const old=xp.id;xp.id=makeId();xpMap.set(old,xp.id)}
  for(const l of next.locations||[]){l.id=makeId();for(const r of l.rooms||[]){r.id=makeId();for(const s of r.setups||[]){s.id=makeId();if(xpMap.has(s.experienceId))s.experienceId=xpMap.get(s.experienceId);for(const a of s.assignments||[]){if(xpMap.has(a.experienceId))a.experienceId=xpMap.get(a.experienceId)}}}}
  // Do not clone financial/operating figures into a "blank" exploitation by accident: this function is explicitly a duplicate.
  return next;
}
export function createBlankOperation(template,group,makeId,name){
  const p=template();p.groupId=group.id;p.phaseType='operation';p.name=name;p.operationLabel=name;
  p.experiences=[];p.locations=[];
  return p;
}
export function lifecycleSummary(state,groupId){
  const ops=groupOperations(state,groupId);
  return {operations:ops.length,locations:ops.reduce((s,p)=>s+(p.locations?.length||0),0),experiences:[...new Set(ops.flatMap(p=>(p.experiences||[]).map(x=>x.libraryId||x.name?.trim().toLowerCase())))].filter(Boolean).length};
}
