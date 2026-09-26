/* Executed immediately before the existing private-completion dispatch.
 * The original conversation flag is authoritative. Other private tasks retain
 * their original request. No output parser, permission or cancellation guard
 * is removed. Exact SDK0.18.2 uses responseFormat.json_schema.schema.
 */
function conversationRequest(request, isConversation) {
  if (!isConversation) return request;
  var prompt = request.history[0].content;
  var split = prompt.indexOf('\n');
  if (split < 0 || prompt.slice(-10) !== ' /no_think') throw Error('CONTEXT_INVALID');
  var envelope = JSON.parse(prompt.slice(split + 1, -10));
  if (typeof envelope.user !== 'string' || !Array.isArray(envelope.facts) || !Array.isArray(envelope.allowed)) throw Error('CONTEXT_INVALID');
  var facts = envelope.facts;
  var refs = [];
  for (var i = 0; i < facts.length; i++) refs.push(facts[i].ref);
  var schema = {};
  schema.type = 'object';
  var properties = {};
  var message = {};
  message.type = 'string';
  message.minLength = 1;
  message.maxLength = facts.length ? 700 : 500;
  properties.message = message;
  var sourceRefs = {};
  sourceRefs.type = 'array';
  var item = {};
  item.type = 'string';
  if (refs.length) item.enum = refs;
  sourceRefs.items = item;
  sourceRefs.minItems = refs.length ? 1 : 0;
  sourceRefs.maxItems = refs.length;
  properties.sourceRefs = sourceRefs;
  if (envelope.allowed.length) {
    var action = {};
    action.type = 'string';
    action.enum = envelope.allowed;
    properties.actionId = action;
  }
  schema.properties = properties;
  var required = [];
  required.push('message');
  required.push('sourceRefs');
  schema.required = required;
  schema.additionalProperties = false;
  var format = {};
  format.type = 'json_schema';
  var jsonSchema = {};
  jsonSchema.name = 'solaris_conversation';
  jsonSchema.schema = schema;
  format.json_schema = jsonSchema;
  request.responseFormat = format;
  var generation = {};
  generation.predict = facts.length ? 256 : 128;
  generation.temp = 0.3;
  generation.reasoning_budget = 0;
  generation.seed = 42;
  request.generationParams = generation;
  request.captureThinking = true;
  if (!facts.length && !envelope.allowed.length) {
    var history = [];
    var system = {};
    system.role = 'system';
    var language = prompt.indexOf('You are LUCA AI. Reply in es ') === 0 ? 'Spanish' : 'English';
    system.content = 'You are Pocket LUCA. Answer the user in 1-2 short sentences, in ' + language + '. No diagnosis, treatment, invented facts or claims of saving. JSON: {"message":"your answer","sourceRefs":[]}. /no_think';
    history.push(system);
    if (Array.isArray(envelope.recent) && envelope.recent.length === 2 && envelope.recent[0].role === 'user' && envelope.recent[1].role === 'assistant' && typeof envelope.recent[0].content === 'string' && typeof envelope.recent[1].content === 'string') {
      history.push(envelope.recent[0]);
      history.push(envelope.recent[1]);
    }
    var user = {};
    user.role = 'user';
    user.content = envelope.user;
    history.push(user);
    request.history = history;
  }
  return request;
}
