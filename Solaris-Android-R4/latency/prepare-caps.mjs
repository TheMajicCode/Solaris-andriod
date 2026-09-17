import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {completionClientParamsSchema} from '../../../solaris-603-native-probe/reference-worker/node_modules/@qvac/sdk/dist/schemas/completion-stream.js';
import {getResponseFormatJsonSchema} from '../../../solaris-603-native-probe/reference-worker/node_modules/@qvac/sdk/dist/server/utils/response-format.js';
const baseSource=fs.readFileSync('../../Solaris-Android-R3/src/conversation-request.js','utf8');
const source=baseSource.replace('facts.length ? 700 : 500','facts.length ? 400 : 320').replace('facts.length ? 256 : 128','facts.length ? 160 : 96');
fs.writeFileSync('conversation-request-caps.js',source);
const sandbox={};vm.createContext(sandbox);vm.runInContext(source,sandbox);
const results=[];
const baseFixtures=JSON.parse(fs.readFileSync('helper-validation.json','utf8')).results.filter(x=>x.variant==='base603');
for(const b of baseFixtures){
 // Need original compiler envelope to exercise real helper, not its transformed request.
 const fixture=JSON.parse(fs.readFileSync('fixtures/base603-'+b.name+'.json','utf8'));
 const r=b.request;
 let envelope,prompt;
 if(r.history.length===1){prompt=r.history[0].content;}
 else {envelope={user:r.history[r.history.length-1].content,facts:[],allowed:[]};if(r.history.length===4)envelope.recent=r.history.slice(1,3);prompt='You are LUCA AI. Reply in '+(b.name==='hola'?'es':'en')+' warmly, briefly.\n'+JSON.stringify(envelope)+' /no_think';}
 const request={modelId:'probe',history:[{role:'user',content:prompt}],stream:true,captureThinking:false,kvCache:false,responseFormat:{type:'json_object'}};
 const transformed=sandbox.conversationRequest(request,true);
 const parsed=completionClientParamsSchema.safeParse(transformed);results.push({name:b.name,valid:parsed.success,request:transformed});
 if(parsed.success)fs.writeFileSync('fixtures/caps604-'+b.name+'.json',JSON.stringify({mode:'caps604-'+b.name,history:parsed.data.history,generationParams:{...parsed.data.generationParams,json_schema:getResponseFormatJsonSchema(parsed.data.responseFormat)}},null,2));
}
for(const [name,user] of [['many','Give me 20 detailed ways to reflect on my day.'],['long','Write a long story about a child who learns to be kind.'],['spanish','Dame algunas ideas para reflexionar sobre un día difícil.']]){
 for(const [variant,text] of [['base603',baseSource],['caps604',source]]){
 const s={};vm.createContext(s);vm.runInContext(text,s);
 const prompt='You are LUCA AI. Reply in '+(name==='spanish'?'es':'en')+' warmly, briefly.\n'+JSON.stringify({user,facts:[],allowed:[]})+' /no_think';
 const transformed=s.conversationRequest({modelId:'probe',history:[{role:'user',content:prompt}],stream:true,captureThinking:false,kvCache:false,responseFormat:{type:'json_object'}},true);
 const parsed=completionClientParamsSchema.safeParse(transformed);results.push({variant,name,valid:parsed.success,request:transformed});
 if(parsed.success)fs.writeFileSync('fixtures/'+variant+'-'+name+'.json',JSON.stringify({mode:variant+'-'+name,history:parsed.data.history,generationParams:{...parsed.data.generationParams,json_schema:getResponseFormatJsonSchema(parsed.data.responseFormat)}},null,2));
 }}
fs.writeFileSync('caps-validation.json',JSON.stringify({helperSHA256:crypto.createHash('sha256').update(source).digest('hex'),results},null,2)+'\n');
console.log(JSON.stringify({requests:results.length,invalid:results.filter(x=>!x.valid).length}));
