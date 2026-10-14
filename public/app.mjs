import {planNames,manifest} from './src/plan.mjs';
const el=id=>document.getElementById(id),make=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
function clear(){el('results').hidden=true;el('json').value='';el('status').textContent='';}
const inputs=['source','occupied','find','replace','prefix','suffix','caseMode','number','start','padding'];
for(const id of inputs)el(id).addEventListener('input',clear);
el('example').addEventListener('click',()=>{
 el('source').value='photo (copy).JPG\nphoto.JPG\ndraft notes.txt\narchive.tar.gz\n.env';
 for(const id of ['occupied','replace','prefix','suffix'])el(id).value='';
 el('find').value=' (copy)';el('caseMode').value='keep';el('number').checked=false;el('start').value='1';el('padding').value='3';run();
});
function run(){
 clear();
 try{
 if(!/^\d+$/.test(el('start').value))throw Error('Use a whole nonnegative sequence start.');
 const p=planNames(el('source').value,{occupied:el('occupied').value,find:el('find').value,replace:el('replace').value,prefix:el('prefix').value,suffix:el('suffix').value,caseMode:el('caseMode').value,number:el('number').checked,start:Number(el('start').value),padding:Number(el('padding').value)});
 el('results').hidden=false;el('stats').replaceChildren();
 for(const [value,label] of [[p.stats.total,'Names checked'],[p.stats.changed,'Names changed'],[p.stats.blocked,'Blocked rows'],[p.stats.warnings,'Rows with warnings']]){const d=make('div','');d.className='stat';d.append(make('b',value),make('span',label));el('stats').append(d);}
 el('summary').textContent=p.ready?'Plan checks passed. Read warnings and verify the real directory before applying.':'Export blocked. Change the rules or occupied-name list to resolve every blocked row.';
 el('rows').replaceChildren();
 for(const row of p.rows){const tr=document.createElement('tr');tr.append(make('td',row.line),make('td',row.original),make('td',row.proposed));
 const checks=make('td','');checks.className='checks';
 checks.append(make('strong',row.errors.length?'BLOCKED':row.changed?'CHANGED':'UNCHANGED'));
 for(const [items,kind] of [[row.errors,'error'],[row.warnings,'warn']])for(const text of items){const message=make('p',text);message.className=kind;checks.append(message);}
 tr.append(checks);el('rows').append(tr);}
 for(const id of ['copy','download'])el(id).disabled=!p.ready;
 el('json').value=p.ready?manifest(p):'Resolve blocked rows to generate a manifest.';
 el('status').textContent=p.ready?'Ready to export a plan. No files have been changed.':'Collision or portability issue found. No files have been changed.';
 }catch(e){el('status').textContent=e.message;}
}
el('plan').addEventListener('click',run);
el('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(el('json').value);el('status').textContent='JSON plan copied.';}catch{el('status').textContent='Clipboard unavailable. Select the JSON text or download it.';}});
el('download').addEventListener('click',()=>{const u=URL.createObjectURL(new Blob([el('json').value],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='nameframe-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
