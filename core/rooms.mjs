// Pure room cloning. No mutation of the original room; recursive setup IDs are regenerated.
export function incrementRoomName(name, existingNames=[]){
 const names=new Set(existingNames);
 const match=String(name||'Salle').match(/^(.*?)(\d+)(\s*)$/);
 const base=match?match[1]:(String(name||'Salle').trim()+' ');
 let number=match?Number(match[2])+1:2;
 let proposal=base+number;
 while(names.has(proposal)){number++;proposal=base+number;}
 return proposal;
}
export function duplicateRoom(room, existingNames, idFactory, autoIncrement=true, customName=''){
 if(!room||typeof room!=='object')throw new TypeError('Salle requise');
 const clone=structuredClone(room);
 clone.id=idFactory();
 clone.name=customName.trim()|| (autoIncrement?incrementRoomName(room.name,existingNames):room.name+' — copie');
 clone.setups=(clone.setups||[]).map(setup=>({...setup,id:idFactory()}));
 return clone;
}
