// Shared contract for the future spatial editor. Undefined compatibility is not proof of compatibility.
const n=x=>Number(x)||0;
export function headsetMatches(a,b){const normal=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/entreprise/g,'enterprise').replace(/-?\s*casque\s*vr/g,'').replace(/[^a-z0-9]+/g,' ').trim();const x=normal(a),y=normal(b);return !x||!y||x===y||x.startsWith(y+' ')||y.startsWith(x+' ');}
export function setupExperienceFit(x,setup){
 const reasons=[];if(x.mode&&setup.mode&&x.mode!==setup.mode)reasons.push('Mode VR incompatible');
 const hs=Array.isArray(x.compatibleHeadsets)?x.compatibleHeadsets:[];
 if(setup.headsetModel&&hs.length&&!hs.some(h=>headsetMatches(h,setup.headsetModel)))reasons.push('Casque non référencé comme compatible');
 const w=n(x.playWidthM),d=n(x.playDepthM),sw=n(setup.playWidthM),sd=n(setup.playDepthM);
 if(w&&d&&sw&&sd&&!(w<=sw&&d<=sd||w<=sd&&d<=sw))reasons.push('Dimensions insuffisantes');
 const unknown=!reasons.length&&((!w||!d||!sw||!sd)||(!!setup.headsetModel&&!hs.length));
 return {compatible:reasons.length===0,verified:reasons.length===0&&!unknown,reasons,unknown};
}
export function installationRequirement(setup){const total=Math.max(0,Math.floor(n(setup.headsets)))*Math.max(1,Math.floor(n(setup.count||1))),installed=Math.min(total,Math.max(0,Math.floor(n(setup.installedHeadsets||0))));return {total,installed,toInstall:total-installed};}
