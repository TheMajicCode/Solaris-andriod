import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createCompletionNormalizer} from './reference-worker/node_modules/@qvac/sdk/dist/server/utils/completion-normalizer.js';
import {getResponseFormatJsonSchema} from './reference-worker/node_modules/@qvac/sdk/dist/server/utils/response-format.js';
import {completionClientParamsSchema} from './reference-worker/node_modules/@qvac/sdk/dist/schemas/completion-stream.js';
import {transformLlmConfig} from './reference-worker/node_modules/@qvac/sdk/dist/server/bare/plugins/llamacpp-completion/transform.js';
const checks=[];
function check(name,fn){fn();checks.push({name,pass:true});}
check('json_object constrains generic object only',()=>assert.deepEqual(JSON.parse(getResponseFormatJsonSchema({type:'json_object'})),{type:'object'}));
check('text has no grammar constraint',()=>assert.equal(getResponseFormatJsonSchema({type:'text'}),undefined));
check('load config reasoning budget converts to string0',()=>assert.equal(transformLlmConfig({reasoning_budget:0}).reasoning_budget,'0'));
for(const captureThinking of [false,true]){
 const n=createCompletionNormalizer({tools:[],capabilities:{toolCalling:'none',thinkingFraming:captureThinking?'thinkTags':'none'},captureThinking,emitRawDeltas:false,toolDialect:'hermes'});
 let events=[];for(const text of ['<th','ink>hidden','</think>','Hello'])events.push(...n.push(text));events.push(...n.finish());
 check('captureThinking '+captureThinking+' controls framing, not native generation',()=>{
  const content=events.filter(x=>x.type==='contentDelta').map(x=>x.text).join('');
  assert.equal(content,captureThinking?'Hello':'<think>hidden</think>Hello');
 });
 check('normal completion has completionDone even without stopReason',()=>assert.equal(events.at(-1).type,'completionDone'));
 check('ordinary EOS may lack explicit stopReason',()=>assert.equal(events.at(-1).stopReason,undefined));
}
check('explicit per request reasoning0 and json_schema accepted by exact SDK',()=>{
 const r=completionClientParamsSchema.parse({modelId:'probe',history:[{role:'user',content:'Hello'}],stream:true,captureThinking:true,kvCache:false,generationParams:{reasoning_budget:0,predict:128,temp:0.3},responseFormat:{type:'json_schema',json_schema:{name:'solaris_answer',schema:{type:'object',properties:{message:{type:'string'},sourceRefs:{type:'array',items:{type:'string'},maxItems:0}},required:['message','sourceRefs'],additionalProperties:false}}}});
 assert.equal(r.generationParams.reasoning_budget,0);
});
fs.writeFileSync('sdk-source-probe-results.json',JSON.stringify({checks,scope:'Executes exact recovered SDK JavaScript only; no RPC transport or Android'},null,2)+'\n');
console.log(JSON.stringify(checks));
