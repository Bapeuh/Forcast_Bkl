// L01 document grid. Historical 2-column layouts remain valid until explicitly upgraded.
export const defaultQuoteLayout=()=>({version:2,columns:6,spacing:16,pagination:'auto',blocks:[
{id:'logo',type:'logo',width:2,visible:true},
{id:'issuer',type:'issuer',width:4,visible:true},
{id:'reference',type:'reference',width:3,visible:true},
{id:'client',type:'client',width:3,visible:true},
{id:'title',type:'title',width:6,visible:true},
{id:'lines',type:'lines',width:6,visible:true},
{id:'payment',type:'payment',width:4,visible:true},
{id:'totals',type:'totals',width:2,visible:true},
{id:'bank',type:'bank',width:3,visible:true},
{id:'notes',type:'notes',width:3,visible:true}
]});
const clamp=(n,lo,hi,fallback)=>Number.isFinite(Number(n))?Math.max(lo,Math.min(hi,Math.round(Number(n)))):fallback;
export function normalizeQuoteLayout(value){if(!value||!Array.isArray(value.blocks))return defaultQuoteLayout();
 const columns=Number(value.columns)===6?6:2;
 return {version:columns===6?2:1,columns,pagination:['auto','compact','single'].includes(value.pagination)?value.pagination:'auto',spacing:[8,16,26].includes(Number(value.spacing))?Number(value.spacing):16,blocks:value.blocks.map((b,i)=>({id:String(b.id||'block-'+i),type:String(b.type||'custom'),width:clamp(b.width,1,columns,columns),visible:b.visible!==false,text:String(b.text||''),minHeight:clamp(b.minHeight||0,0,600,0),padding:clamp(b.padding??7,0,30,7),align:['left','center','right'].includes(b.align)?b.align:'left'}))};}
export function upgradeQuoteLayout(value){const layout=normalizeQuoteLayout(value);if(layout.columns===6)return layout;return {...layout,version:2,columns:6,blocks:layout.blocks.map(x=>({...x,width:x.width===1?3:6}))};}
export function moveQuoteBlock(blocks,from,to){const a=[...blocks];if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=a.length||to<0||to>=a.length||from===to)return a;a.splice(to,0,a.splice(from,1)[0]);return a;}
