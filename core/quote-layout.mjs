export const defaultQuoteLayout=()=>({spacing:16,blocks:[
{id:'logo',type:'logo',width:1,visible:true},
{id:'issuer',type:'issuer',width:1,visible:true},
{id:'reference',type:'reference',width:2,visible:true},
{id:'client',type:'client',width:1,visible:true},
{id:'title',type:'title',width:1,visible:true},
{id:'lines',type:'lines',width:2,visible:true},
{id:'payment',type:'payment',width:1,visible:true},
{id:'totals',type:'totals',width:1,visible:true},
{id:'bank',type:'bank',width:1,visible:true},
{id:'notes',type:'notes',width:1,visible:true}
]});
export function normalizeQuoteLayout(value){if(!value||!Array.isArray(value.blocks))return defaultQuoteLayout();return {spacing:[8,16,26].includes(Number(value.spacing))?Number(value.spacing):16,blocks:value.blocks.map((b,i)=>({id:String(b.id||'block-'+i),type:String(b.type||'custom'),width:Number(b.width)===1?1:2,visible:b.visible!==false,text:String(b.text||'')}))};}
export function moveQuoteBlock(blocks,from,to){const a=[...blocks];if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=a.length||to<0||to>=a.length||from===to)return a;a.splice(to,0,a.splice(from,1)[0]);return a;}
