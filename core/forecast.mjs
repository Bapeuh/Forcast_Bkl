// Moteurs purs : aucune dépendance au serveur, à l'interface ou au stockage.
export const num=(v,d=0)=>(v===null||v===undefined||v==='')?d:(Number.isFinite(Number(v))?Number(v):d);
export const ceil=v=>Math.ceil(Math.max(0,num(v)));
export const money=v=>Math.round((num(v)+Number.EPSILON)*100)/100;
export function datesBetween(start,end){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start||'')||!/^\d{4}-\d{2}-\d{2}$/.test(end||''))return [];
 let a=new Date(start+'T12:00:00Z'), b=new Date(end+'T12:00:00Z');if(!(a<=b)||b-a>1000*86400000)return [];
 const out=[];for(;a<=b;a.setUTCDate(a.getUTCDate()+1))out.push(a.toISOString().slice(0,10));return out;
}
export function minutes(s){if(typeof s==='number')return s;let [h,m]=String(s||'0:00').split(':').map(Number);return (h||0)*60+(m||0)}
export function minutesOpen(day,location){
 const exception=(location.exceptions||[]).find(e=>day>=e.from&&day<=e.to);
 if(exception?.closed)return 0;
 const weekday=(new Date(day+'T12:00:00Z').getUTCDay()+6)%7;
 const rule=(location.week||[])[weekday] || {open:weekday<5,start:'10:00',end:'18:00'};
 if(!rule.open&&!(exception&&!exception.closed))return 0;
 const start=minutes(exception?.start??rule.start),end=minutes(exception?.end??rule.end);
 return Math.max(0,end-start);
}
export function launchCount(openMinutes, cycle, sessionDuration=cycle){
 // A launch is possible only if the entire session fits before closing.
 const gap=num(cycle),duration=num(sessionDuration);if(gap<=0||duration<=0||openMinutes<duration)return 0;
 return 1+Math.floor((openMinutes-duration)/gap);
}
// Anciennes sauvegardes : interval = écart entre débuts. Nouvelle saisie : turnaround = délai après la fin.
export function turnaround(experience){return Math.max(0,num(experience.turnaround,Math.max(0,num(experience.interval,experience.duration)-num(experience.duration))))}
export function setupAssignments(setup,experiences){
 const options=Array.isArray(setup.assignments)&&setup.assignments.length?setup.assignments:[{experienceId:setup.experienceId,share:100,ticketPrice:setup.ticketPrice}];
 return options.filter(x=>experiences[x.experienceId]&&num(x.share)>0).map(x=>({...x,experience:experiences[x.experienceId]}));
}
export function deriveSetup(setup,experience,openMinutes,settings={}){
 const cap=Math.max(0,num(setup.capacity??experience.capacity,10));
 const duration=num(setup.duration??experience.duration,35);
 const gap=setup.turnaround!=null?num(setup.turnaround):setup.interval!=null?Math.max(0,num(setup.interval)-duration):turnaround(experience);
 const potential=launchCount(openMinutes,duration+gap,duration);
 const sessionRate=Math.min(1,Math.max(0,num(setup.sessionRate??settings.sessionRate??0.65)));
 const fillRate=Math.min(1,Math.max(0,num(setup.fillRate??settings.fillRate??0.85)));
 const played=potential*sessionRate,visitors=played*cap*fillRate;
 const price=num(setup.ticketPrice??experience.ticketPrice,35);
 return {potential,played,visitors,capacity:potential*cap,gross:visitors*price,maxGross:potential*cap*price,openMinutes,cap,price};
}
export function getActiveSets(model){
 const locations=model.locations||[];
 return locations.flatMap(loc=>(loc.rooms||[]).flatMap(room=>(room.setups||[]).map(s=>({loc,room,setup:s}))));
}
export function forecastTraffic(model,period={}){
 const experiences=Object.fromEntries((model.experiences||[]).map(e=>[e.id,e]));
 const lines=[],monthly=new Map(),byLocation=new Map();let potential=0,played=0,visitors=0,capacity=0,gross=0,maxGross=0,days=0,openHours=0;
 for(const loc of model.locations||[]){
  const from=period.start&&period.start>loc.startDate?period.start:loc.startDate;
  const to=period.end&&period.end<loc.endDate?period.end:loc.endDate;
  for(const day of datesBetween(from,to)){
   const duration=minutesOpen(day,loc);if(duration<=0)continue;
   days++;openHours+=duration/60;let dayVisitors=0,dayGross=0,dayMaxGross=0,dayPotential=0,dayPlayed=0,dayCapacity=0;
   for(const room of loc.rooms||[]){
    const roomDuration=(room.week||room.exceptions)?minutesOpen(day,{...loc,week:room.week||loc.week,exceptions:[...(loc.exceptions||[]),...(room.exceptions||[])]}):duration;
    if(roomDuration<=0)continue;
    for(const setup of room.setups||[]){
     const assignments=setupAssignments(setup,experiences);if(!assignments.length)continue;
     const copies=Math.max(1,Math.floor(num(setup.count,1)));
     const cap=Math.max(0,num(setup.capacity??setup.headsets??assignments[0].experience.capacity,10));
     // Un setup physique : un seul calendrier de créneaux, même avec plusieurs expériences.
     const longest=Math.max(...assignments.map(a=>num(setup.duration??a.experience.duration,35)));
     const gap=Math.max(...assignments.map(a=>setup.turnaround!=null?num(setup.turnaround):setup.interval!=null?Math.max(0,num(setup.interval)-num(setup.duration??a.experience.duration)):turnaround(a.experience)));
     const slots=launchCount(roomDuration,longest+gap,longest)*copies;
     const rate=Math.min(1,Math.max(0,num(setup.sessionRate??model.settings?.sessionRate,.65)));
     const fill=Math.min(1,Math.max(0,num(setup.fillRate??model.settings?.fillRate,.85)));
     // Legacy or malformed percentages are normalized, never exceeding one physical setup.
     const totalShare=assignments.reduce((sum,a)=>sum+Math.max(0,num(a.share)),0);
     for(const a of assignments){
      const share=Math.max(0,num(a.share))/totalShare;
      const xPotential=slots*share,xPlayed=xPotential*rate,xCapacity=xPotential*cap,xVisitors=xPlayed*cap*fill;
      const price=num(a.ticketPrice,a.experience.ticketPrice??35),xGross=xVisitors*price,xMaxGross=xCapacity*price;
      dayVisitors+=xVisitors;dayGross+=xGross;dayMaxGross+=xMaxGross;dayPotential+=xPotential;dayPlayed+=xPlayed;dayCapacity+=xCapacity;
      lines.push({date:day,location:loc.name,room:room.name,setup:setup.name,experience:a.experience.name,potential:xPotential,played:xPlayed,visitors:xVisitors,capacity:xCapacity,gross:xGross,maxGross:xMaxGross,share,price,copies,openMinutes:roomDuration});
     }
    }
   }
   const key=day.slice(0,7),m=monthly.get(key)||{month:key,visitors:0,gross:0,maxGross:0,potential:0,played:0,capacity:0,openDays:0};
   m.visitors+=dayVisitors;m.gross+=dayGross;m.maxGross+=dayMaxGross;m.potential+=dayPotential;m.played+=dayPlayed;m.capacity+=dayCapacity;m.openDays++;monthly.set(key,m);
   const z=byLocation.get(loc.id)||{id:loc.id,name:loc.name,visitors:0,gross:0,maxGross:0,potential:0,played:0,capacity:0,days:0};
   z.visitors+=dayVisitors;z.gross+=dayGross;z.maxGross+=dayMaxGross;z.potential+=dayPotential;z.played+=dayPlayed;z.capacity+=dayCapacity;z.days++;byLocation.set(loc.id,z);
   visitors+=dayVisitors;gross+=dayGross;maxGross+=dayMaxGross;potential+=dayPotential;played+=dayPlayed;capacity+=dayCapacity;
  }
 }
 return {potential,played,visitors,capacity,gross,maxGross,days,openHours,lines,monthly:[...monthly.values()].sort((a,b)=>a.month.localeCompare(b.month)),byLocation:[...byLocation.values()]};
}
export function staffCost(model){
 const st=model.staff||{};const rate=num(st.hourlyCost,23);const opRatio=num(st.operatorsPerSetup,0.6);
 const experienceById=Object.fromEntries((model.experiences||[]).map(e=>[e.id,e]));
 const before=num(st.beforeMinutes,60)/60,after=num(st.afterMinutes,60)/60;
 let hours=0,shiftHours=0,pauseHours=0;
 for(const loc of model.locations||[]){
  const setups=(loc.rooms||[]).flatMap(r=>r.setups||[]);
  const needs=ceil(setups.reduce((s,x)=>s+num(x.count,1)*num(x.operatorsRatio,Math.max(opRatio,...setupAssignments(x,experienceById).map(a=>num(a.experience.operatorsRatio,opRatio)))),0))+num(st.reception,0);
  for(const day of datesBetween(loc.startDate,loc.endDate)){
   const m=minutesOpen(day,loc);if(!m)continue;
   const pre=num(st.beforeOperators,needs),post=num(st.afterOperators,needs);
   shiftHours+=(pre*before+needs*m/60+post*after);
   const pauseDuration=m/60>=num(st.pauseThresholdHours,6)?num(st.pauseMinutes,60)/60:0;
   // Cover pauses with relief hours only when a minimum simultaneous presence is required.
   const coverage=st.pauseCoverage===false?0:needs*pauseDuration;
   pauseHours+=coverage;
  }
 }
 hours=shiftHours+pauseHours;
 let extras=0;for(const p of st.extraStaff||[]){extras+=p.mode==='fixed'?num(p.amount):num(p.people,1)*num(p.hours)*num(p.rate,rate)}
 return {hours,shiftHours,pauseHours,cost:money(hours*rate+extras),extras,rate};
}
export function estimateCapex(model,catalog=[]){
 const raw=[];const byId=Object.fromEntries(catalog.map(x=>[x.id,x]));
 const find=(...terms)=>catalog.find(x=>terms.some(t=>x.name.toLowerCase().includes(t.toLowerCase())));
 const price=(id,fallback)=>byId[id]?.price??fallback?.price??null;
 const push=(name,qty,unit,category,reason,id='',mode='calculated')=>{
  if(qty<=0)return;raw.push({id:id||name,name,qty,unitCost:unit==null?null:num(unit),category,reason,mode})
 };
 let devices=0,pc=0,servers=0,ap=0,sets=0,spare=0,chargers=0;
 for(const {setup} of getActiveSets(model)){
  const copies=Math.max(1,Math.floor(num(setup.count,1))),headsets=Math.max(0,Math.floor(num(setup.headsets,setup.capacity||1)))*copies;
  devices+=headsets;sets+=copies;spare+=headsets*2;
  const pcvr=setup.mode==='PCVR';
  if(pcvr){pc+=headsets;ap+=ceil(headsets/3)}else ap+=copies;
  servers+=copies; // Un PC serveur pour chaque setup, y compris Standalone.
  const catalogHeadset=catalog.find(x=>x.category==='Casque VR'&&x.name.toLowerCase().includes((setup.headsetModel||'').toLowerCase()));
  push(setup.headsetModel||'Casque VR',headsets,catalogHeadset?.price??null,'Casque VR','1 casque par place',catalogHeadset?.id);
  const pico=/pico 4 ultra/i.test(setup.headsetModel||'');
  const combo=pico?find('Strap + 2 Batteries + Dock'):null;
  if(combo){
    push(combo.name,headsets,combo.price,'Accessoires VR','Kit incluant 2 batteries de spare + 1 dock de charge par casque',combo.id);
    chargers+=headsets;
  }else{
    push('Batterie spare',headsets*2,price('spare-battery'),'Accessoires VR','2 batteries supplémentaires par casque','spare-battery');
    const chargerCapacity=Math.max(1,num(model.settings?.chargerCapacity,2));
    const count=ceil(headsets*2/chargerCapacity);chargers+=count;
    push('Chargeur de batteries',count,price('battery-charger'),'Accessoires VR',`Charge ${chargerCapacity} batteries simultanément`,'battery-charger');
  }
  if(/HTC|VIVE/i.test(setup.headsetModel||''))push('VBMS '+(setup.vbmsTier||'Pro'),headsets,price('vbms-pro'),'Licences','1 licence par casque HTC','vbms-pro');
 }
 if(pc)push('PC client VR',pc,price('pc-client'),'Informatique','1 PC par casque PCVR','pc-client');
 if(servers)push('PC serveur',servers,price('pc-server'),'Informatique','1 serveur par setup, PCVR et Standalone','pc-server');
 push('Point d’accès Wi-Fi',ap,price('wifi-ap',find('EAP772')),'Réseau','PCVR 1 AP / 3 casques ; Standalone 1 AP / setup','wifi-ap');
 const zones=sets?Math.max(1,num(model.capex?.technicalZones,1)):0;
 const ports=pc+servers+ap+2*zones;
 const portsPerZone=zones?ceil(ports/zones):0;
 const sizes=[4,8,16,24,48];
 const sz=sizes.find(n=>n>=portsPerZone)||48;
 const switches=zones*ceil(portsPerZone/sz);
 const sw=find('Switch SG3428XMP');
 push(`Switch ${sz} ports`,switches,sz===24?sw?.price??null:find(`switch ${sz} ports`)?.price??null,'Réseau',`${ports} ports nécessaires estimés, ${zones} zone(s) technique(s)`);
 const kvmCount=pc+servers<=1?0:ceil((pc+servers-1)/7);
 const kvm=find('KVM HDMI 8 Port');
 push('KVM HDMI 8 ports',kvmCount,kvm?.price??null,'Supervision','1 pour 8 PC, cascade estimée au-delà de 8',kvm?.id);
 for(const [name,search,qty,category] of [
  ['Écran salle technique','Ecran Salle technique',zones,'Supervision'],
  ['Clavier','Clavier',zones,'Supervision'],['Souris','Souris',zones,'Supervision'],
  ['Tablette Android','Tablette Android',sets,'Supervision'],
  ['Routeur ER605v2','Routeur ER605v2',zones,'Réseau'],
  ['Controller OC200','Controller OC200',zones,'Réseau']
 ]){const item=find(search);push(name,qty,item?.price??null,category,'Base automatique personnalisable',item?.id)}
 for(const x of model.capex?.custom||[])push(x.name,num(x.qty,1),x.unitCost===''?null:x.unitCost,x.category||'Autre','Manuel',x.id||x.name,'custom');
 // Fusionner les éléments communs aux setups, puis appliquer les ajustements propres au devis.
 const merged=new Map();
 for(const x of raw){const key=x.id+'|'+x.name;if(merged.has(key)){merged.get(key).qty+=x.qty}else merged.set(key,{...x})}
 const overrides=model.capex?.overrides||{};
 const items=[...merged.values()].map(x=>{
  const ov=overrides[x.id]||{};
  const qty=Math.max(0,num(ov.qty,x.qty));
  const unitCost=ov.unitCost===null?null:num(ov.unitCost,x.unitCost);
  const excluded=Boolean(ov.excluded);
  return {...x,qty:excluded?0:qty,unitCost,excluded,originalQty:x.qty,total:unitCost===null?null:money((excluded?0:qty)*unitCost)};
 });
 const cost=items.reduce((s,x)=>s+num(x.total),0);
 const missing=items.filter(x=>x.unitCost===null&&x.qty>0);
 const margin=num(model.capex?.margin,0.30);
 const saleLines=items.map(x=>{
  const ov=overrides[x.id]||{};const m=num(ov.margin,margin);
  const sale=x.unitCost===null?null:money(x.qty*x.unitCost/(1-m));
  return {...x,margin:m,sale:ov.sale!=null?num(ov.sale):sale};
 });
 const sale=saleLines.some(x=>x.sale===null&&x.qty>0)?null:money(saleLines.reduce((s,x)=>s+num(x.sale),0));
 return {items:saleLines,cost:money(cost),sale,missing:missing.map(x=>x.name),devices,pc,servers,ap,sets,spare,chargers};
}
export function revenuesAndProfit(model,traffic,staff,capex){
 const tax=Math.max(0,num(model.settings?.vat,0.20));const ticketHT=traffic.gross/(1+tax);
 const fc=model.finance||{},opex=fc.opex||[];
 const months=Math.max(1,new Set(traffic.monthly.map(x=>x.month)).size);
 const fixed=opex.reduce((s,x)=>s+num(x.amount)*(x.frequency==='daily'?traffic.days:x.frequency==='weekly'?traffic.days/7:x.frequency==='monthly'?months:1),0);
 const variable=traffic.visitors*num(fc.variablePerVisitor)+traffic.played*num(fc.variablePerSession)+ticketHT*num(fc.variableRate);
 const ancillary=(fc.ancillary||[]).reduce((s,x)=>s+num(x.amount)*(x.frequency==='monthly'?months:1),0);
 const fee=fc.feeMode==='none'?0:traffic.visitors*num(fc.feeFixed)+ticketHT*num(fc.feeRate);
 const revenue=ticketHT+ancillary,expenses=fixed+variable+staff.cost+fee;
 const profit=revenue-expenses;
 const avgRevPerVisitor=traffic.visitors?revenue/traffic.visitors:((traffic.gross/Math.max(traffic.visitors,1))/(1+tax));
 const contrib=avgRevPerVisitor-num(fc.variablePerVisitor)-num(fc.variableRate)*(traffic.visitors?ticketHT/traffic.visitors:0)-num(fc.feeFixed);
 const breakeven=contrib>0?ceil((fixed+staff.cost)/contrib):null;
 const withCapex=profit-capex.cost;
 return {tax,ticketHT:money(ticketHT),ancillary:money(ancillary),revenue:money(revenue),fixed:money(fixed),variable:money(variable),fee:money(fee),expenses:money(expenses),profit:money(profit),withCapex:money(withCapex),breakeven,breakPerDay:traffic.days?breakeven/traffic.days:null,breakPerHour:traffic.openHours?breakeven/traffic.openHours:null,marginPerVisitor:money(contrib)};
}
export function fullForecast(model,catalog=[]){const traffic=forecastTraffic(model);const staff=staffCost(model);const capex=estimateCapex(model,catalog);const finance=revenuesAndProfit(model,traffic,staff,capex);return {traffic,staff,capex,finance,computedAt:new Date().toISOString()}}
export function compare(models,catalog){return models.map(m=>({name:m.name,...fullForecast(m,catalog)}))}
