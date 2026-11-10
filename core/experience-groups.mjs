// Bibliothèque multi-variantes : une expérience éditoriale, plusieurs configurations techniques.
// Conserve les identifiants de variantes historiques et leurs références dans les projets.
const clone=x=>structuredClone(x);
const normalizedName=x=>(x.sourceTitle||x.name||'').trim().replace(/\s+[—–-]\s*(?:\d+\s*m²|\d+\s*[×x]\s*\d+\s*m)$/i,'').trim();
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function upgradeExperienceGroups(state){
 if(!Array.isArray(state.experienceLibrary))state.experienceLibrary=[];
 if(!Array.isArray(state.experienceGroups))state.experienceGroups=[];
 const groups=state.experienceGroups;
 const byTitle=new Map(groups.map(g=>[slug(g.title),g]));
 for(const ref of state.experienceLibrary){
  if(!ref||!ref.id)continue;
  const title=normalizedName(ref)||'Sans nom',key=slug(title);
  let group=byTitle.get(key);
  if(!group){group={id:'xp-group-'+key,title,description:'',poster:'',variants:[]};groups.push(group);byTitle.set(key,group)}
  if(!group.variants.some(v=>v.id===ref.id)){
   const variant=clone(ref);variant.id=ref.id;variant.libraryId=ref.libraryId||ref.id;
   variant.label=ref.version||'Format standard';
   group.variants.push(variant);
  }
 }
 // Corrige uniquement la collision d'identifiant constatée dans les données historiques.
 const birdy=state.experienceLibrary.find(x=>x.name==='Birdy King Land');
 if(birdy)for(const p of state.projects||[])for(const xp of p.experiences||[]){
  if(xp.name==='Birdy Kingland'&&xp.libraryId==='oz-far-reach-1-si-ge'){
   xp.libraryId=birdy.id;xp.sourceKey=birdy.sourceKey;xp.sourceTitle=birdy.sourceTitle;
   // Ne pas remplacer les caractéristiques éditées dans le projet.
  }
 }
 return groups;
}
export function variantForProject(group,variant,id){
 const x=clone(variant);delete x.label;delete x.poster;
 x.id=id;x.libraryId=variant.libraryId||variant.id;x.experienceGroupId=group.id;x.variantId=variant.id;
 x.name=group.title; x.version=variant.label||variant.version||'Format standard';
 return x;
}
export function syncLegacyVariant(state,variant){
 const index=state.experienceLibrary.findIndex(x=>x.id===variant.id);
 const item=clone(variant);delete item.label;delete item.poster;
 item.libraryId=item.libraryId||item.id;
 if(index>=0)state.experienceLibrary[index]=item;else state.experienceLibrary.push(item);
}
export function removeLegacyVariant(state,id){state.experienceLibrary=state.experienceLibrary.filter(x=>x.id!==id)}
