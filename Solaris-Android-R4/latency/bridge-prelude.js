// Test-only lexical inputs for the unchanged candidate bridge function.
globalThis.test={module:[],entries:[],options:{},counts:{},replies:[]};
(function(t){
 t.module[12]={parseVaultBridge:function(raw){if(t.options.parseReject)throw Error('PARSE_REJECTED');return JSON.parse(raw);}};
 t.module[18]={isAppUrl:function(url){return url==='file:///synthetic-solaris.html';}};
 t.module[19]={safeError:function(e){return {code:'OPERATION_FAILED',stage:'synthetic-test'};}};
 t.entries[1]={trace:{add:function(){t.counts.trace++;}},snapshot:function(){t.counts.snapshot++;return {loaded:!!t.options.loaded};},prepareForUse:function(){t.counts.prepare++;if(t.options.afterPrepare)t.options.afterPrepare();return t.options.prepareReject?Promise.reject(Error(t.options.prepareReject)):Promise.resolve();}};
 t.entries[2]={assertConversationAccess:function(message,sourceIds,useAI){t.counts.preflight++;t.preflight={message:message,sourceIds:sourceIds,useAI:useAI};if(t.options.reject)throw Error(t.options.reject);if(t.options.afterPreflight)t.options.afterPreflight();return t.options.guided?{message:'synthetic guided marker',sourceRefs:[],kind:'welcome'}:undefined;},converse:function(message,sourceIds,useAI,operationId){t.counts.converse++;t.converse={message:message,sourceIds:sourceIds,useAI:useAI,operationId:operationId};if(t.options.afterConverse)t.options.afterConverse();return Promise.resolve({synthetic:true});}};
 t.entries[11]={current:true};t.entries[12]={current:0};t.entries[14]=function(){t.counts.eligible++;return !t.options.ineligible;};t.entries[15]={view:function(){return {state:t.options.voiceState||'idle'};}};
 t.entries[20]=function(js){t.replies.push(JSON.parse(js.slice('window.__solarisVaultReply?.('.length,-1)));};
 t.entries[27]={current:0};
})(globalThis.test);
