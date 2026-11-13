// L01 presentation-only nested commercial detail. Never add children to the invoice total.
const money=n=>Math.round((Number(n)+Number.EPSILON)*100)/100;
const num=n=>Number.isFinite(Number(n))?Number(n):0;
export function normalizeQuoteRow(row){return {...row,displayMode:['summary','detailed','custom'].includes(row.displayMode)?row.displayMode:'summary',pricingMode:row.pricingMode==='calculated'?'calculated':'fixed',children:Array.isArray(row.children)?row.children.map((c,i)=>({id:String(c.id||'detail-'+i),description:String(c.description||''),quantity:num(c.quantity??1),unit:c.unit==null?null:num(c.unit),unitLabel:String(c.unitLabel||''),visible:c.visible!==false})):[]};}
export function childTotal(children){return money(children.filter(c=>c.unit!=null).reduce((sum,c)=>sum+num(c.quantity)*num(c.unit),0));}
export function rowSale(row){const r=normalizeQuoteRow(row);return r.pricingMode==='calculated'&&r.children.length?(r.children.some(c=>c.unit==null)?null:childTotal(r.children)):r.unit==null?null:money(num(r.quantity)*num(r.unit));}
export function detailDisclosure(row){const r=normalizeQuoteRow(row);if(r.displayMode==='summary')return {children:[],warning:''};const list=r.children.filter(x=>r.displayMode==='detailed'||x.visible!==false);if(!list.length)return {children:[],warning:''};const sum=childTotal(list),sale=rowSale(r);const allPriced=list.every(c=>c.unit!=null);const partial=!allPriced;const mismatch=allPriced&&sale!=null&&Math.abs(sum-sale)>.009;
 // A detailed priced list that disagrees with the parent is misleading. Hide amounts, keep descriptions.
 return {children:list.map(x=>({...x,showPrice:!mismatch&&!partial&&x.unit!=null})),warning:mismatch?'Détail indicatif : montants non affichés car différents du forfait.':partial?'Détail indicatif : compléter les prix avant de les afficher.':''};}
export function commercialRows(quote){return (quote.rows||[]).filter(r=>r.enabled!==false).map(normalizeQuoteRow);}
export function materialChangeSet(before=[],after=[]){const map=a=>new Map(a.filter(x=>x.source?.startsWith('material:')).map(x=>[x.source,x]));const old=map(before),fresh=map(after);const keys=new Set([...old.keys(),...fresh.keys()]);return [...keys].map(key=>({source:key,old:old.get(key),next:fresh.get(key)})).filter(x=>!x.old||!x.next||x.old.quantity!==x.next.quantity||x.old.unit!==x.next.unit||x.old.description!==x.next.description);}
export function canMutateQuote(quote){return !['Envoyé','Accepté','Refusé','Expiré'].includes(quote.status);}

/** Refreshes linked budget rows, preserving custom items and visual preferences.
 * Never mutates either argument (for an issued quote, caller creates a new version).
 */
export function synchronizeQuoteRows(previous=[],generated=[]){
 const sourceKey=r=>typeof r.source==='string'&&/^(material:|mission:)/.test(r.source)?r.source:null;
 const existing=new Map(previous.filter(r=>sourceKey(r)).map(r=>[sourceKey(r),r]));
 const updated=generated.map(row=>{
  const old=existing.get(sourceKey(row));
  if(!old)return structuredClone(row);
  const result={...structuredClone(old),...structuredClone(row),id:old.id,enabled:old.enabled,details:old.details??row.details};
  if(old.childrenSource!=='deployment'&&Array.isArray(old.children)&&old.children.length){result.children=structuredClone(old.children);result.childrenSource='manual';}
  result.displayMode=old.displayMode||row.displayMode;
  result.pricingMode=old.pricingMode||row.pricingMode;
  return result;
 });
 const sourced=new Set(generated.map(sourceKey).filter(Boolean));
 // Preserve manually written rows, including grouped bundles; obsolete source rows are removed.
 const manual=previous.filter(row=>!sourceKey(row)).map(row=>structuredClone(row));
 return [...updated,...manual];
}
