import {detailDisclosure} from './quote-details.mjs';
// Export XLSX based on the historic Backlight workbook. No external packages.
// Preserve its original fonts, merged areas, logo, borders, footer and page setup.
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {totals} from './quotes.mjs';
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/devis-backlight-template.xlsx');
const escapeXml=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const euros=n=>Math.round((Number(n)||0)*100)/100;
function crc32(b){let c=0xffffffff;for(const x of b){c^=x;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;}return (c^0xffffffff)>>>0;}
// XLSX is a ZIP archive; unzip and repackage while preserving all non-edited parts, including the Backlight artwork.
function unzip(input){const entries=[];let offset=0;while(offset+4<input.length){if(input.readUInt32LE(offset)!==0x04034b50)break;const method=input.readUInt16LE(offset+8),compressed=input.readUInt32LE(offset+18),nameLength=input.readUInt16LE(offset+26),extraLength=input.readUInt16LE(offset+28);const name=input.subarray(offset+30,offset+30+nameLength).toString('utf8'),start=offset+30+nameLength+extraLength;const data=input.subarray(start,start+compressed);entries.push([name,method===8?zlib.inflateRawSync(data):Buffer.from(data)]);offset=start+compressed;}if(!entries.length)throw Error('Modèle de devis XLSX invalide');return entries;}
function zip(entries){const parts=[],central=[];let offset=0;for(const [name,contents] of entries){const nameBuf=Buffer.from(name),raw=Buffer.isBuffer(contents)?contents:Buffer.from(contents),packed=zlib.deflateRawSync(raw),crc=crc32(raw),head=Buffer.alloc(30);head.writeUInt32LE(0x04034b50,0);head.writeUInt16LE(20,4);head.writeUInt16LE(8,8);head.writeUInt32LE(crc,14);head.writeUInt32LE(packed.length,18);head.writeUInt32LE(raw.length,22);head.writeUInt16LE(nameBuf.length,26);parts.push(head,nameBuf,packed);const ctr=Buffer.alloc(46);ctr.writeUInt32LE(0x02014b50,0);ctr.writeUInt16LE(20,4);ctr.writeUInt16LE(20,6);ctr.writeUInt16LE(8,10);ctr.writeUInt32LE(crc,16);ctr.writeUInt32LE(packed.length,20);ctr.writeUInt32LE(raw.length,24);ctr.writeUInt16LE(nameBuf.length,28);ctr.writeUInt32LE(offset,42);central.push(ctr,nameBuf);offset+=head.length+nameBuf.length+packed.length;}const size=central.reduce((s,b)=>s+b.length,0),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(size,12);end.writeUInt32LE(offset,16);return Buffer.concat([...parts,...central,end]);}
function replaceCell(row,col,num,{style,text,value,formula}){const reference=`${col}${num}`,pattern=new RegExp(`<c\\b[^>]*\\br="${reference}"[^>]*(?:\\/>|>[^]*?<\\/c>)`);const old=pattern.exec(row)?.[0]||'';const s=style??/\bs="(\d+)"/.exec(old)?.[1]??'0';let cell=`<c r="${reference}" s="${s}"`;
 if(formula!=null)cell+=`><f>${escapeXml(formula)}</f><v>${euros(value)}</v></c>`;
 else if(value!=null)cell+=`><v>${euros(value)}</v></c>`;
 else cell+=` t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
 return old?row.replace(old,cell):row.replace('</row>',cell+'</row>');}
function parseRow(row,i){return row.replace(/(<row\b[^>]*\br=")\d+(?=")/,'$1'+i).replace(/(<c\b[^>]*\br="[A-Z]+)\d+(?=")/g,'$1'+i);}
function dateNumber(dateString){const ms=Date.parse(dateString+'T00:00:00Z');return Number.isFinite(ms)?Math.floor(ms/86400000)+25569:null;}
function modifySheet(xml,q){const t=totals(q);const lines=t.lines.flatMap(x=>{const d=detailDisclosure(x);return [x,...d.children.map(c=>({category:'',description:'    ↳ '+c.description+(c.unitLabel?' ('+c.unitLabel+')':''),quantity:c.quantity,unit:c.showPrice?c.unit:null,lineTotal:c.showPrice?Math.round(c.quantity*c.unit*100)/100:null}))];});if(lines.length>85)throw new Error('Devis trop long pour le modèle A4 : 85 lignes maximum. Utilisez le PDF multipage.');
 // The original template reserves rows 19..25 for items; grow this area, preserving the original end sections.
 const shift=Math.max(0,lines.length-7);const start=19;let original=xml;
 let rows=[...original.matchAll(/<row\b[^>]*\br="(\d+)"[^>]*>[^]*?<\/row>/g)].map(m=>({n:+m[1],text:m[0]}));const prototype=rows.find(x=>x.n===19).text;
 const values=(row,col,n,v,opts={})=>replaceCell(row,col,n,{...opts,...(typeof v==='number'?{value:v}:{text:v})});
 rows=rows.filter(x=>x.n<19||x.n>25).map(x=>x.n>=26?{...x,n:x.n+shift,text:parseRow(x.text,x.n+shift)}:x);
 const update=(n,col,val,opts={})=>{const x=rows.find(y=>y.n===n);if(!x)return;x.text=values(x.text,col,n,val,opts)};
 update(2,'C',q.company?.name||'BACKLIGHT STUDIO');update(3,'C',(q.company?.address||'Coordonnées à confirmer').split(/\n/)[0]);update(4,'C',(q.company?.address||'').split(/\n/).slice(1).join(' · '));update(5,'C',q.company?.email||'');update(6,'C','www.backlight.fr');
 update(2,'H',q.company?.contact||'À définir');update(3,'H',q.company?.email||'');update(4,'H','');update(5,'H','');
 update(9,'A','DEVIS N°');update(9,'B',q.number||'DEVIS');update(9,'G',dateNumber(q.date)||dateNumber(new Date().toISOString().slice(0,10)),{style:69});update(9,'I',dateNumber(q.validUntil)||dateNumber(q.date)||dateNumber(new Date().toISOString().slice(0,10)),{style:4});
 update(11,'B',q.client||'À compléter');update(12,'B',q.projectName||'');update(13,'B',q.clientAddress||'');update(14,'B',q.clientContact||'');
 update(11,'G',q.company?.vat||'');update(12,'G',q.clientContact||'');update(13,'G','');update(14,'G','');
 update(16,'B',q.title||q.projectName||'');
 // Row 18 remains the original grey multi-column table header.
 update(18,'A','Secteur');update(18,'B','Prestation / Désignation');update(18,'F','Qté');update(18,'G','Unité');update(18,'H','PU HT');update(18,'I','Total HT');
 const itemRows=lines.map((line,j)=>{const rownum=start+j;let row=parseRow(prototype,rownum).replace(/\bht="[^"]*"/,'ht="15"');row=values(row,'A',rownum,line.category||'Autres');row=values(row,'B',rownum,line.description||'');row=values(row,'F',rownum,+line.quantity||0,{style:88});row=values(row,'G',rownum,'');row=values(row,'H',rownum,line.unit==null?'':euros(line.unit),{style:71});row=values(row,'I',rownum,line.lineTotal==null?'':euros(line.lineTotal),{style:72});return {n:rownum,text:row}});
 const b=26+shift;
 update(b,'A','CONDITIONS DE RÈGLEMENT');update(b+1,'A',q.conditions||'À définir');
 update(b+2,'F','SOUS-TOTAL HT');update(b+2,'I',t.subtotal,{style:70});
 update(b+4,'F','REMISE');update(b+4,'H',+q.discount||0,{style:63});update(b+4,'I',t.discount,{style:71});
 update(b+6,'F','TOTAL H.T.');update(b+6,'I',t.totalHT,{style:72});
 update(b+7,'F','VALEUR T.V.A.');update(b+7,'H',(+q.vat||0)/100,{style:63});update(b+7,'I',t.vat,{style:71});
 update(b+8,'F','TOTAL T.T.C.');update(b+8,'I',t.totalTTC,{style:72});
 update(b+6,'A','COORDONNÉES BANCAIRES');update(b+7,'A',q.company?.bank||'À compléter');
 update(b+9,'A',q.notes||'Prix et disponibilités à confirmer avant acceptation.');update(b+10,'A','');
 rows=[...rows,...itemRows].sort((a,b)=>a.n-b.n);const head=xml.slice(0,xml.indexOf('<sheetData>')+11),end=xml.slice(xml.indexOf('</sheetData>'));
 let output=head+rows.map(x=>x.text).join('')+end;
 // Remove old placeholder-table merges, which otherwise collide with generated item lines.
 output=output.replace(/<mergeCell\s+ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"\s*\/>/g,(full,c1,r1,c2,r2)=>{
   const first=+r1,last=+r2;
   return first<=25&&last>=19?'':full;
 });
 // Merge designation across B:E for readable full labels (and maintain the historic column arrangement).
 const lineMerges=lines.map((_,i)=>`<mergeCell ref="B${19+i}:E${19+i}"/>`).join('');
 output=output.replace(/<\/mergeCells>/,lineMerges+'</mergeCells>');
 output=output.replace(/<mergeCells count="\d+"/, m=>m.replace(/count="\d+"/, `count="${(output.match(/<mergeCell\s+ref=/g)||[]).length}"`));
 // All footer merges should follow the inserted rows. Keep the original merged cells exactly.
 output=output.replace(/<mergeCell\s+ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"\s*\/>/g,(full,c1,r1,c2,r2)=>{let a=+r1,b=+r2;if(a>=26)a+=shift;if(b>=26)b+=shift;return `<mergeCell ref="${c1}${a}:${c2}${b}"/>`;});
 output=output.replace(/<dimension\s+ref="[^"]+"\s*\/>/,`<dimension ref="A1:U${38+shift}"/>`);
 // Keep original logo drawing and fit-to-page settings; print scaling must be one page wide and one page tall.
 output=output.replace(/<pageSetup\b[^>]*\/>/,tag=>tag.replace(/\bfitToHeight="[^"]*"/,'').replace(/\bfitToWidth="[^"]*"/,'').replace('/>',' fitToWidth="1" fitToHeight="1"/>'));
 output=output.replace(/<sheetPr([^>]*)>/, (v)=>v.includes('<sheetPr')?v:v);
 return output;
}
export function templateQuoteXlsx(q){
 if(!q||!Array.isArray(q.rows))throw Error('Devis invalide');
 const data=fs.readFileSync(source),entries=unzip(data);let found=false;
 const shifted=38+Math.max(0,totals(q).lines.length-7);
 const translated=entries.filter(([name])=>name!=='xl/calcChain.xml').map(([name,bytes])=>{
  if(name==='xl/worksheets/sheet1.xml'){
   found=true;bytes=Buffer.from(modifySheet(bytes.toString('utf8'),q));
  }else if(name==='xl/workbook.xml'){
   let x=bytes.toString('utf8');
   x=x.replace(/(<definedName\s+name="_xlnm.Print_Area"[^>]*>)[^<]*(<\/definedName>)/,(_,start,end)=>start+'Devis!$A$1:$I$'+shifted+end);
   bytes=Buffer.from(x);
  }else if(name==='[Content_Types].xml'){
   bytes=Buffer.from(bytes.toString('utf8').replace(/<Override\s+PartName="\/xl\/calcChain.xml"[^>]*\/>/g,''));
  }else if(name==='xl/_rels/workbook.xml.rels'){
   bytes=Buffer.from(bytes.toString('utf8').replace(/<Relationship\s+[^>]*Target="calcChain.xml"[^>]*\/>/g,''));
  }
  return [name,bytes];
 });
 if(!found)throw Error('Onglet Devis introuvable');
 return zip(translated);
}
