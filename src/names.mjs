export const nameKey=name=>name.normalize('NFC').toLowerCase();
export function parseNames(text,{allowEmpty=false}={}){
 if(new TextEncoder().encode(text).length>65536)throw Error('Keep each list under 64 KiB.');
 const names=text.split(/\r?\n/).filter(x=>x.trim()!=='');
 if(names.length>500)throw Error('Use at most 500 names per list.');
 if(!allowEmpty&&!names.length)throw Error('Paste at least one filename.');
 for(const n of names)if(/[\/\\\u0000]/.test(n)||n==='.'||n==='..')throw Error('Use filenames only, without folders, paths or NUL characters.');
 const keys=new Set();
 for(const n of names){const key=nameKey(n);if(keys.has(key))throw Error('Duplicate source name under NFC/case-insensitive comparison: '+n);keys.add(key);}
 return names;
}
export function splitName(name){
 const at=name.lastIndexOf('.');
 return at>0?{stem:name.slice(0,at),extension:name.slice(at)}:{stem:name,extension:''};
}
export function validateName(name){
 const problems=[];
 if(!name||name==='.'||name==='..')problems.push('Empty or special name.');
 if(/[<>:"\/\\|?*\u0000-\u001f\u007f]/.test(name))problems.push('Contains reserved characters or controls.');
 if(/[. ]$/.test(name))problems.push('Ends with a dot or space.');
 if(/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(name))problems.push('Reserved Windows device name.');
 if(name.length>255||new TextEncoder().encode(name).length>255)problems.push('Exceeds conservative 255-unit/byte component limit.');
 return problems;
}
