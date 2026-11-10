// Circuits économiques de recettes, sans création de revenus ni échéancier de trésorerie.
// Les valeurs des routes sont indicatives et ne sont versées qu'une fois dans partnerSettlement.
const val=x=>Number.isFinite(Number(x))?Number(x):0;
const money=n=>Math.round((n+Number.EPSILON)*100)/100;
export const SOURCE_LABELS={ticketHT:'Billetterie HT',netHT:'Billetterie HT après frais',ticketTTC:'Billetterie TTC',ancillaryHT:'Recettes annexes HT'};
export function computeRevenueRoutes(routes, forecast){
 const problems=[],computed=[],used=new Set();
 const values={ticketHT:val(forecast.finance?.ticketHT),ticketTTC:val(forecast.traffic?.gross),netHT:Math.max(0,val(forecast.finance?.ticketHT)-val(forecast.finance?.fee)),ancillaryHT:val(forecast.finance?.ancillary)};
 for(const [i,r] of (routes||[]).entries()){
  const source=r.source||'ticketHT',bucket=source==='ancillaryHT'?'ancillary':'ticket';
  const errors=[];
  if(!SOURCE_LABELS[source])errors.push('Source de recette inconnue');
  if(r.enabled!==false&&used.has(bucket))errors.push('Cette famille de recettes est déjà utilisée par un autre circuit actif');
  if(r.enabled!==false)used.add(bucket);
  const splits=(r.allocations||[]).map(a=>({...a,percent:val(a.percent)}));
  if(!splits.length)errors.push('Ajoutez au moins un bénéficiaire');
  for(const a of splits)if(a.percent<0||a.percent>100||!a.partner)errors.push('Part ou bénéficiaire invalide');
  if(new Set(splits.map(a=>a.partner)).size!==splits.length)errors.push('Le même partenaire est présent plusieurs fois dans ce circuit');
  const total=money(splits.reduce((s,a)=>s+a.percent,0));
  if(Math.abs(total-100)>.011)errors.push(`Répartition à ${total} % au lieu de 100 %`);
  const base=money(values[source]||0),amounts=splits.map(a=>money(base*a.percent/100));
  if(amounts.length&&Math.abs(total-100)<=.011){const delta=money(base-amounts.reduce((a,b)=>a+b,0));amounts[amounts.length-1]=money(amounts.at(-1)+delta)}
  const item={...r,source,name:r.name||SOURCE_LABELS[source]||`Circuit ${i+1}`,enabled:r.enabled!==false,base,total,valid:errors.length===0,errors,allocations:splits.map((a,j)=>({...a,amount:amounts[j]}))};
  computed.push(item);if(item.enabled)problems.push(...errors.map(e=>`${item.name} : ${e}`));
  if(item.enabled&&source==='ticketTTC')problems.push(`${item.name} : assiette TTC, attention à la TVA non disponible pour distribution.`);
 }
 return {routes:computed,problems,baseValues:values};
}
