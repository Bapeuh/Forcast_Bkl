// Allocation contractuelle indicative — séparée de la rentabilité consolidée.
// Les paiements entre partenaires sont des transferts internes au projet, non des recettes supplémentaires.
import { computeRevenueRoutes } from './revenue-routes.mjs';
const n=(v,d=0)=>v===''||v===null||v===undefined?d:Number(v)||0;
const round=v=>Math.round((v+Number.EPSILON)*100)/100;
export function partnerSettlement(model, forecast){
 const config=model.finance?.partnership||{};
 const names=[...new Set(['Backlight',...(config.partners||[]).map(x=>x.name).filter(Boolean),...(config.contracts||[]).map(x=>x.beneficiary).filter(Boolean),...(config.revenueRoutes||[]).flatMap(x=>[x.collector,...(x.allocations||[]).map(a=>a.partner)]).filter(Boolean)])];
 const partners=Object.fromEntries(names.map(name=>[name,{name,receipts:0,expenses:0,transfersIn:0,transfersOut:0,balance:0}]));
 const problems=[],records=[];
 const ticketHT=n(forecast.finance.ticketHT),ticketTTC=n(forecast.traffic.gross),visitors=n(forecast.traffic.visitors);
 const baseMap={ticketHT,ticketTTC,netHT:Math.max(0,ticketHT-n(forecast.finance.fee))};
 const payer=config.collector||'Backlight';if(!partners[payer])partners[payer]={name:payer,receipts:0,expenses:0,transfersIn:0,transfersOut:0,balance:0};
 const mainIncome=n(forecast.finance.revenue);partners[payer].receipts=round(mainIncome);
 const cost=n(forecast.finance.expenses)+n(forecast.capex.purchase)+n(forecast.deployment.byPhase.before)+n(forecast.deployment.byPhase.after);
 const shares=config.expenseShares||[];
 if(shares.length){const sum=shares.reduce((s,x)=>s+n(x.percent),0);if(Math.abs(sum-100)>.011)problems.push('La répartition des dépenses doit totaliser 100 %.');for(const s of shares){if(!partners[s.name]){problems.push(`Payeur inconnu : ${s.name}`);continue;}partners[s.name].expenses=round(cost*n(s.percent)/100)}}else partners[payer].expenses=round(cost);
 let transferTotal=0;
 const visualActive=(config.revenueRoutes||[]).some(r=>r.enabled!==false);
 if(visualActive){
  const routes=computeRevenueRoutes(config.revenueRoutes,forecast);
  problems.push(...routes.problems);
  const receiptOwners={ticketHT:Math.min(mainIncome,ticketHT),ancillaryHT:Math.max(0,n(forecast.finance.ancillary))};
  for(const route of routes.routes){
   if(!route.enabled||!route.valid)continue;
   const src=route.source==='ancillaryHT'?'ancillaryHT':'ticketHT';
   const collector=route.collector||payer;
   if(!partners[collector]){problems.push(`Collecteur inconnu : ${collector}`);continue}
   // Reclasser les recettes chez leur collecteur réel sans ajouter de CA.
   if(collector!==payer){const moved=round(receiptOwners[src]||0);partners[payer].receipts=round(partners[payer].receipts-moved);partners[collector].receipts=round(partners[collector].receipts+moved)}
   for(const a of route.allocations){
    if(a.partner===collector||a.amount<=0)continue;
    if(!partners[a.partner]){problems.push(`Bénéficiaire inconnu : ${a.partner}`);continue}
    const amount=round(a.amount);transferTotal+=amount;
    partners[collector].transfersOut=round(partners[collector].transfersOut+amount);
    partners[a.partner].transfersIn=round(partners[a.partner].transfersIn+amount);
    records.push({name:route.name,beneficiary:a.partner,payer:collector,type:'route',amount,base:route.source});
   }
  }
  if((config.contracts||[]).some(c=>c.enabled!==false))problems.push('Les anciens contrats sont conservés mais ignorés pendant le mode circuits visuels : vérifier les accords avant validation.');
 }
 for(const c of (visualActive?[]:config.contracts||[])){
  if(!c.enabled)continue;
  const recipient=c.beneficiary;
  if(!partners[recipient]){problems.push(`Bénéficiaire inconnu : ${recipient}`);continue}
  if(recipient===payer){problems.push(`Contrat « ${c.name||'Sans nom'} » : bénéficiaire et collecteur identiques.`);continue}
  let amount=0;const base=baseMap[c.base||'ticketHT']??ticketHT;
  if(c.type==='fixed')amount=n(c.amount);
  else if(c.type==='share')amount=base*n(c.percent)/100;
  else if(c.type==='ppp')amount=visitors*n(c.perVisitor);
  else if(c.type==='mg'){
   const share=base*n(c.percent)/100,mg=n(c.amount);
   amount=c.recoverable===false?mg+share:Math.max(mg,share);
  }else{problems.push(`Type de contrat inconnu : ${c.type}`);continue}
  if(amount<0){problems.push(`Contrat négatif : ${c.name}`);continue}
  amount=round(amount);transferTotal+=amount;partners[recipient].transfersIn=round(partners[recipient].transfersIn+amount);partners[payer].transfersOut=round(partners[payer].transfersOut+amount);
  records.push({name:c.name||c.type,beneficiary:recipient,payer,type:c.type,amount,base:c.base||'ticketHT'});
 }
 if(transferTotal>mainIncome+.01)problems.push('Les versements contractuels excèdent les recettes globales : vérifier le financement des obligations.');
 for(const p of Object.values(partners))p.balance=round(p.receipts+p.transfersIn-p.expenses-p.transfersOut);
 const consolidated=round(Object.values(partners).reduce((s,p)=>s+p.balance,0));
 return {partners:Object.values(partners),records,problems,cost:round(cost),revenue:round(mainIncome),consolidated,
  disclaimer:'Simulation indicative sur la période entière : les échéances réelles, la TVA contractuelle et les obligations fiscales ne sont pas encore modélisées.'};
}
