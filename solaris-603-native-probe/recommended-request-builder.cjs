exports.buildSourceFreeRequest = function(user, recent) {
  const system = 'You are Pocket LUCA. Answer the user in 1-2 short sentences, in their language. No diagnosis, treatment, invented facts or claims of saving. JSON: {"message":"your answer","sourceRefs":[]}. /no_think';
  return {
    modelId: 'verified-local-model',
    history: [{role:'system',content:system}, ...(recent || []), {role:'user',content:user}],
    stream:true, captureThinking:true, kvCache:false,
    responseFormat:{type:'json_schema',json_schema:{name:'solaris_conversation',schema:{type:'object',properties:{message:{type:'string',minLength:1,maxLength:500},sourceRefs:{type:'array',items:{type:'string'},maxItems:0}},required:['message','sourceRefs'],additionalProperties:false}}},
    generationParams:{predict:128,temp:0.3,reasoning_budget:0,seed:42}
  };
