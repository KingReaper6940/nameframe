import test from 'node:test';import assert from 'node:assert/strict';
import {nameKey,parseNames,splitName,validateName} from '../src/names.mjs';
test('preserves spaces and rejects ambiguous sources',()=>{assert.deepEqual(parseNames(' photo.jpg\r\n\nreport.txt'),[' photo.jpg','report.txt']);assert.throws(()=>parseNames('Photo.jpg\nphoto.jpg'));assert.throws(()=>parseNames('é.txt\ne\u0301.txt'));});
test('no paths or special path components',()=>{for(const n of ['../a','C:\\x','..','.'])assert.throws(()=>parseNames(n));});
test('dotfiles and compound extensions',()=>{assert.deepEqual(splitName('.env'),{stem:'.env',extension:''});assert.deepEqual(splitName('archive.tar.gz'),{stem:'archive.tar',extension:'.gz'});});
test('Windows devices including extended digit forms',()=>{for(const n of ['NUL.txt','COM¹.png','LPT9','aux.tar.gz'])assert.ok(validateName(n).length);assert.deepEqual(validateName('console.txt'),[]);});
test('invalid characters, endings and byte limits',()=>{for(const n of ['a:b.txt','x.','x ','a'.repeat(256),'界'.repeat(86)])assert.ok(validateName(n).length);assert.deepEqual(validateName('Résumé.txt'),[]);});
test('bounds and empty list options',()=>{assert.throws(()=>parseNames('x'.repeat(65537)));assert.throws(()=>parseNames(Array.from({length:501},(_,i)=>'f'+i).join('\n')));assert.deepEqual(parseNames('',{allowEmpty:true}),[]);assert.equal(nameKey('A'),'a');});
