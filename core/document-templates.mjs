import {defaultQuoteLayout,normalizeQuoteLayout} from './quote-layout.mjs';
export function defaultDocumentTemplates(){return [{id:'backlight-standard',name:'Backlight — Devis classique',system:true,layout:defaultQuoteLayout(),table:{columns:['description','quantity','unit','total'],detailDefault:'summary'}}];}
export function normalizeDocumentTemplates(list){const output=defaultDocumentTemplates();for(const x of Array.isArray(list)?list:[]){if(x.id==='backlight-standard')continue;output.push({id:String(x.id),name:String(x.name||'Sans titre'),system:false,layout:normalizeQuoteLayout(x.layout),table:{columns:Array.isArray(x.table?.columns)?x.table.columns:['description','quantity','unit','total'],detailDefault:x.table?.detailDefault||'summary'}});}return output;}
export function snapshotTemplate(quote,name,id){return {id,name,system:false,layout:structuredClone(normalizeQuoteLayout(quote.layout)),table:structuredClone(quote.table||{columns:['description','quantity','unit','total'],detailDefault:'summary'})};}
export function applyTemplate(quote,template){return {...quote,layout:structuredClone(normalizeQuoteLayout(template.layout)),table:structuredClone(template.table||{columns:['description','quantity','unit','total']})};}
export function tableColumns(value){
 const known=['description','quantity','unit','total'];
 const v=Array.isArray(value)?value.filter((x,i)=>known.includes(x)&&value.indexOf(x)===i):known;
 return ['description',...v.filter(x=>x!=='description'&&x!=='total'),'total'];
}
export function displayedTableColumns(table={}){
 // Existing quotes still store the legacy four-choice variant.
 if(Array.isArray(table.columns))return tableColumns(table.columns);
 const variants={simple:['description','total'],no_unit:['description','quantity','total'],reverse:['description','unit','quantity','total']};
 return tableColumns(variants[table.variant]||['description','quantity','unit','total']);
}
export function updateTableColumns(columns,kind,visible){
 const current=tableColumns(columns);if(!['quantity','unit'].includes(kind))return current;
 return tableColumns(visible?[...current.slice(0,-1),kind,'total']:current.filter(x=>x!==kind));
}
export function moveTableColumn(columns,from,to){
 const order=tableColumns(columns);if(!['quantity','unit'].includes(from)||!['quantity','unit'].includes(to))return order;
 if(!order.includes(from)||!order.includes(to)||from===to)return order;
 const i=order.indexOf(from),j=order.indexOf(to);order.splice(j,0,order.splice(i,1)[0]);return tableColumns(order);
}

