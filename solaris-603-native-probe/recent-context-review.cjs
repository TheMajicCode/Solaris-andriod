const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');const crypto=require('node:crypto');
const p='../solaris-603-work/Solaris-Android-R3/src/recent-context.js';const source=fs.readFileSync(p,'utf8');const ctx={};vm.createContext(ctx);vm.runInContext(source,ctx);
function task(){return {sourceRefs:[],allowedActionIds:[],prompt:'You are LUCA AI. Reply in en briefly.\n'+JSON.stringify({user:'What nickname did I tell you?',facts:[],allowed:[]})+' /no_think',manifest:{}};}
function pair(prefix,txt){return [{id:prefix+'u',role:'user',text:txt,sources:[]},{id:prefix+'a',role:'assistant',text:'Your name is Cedar.',mode:'qvac-device',sources:[],provenance:{authorityEpoch:3,permissionRevision:4,sourceRefs:[]}}];}
function state(){return {subjectId:'subject',authorityEpoch:3,experience:{localContext:{revision:4}},conversation:pair('old','My name is old.')}}
const results=[];function check(name,fn){fn();results.push({name,pass:true})}
const owner={session:'session1'},s=state();
check('established history not included at first session observation',()=>assert.ok(!ctx.recentContext(task(),owner,s).prompt.includes('recent')));
s.conversation.push(...pair('new','My name is Cedar.'));
let expected;
check('new source-free pair eligible',()=>{const r=ctx.recentContext(task(),owner,s);assert.ok(r.prompt.includes('recent'));assert.ok(r.prompt.includes('My name is Cedar.'));expected=r.prompt;});
check('repeat preflight does not consume pair',()=>assert.equal(ctx.recentContext(task(),owner,s).prompt,expected));
check('selected source task cannot include prior text',()=>{const t=task();t.sourceRefs=['s1'];assert.ok(!ctx.recentContext(t,owner,s).prompt.includes('recent'));});
check('permission revision reset blocks existing history',()=>{const d=JSON.parse(JSON.stringify(s));d.experience.localContext.revision++;assert.ok(!ctx.recentContext(task(),owner,d).prompt.includes('recent'));});
check('session transition resets cursor',()=>{const o={session:'session2',__solaris603Context:owner.__solaris603Context};assert.ok(!ctx.recentContext(task(),o,s).prompt.includes('recent'));});
check('record-bearing pair excluded',()=>{const o={session:'s'},d=state();ctx.recentContext(task(),o,d);d.conversation.push(...pair('new','My name is Cedar.'));d.conversation.at(-1).sources=['s1'];assert.ok(!ctx.recentContext(task(),o,d).prompt.includes('recent'));});
check('non-generated guided assistant excluded',()=>{const o={session:'s'},d=state();ctx.recentContext(task(),o,d);d.conversation.push(...pair('new','My name is Cedar.'));d.conversation.at(-1).mode='guided';assert.ok(!ctx.recentContext(task(),o,d).prompt.includes('recent'));});
check('oversize history excluded without text mutation',()=>{const o={session:'s'},d=state();ctx.recentContext(task(),o,d);d.conversation.push(...pair('new','x'.repeat(400)));const before=JSON.stringify(d);assert.ok(!ctx.recentContext(task(),o,d).prompt.includes('recent'));assert.equal(JSON.stringify(d),before);});
check('provenance revision mismatch excluded',()=>{const o={session:'s'},d=state();ctx.recentContext(task(),o,d);d.conversation.push(...pair('new','My name is Cedar.'));d.conversation.at(-1).provenance.permissionRevision--;assert.ok(!ctx.recentContext(task(),o,d).prompt.includes('recent'));});
fs.writeFileSync('recent-context-review-results.json',JSON.stringify({helperSHA256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Independent JavaScript helper review only; must additionally verify real owner.session changes on lock/unlock',results},null,2));console.log(JSON.stringify(results));
