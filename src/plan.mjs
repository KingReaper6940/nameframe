import {parseNames,splitName,validateName,nameKey} from './names.mjs';
export function planNames(text,{find='',replace='',prefix='',suffix='',caseMode='keep',number=false,start=1,padding=3,occupied=''}={}){
 for(const v of [find,replace,prefix,suffix])if(typeof v!=='string'||v.length>200)throw Error('Rule text must be at most 200 characters.');
 if(!['keep','lower','upper'].includes(caseMode))throw Error('Unknown case mode.');
 if(!Number.isSafeInteger(start)||start<0||start>999999)throw Error('Sequence start must be 0–999999.');
 if(!Number.isInteger(padding)||padding<1||padding>6)throw Error('Padding must be 1–6.');
 const source=parseNames(text),taken=parseNames(occupied,{allowEmpty:true});
 const sourceKeys=new Set(source.map(nameKey));
 if(taken.some(n=>sourceKeys.has(nameKey(n))))throw Error('Occupied names must list files outside this batch.');
 const takenKeys=new Set(taken.map(nameKey));
 const rows=source.map((original,i)=>{
 const {stem,extension}=splitName(original);
 let body=find?stem.split(find).join(replace):stem;
 if(caseMode==='lower')body=body.toLowerCase();if(caseMode==='upper')body=body.toUpperCase();
 const proposed=prefix+body+suffix+(number?'_'+String(start+i).padStart(padding,'0'):'')+extension;
 const errors=validateName(proposed);
 if(takenKeys.has(nameKey(proposed)))errors.push('Matches an occupied name outside this batch.');
 return {line:i+1,original,proposed,changed:original!==proposed,errors,warnings:[]};
 });
 const groups=new Map();
 for(const row of rows){const key=nameKey(row.proposed);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
 for(const group of groups.values())if(group.length>1)for(const row of group)row.errors.push('Same target as another row (NFC/case-insensitive).');
 for(const row of rows){
 if(row.changed&&sourceKeys.has(nameKey(row.proposed)))row.warnings.push('Target is a source name: execution needs temporary names or careful ordering.');
 if(row.changed&&nameKey(row.original)===nameKey(row.proposed))row.warnings.push('Case or normalization-only rename; filesystem-specific execution required.');
 }
 return {rows,ready:rows.every(r=>!r.errors.length),stats:{total:rows.length,changed:rows.filter(r=>r.changed).length,blocked:rows.filter(r=>r.errors.length).length,warnings:rows.filter(r=>r.warnings.length).length},comparison:'NFC plus JavaScript lowercase; conservative approximation, not filesystem emulation'};
}
export function manifest(plan){
 if(!plan.ready)throw Error('Resolve all blocked rows before exporting.');
 return JSON.stringify({format:'nameframe-plan-v1',comparison:plan.comparison,execution:'Planning only. Recheck the directory and use a safe rename implementation.',rows:plan.rows},null,2)+'\n';
}
