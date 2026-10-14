import test from 'node:test';import assert from 'node:assert/strict';
import {planNames,manifest} from '../src/plan.mjs';
test('literal global replacement keeps final extension',()=>{const r=planNames('a+a.JPG',{find:'a',replace:'b',prefix:'x-',suffix:'-done',caseMode:'upper'});assert.equal(r.rows[0].proposed,'x-B+B-done.JPG');});
test('numbering follows input order and handles zero',()=>assert.deepEqual(planNames('b.jpg\na.jpg',{number:true,start:0,padding:2}).rows.map(r=>r.proposed),['b_00.jpg','a_01.jpg']));
test('duplicate targets mark every row',()=>{const r=planNames('a (copy).txt\na.txt',{find:' (copy)'});assert.equal(r.stats.blocked,2);assert.throws(()=>manifest(r));});
test('occupied targets blocked and overlapping input lists rejected',()=>{assert.equal(planNames('a.txt',{prefix:'x-',occupied:'X-a.TXT'}).ready,false);assert.throws(()=>planNames('a.txt',{occupied:'A.TXT'}));});
test('case-only changes flagged without inventing collision',()=>{const r=planNames('Photo.JPG',{caseMode:'lower'});assert.equal(r.ready,true);assert.ok(r.rows[0].warnings.length);});
test('invalid target and malformed options fail',()=>{assert.equal(planNames('a.txt',{prefix:'?'}).ready,false);for(const o of [{padding:0},{start:-1},{caseMode:'other'}])assert.throws(()=>planNames('a.txt',o));});
test('export retains warnings and names, unchanged rows remain auditable',()=>{const r=planNames('a.txt');const json=JSON.parse(manifest(r));assert.equal(json.rows[0].changed,false);assert.equal(json.rows[0].original,'a.txt');});
test('target matching another source is retained as an execution warning',()=>{
 const p=planNames('file.txt\nfile-final.txt',{suffix:'-final'});
 assert.equal(p.ready,true);assert.match(p.rows[0].warnings.join(' '),/temporary names/);
 const exported=JSON.parse(manifest(p));assert.equal(exported.rows[0].proposed,'file-final.txt');assert.ok(exported.rows[0].warnings.length);
});
