import {rowSale,detailDisclosure} from './quote-details.mjs';
// Portable quote domain. No browser or persistence dependencies.
export const quoteCategories=['Matériel','Licences','Prestations techniques','Formation','Logistique','Maintenance','Production','Autres'];
const n=x=>Number.isFinite(Number(x))?Number(x):0;
const amount=x=>Math.round((x+Number.EPSILON)*100)/100;
/** Assemble des sous-lignes commerciales à partir des ressources d'une mission.
 * Les coûts internes ne quittent jamais le calcul : seules quantités et prix de vente alloués sont exposés.
 * Le dernier poste est ajusté au centime pour rester égal au forfait vendu. */
export function missionQuoteChildren(mission, sale, id=()=>crypto.randomUUID()) {
 const v=x=>Math.max(0,Number(x)||0), values=[];
 const put=(name,qty,cost,unitLabel='')=>{if(qty>0&&cost>0)values.push({description:name,quantity:qty,cost,unitLabel});};
 const jh=v(mission.technicians)*v(mission.days);
 put('Techniciens VR',jh,jh*v(mission.hoursPerDay)*v(mission.hourlyCost),'J/H');
 put('Préparation technique',v(mission.preparationHours),v(mission.preparationHours)*v(mission.preparationHourlyCost),'h');
 put('Hébergement',v(mission.travelers)*v(mission.nights),v(mission.travelers)*v(mission.nights)*v(mission.hotelPerNight),'nuit');
 put('Repas',v(mission.travelers)*v(mission.mealDays),v(mission.travelers)*v(mission.mealDays)*v(mission.mealPerDay),'repas');
 put('Transport et logistique',1,v(mission.travelers)*v(mission.transportPerPerson)+v(mission.localTransport)+v(mission.freight)+v(mission.customs)+v(mission.insurance)+v(mission.otherCost),'forfait');
 if(!values.length||!Number.isFinite(sale)||sale<=0)return [];
 const costSum=values.reduce((a,x)=>a+x.cost,0);
 let allocated=0;
 return values.map((x,i)=>{
  const value=i===values.length-1?amount(sale-allocated):amount(sale*x.cost/costSum);
  allocated+=value;
  // Keep quantities in their native unit (not merely informational). Precision at
  // 6 decimals prevents nearly all rounding drift; any residual is disclosed by detailDisclosure.
  return {id:id(),description:x.description,quantity:x.quantity,unit:Number((value/x.quantity).toFixed(6)),unitLabel:x.unitLabel,visible:true,workload:x.quantity,workloadUnit:x.unitLabel};
 });
}
export function seedQuote(project,capex,deployment,id=()=>crypto.randomUUID()){
 const rows=[];
 for(const x of capex.items||[]){
  if(!(x.qty>0))continue;
  const partitions=[['buy',x.buyQty??x.qty,x.purchaseTotal??x.total??0,'Achat'],['rent',x.rentQty??0,x.rentalTotal??0,'Location'],['stock',x.stockQty??0,x.stockUseTotal??0,'Mise à disposition']].filter(([,,v])=>Number(v)>0);
  // An older CAPEX object may only provide a single sale value: keep it as one line.
  const totalCost=partitions.reduce((s,p)=>s+Number(p[2]),0);
  if(!partitions.length){if(x.sale===0)continue;rows.push({id:id(),source:`material:${x.id}`,category:'Matériel',description:x.name,quantity:x.qty,unit:x.sale==null?null:amount(x.sale/x.qty),cost:x.total??null,enabled:true});continue;}
  let remaining=x.sale==null?null:amount(x.sale),acc=0;
  for(const [j,[kind,qty,cost,label]] of partitions.entries()){
   const last=j===partitions.length-1;
   const value=remaining===null?null:last?amount(remaining-acc):amount(remaining*Number(cost)/totalCost);
   if(value!==null)acc+=value;
   rows.push({id:id(),source:`material:${x.id}:${kind}`,category:'Matériel',description:x.name+(kind==='buy'?'':` — ${label}`),quantity:qty,unit:value===null?null:Number((value/qty).toFixed(6)),cost:cost??null,material:{buyQty:x.buyQty??x.qty,stockQty:x.stockQty??0,installedQty:x.installedQty??0,rentQty:x.rentQty??0,kind},enabled:true});
  }
 }
 for(const [index,x] of (deployment.items||[]).entries()){
  if(!(x.sale>0))continue;
  const mission=(project.deployment?.missions||[]).find(m=>(m.id||m.name)===x.id);
  const children=mission?missionQuoteChildren(mission,amount(x.sale),id):[];
  rows.push({id:id(),source:`mission:${index}`,category:x.sector|| (x.name.toLowerCase().match(/transport|voyage|hôtel|logistique|fret|douane/)?'Logistique':x.name.toLowerCase().match(/formation/)?'Formation':'Prestations techniques'),description:x.name,quantity:1,unit:amount(x.sale),cost:x.cost??null,enabled:true,children,childrenSource:children.length?'deployment':undefined,displayMode:'summary',pricingMode:'fixed'});
 }
 const today=new Date().toISOString().slice(0,10);
 return {id:id(),number:'DEV-'+today.slice(0,4)+'-001',version:1,status:'Brouillon',date:today,validUntil:'',client:'',clientAddress:'',clientContact:'',projectName:project.name||'',title:'Proposition commerciale — '+(project.name||'Projet'),vat:n(project.settings?.vat??.2)*100,discount:0,conditions:'40 % à la commande · 30 % à mi-parcours · 30 % à la livraison',notes:'Prix et disponibilités à confirmer avant acceptation.',company:{name:'BACKLIGHT STUDIO',address:'Coordonnées à confirmer',email:'',vat:'',bank:''},rows};
}
export function sortedQuoteRows(quote){
 const rows=(quote.rows||[]).filter(x=>x.enabled!==false);
 if(!['sector','sector-alpha'].includes(quote.sortMode))return rows;
 return rows.map((row,index)=>({row,index})).sort((a,b)=>{
  const nameA=String(a.row.category||'Autres'),nameB=String(b.row.category||'Autres');
  const groupA=quoteCategories.indexOf(nameA),groupB=quoteCategories.indexOf(nameB);
  const rankA=groupA<0?quoteCategories.length:groupA,rankB=groupB<0?quoteCategories.length:groupB;
  if(rankA!==rankB)return rankA-rankB;
  if(groupA<0){const byCategory=nameA.localeCompare(nameB,'fr');if(byCategory)return byCategory;}
  if(quote.sortMode==='sector-alpha'){const byName=String(a.row.description||'').localeCompare(String(b.row.description||''),'fr');if(byName)return byName;}
  return a.index-b.index;
 }).map(x=>x.row);
}
export function totals(quote){
 const lines=sortedQuoteRows(quote).map(x=>({...x,lineTotal:rowSale(x)}));
 const incomplete=lines.filter(x=>x.lineTotal===null);const subtotal=amount(lines.reduce((s,x)=>s+n(x.lineTotal),0));const discount=amount(subtotal*n(quote.discount)/100);const totalHT=amount(subtotal-discount);const vat=amount(totalHT*n(quote.vat)/100);
 return {lines,incomplete,subtotal,discount,totalHT,vat,totalTTC:amount(totalHT+vat),cost:amount(lines.reduce((s,x)=>s+n(x.cost),0))};
}
export function frenchCsv(rows){return '\ufeff'+rows.map(row=>row.map(value=>{const v=typeof value==='number'?String(value).replace('.',','):String(value??'');return '"'+v.replaceAll('"','""')+'"';}).join(';')).join('\r\n')+'\r\n';}
export function quoteCsv(q){const t=totals(q);return frenchCsv([['Devis',q.number,'Version',q.version],['Client',q.client],['Date',q.date],['Catégorie','Description','Quantité','PU HT','Total HT'],...t.lines.map(x=>[x.category,x.description,n(x.quantity),x.unit??'',x.lineTotal??'']),['','Sous-total HT','','',t.subtotal],['','Remise','','',t.discount],['','TVA ('+q.vat+' %)','','',t.vat],['','TOTAL TTC','','',t.totalTTC]]);}
export function xml(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');}
function crc32(data){let c=0xffffffff;for(const b of data){c^=b;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;}return (c^0xffffffff)>>>0;}
function zipStored(files){const enc=new TextEncoder(),local=[],central=[];let offset=0;const u16=(d,n,o)=>d.setUint16(o,n,true),u32=(d,n,o)=>d.setUint32(o,n>>>0,true);
 for(const [name,text] of files){const fn=enc.encode(name),bytes=enc.encode(text),crc=crc32(bytes),h=new Uint8Array(30+fn.length),v=new DataView(h.buffer);u32(v,0x04034b50,0);u16(v,20,4);u16(v,0,6);u16(v,0,8);u16(v,0,10);u16(v,0,12);u32(v,crc,14);u32(v,bytes.length,18);u32(v,bytes.length,22);u16(v,fn.length,26);h.set(fn,30);local.push(h,bytes);
 const ch=new Uint8Array(46+fn.length),cv=new DataView(ch.buffer);u32(cv,0x02014b50,0);u16(cv,20,4);u16(cv,20,6);u32(cv,crc,16);u32(cv,bytes.length,20);u32(cv,bytes.length,24);u16(cv,fn.length,28);u32(cv,offset,42);ch.set(fn,46);central.push(ch);offset+=h.length+bytes.length;}
 const centralSize=central.reduce((s,x)=>s+x.length,0),tail=new Uint8Array(22),v=new DataView(tail.buffer);u32(v,0x06054b50,0);u16(v,files.length,8);u16(v,files.length,10);u32(v,centralSize,12);u32(v,offset,16);const all=[...local,...central,tail],out=new Uint8Array(all.reduce((s,x)=>s+x.length,0));let at=0;for(const buf of all){out.set(buf,at);at+=buf.length}return out;}
function cell(col,row,val,style=0){const addr=col+row;if(typeof val==='number'&&Number.isFinite(val))return `<c r="${addr}" s="${style}"><v>${val}</v></c>`;return `<c r="${addr}" s="${style}" t="inlineStr"><is><t>${xml(val)}</t></is></c>`;}
export function quoteXlsx(q){const t=totals(q),body=[];let r=1;const push=(cells)=>{body.push(`<row r="${r}">${cells.map((x,i)=>cell('ABCDE'[i],r,x?.v??x,x?.s??0)).join('')}</row>`);r++};
 push(['BACKLIGHT STUDIO','DEVIS',q.number,'Version',q.version]);push(['Client',q.client,'Projet',q.projectName,'']);push(['Date',q.date,'Valable jusqu’au',q.validUntil,'']);push(['Adresse',q.clientAddress,'Contact',q.clientContact,'']);push(['Catégorie','Désignation','Quantité','PU HT','Total HT']);
 for(const l of t.lines)push([{v:l.category,s:2},l.description,{v:n(l.quantity),s:0},{v:l.unit??'',s:1},{v:l.lineTotal??'',s:1}]);
 push(['','Sous-total HT','','',{v:t.subtotal,s:1}]);push(['','Remise '+q.discount+' %','','',{v:t.discount,s:1}]);push(['','TVA '+q.vat+' %','','',{v:t.vat,s:1}]);push(['','TOTAL TTC','','',{v:t.totalTTC,s:1}]);push(['Conditions',q.conditions]);push(['Notes',q.notes]);
 const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><cols><col min="1" max="1" width="22" customWidth="1"/><col min="2" max="2" width="57" customWidth="1"/><col min="3" max="3" width="17" customWidth="1"/><col min="4" max="4" width="19" customWidth="1"/><col min="5" max="5" width="19" customWidth="1"/></cols><sheetData>${body.join('')}</sheetData></worksheet>`;
 const styles=`<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="# ##0,00 &quot;€&quot;"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Aptos"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Aptos"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1B3054"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"/></cellXfs></styleSheet>`;
 return zipStored([
 ['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
 ['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
 ['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Devis" sheetId="1" r:id="rId1"/></sheets></workbook>'],
 ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
 ['xl/styles.xml',styles],['xl/worksheets/sheet1.xml',sheet]]);
}
