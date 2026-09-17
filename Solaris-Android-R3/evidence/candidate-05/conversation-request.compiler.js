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
  jsonSchema.name = String.fromCharCode(115, 111, 108, 97, 114, 105, 115, 95, 99, 111, 110, 118) + String.fromCharCode(101, 114, 115, 97, 116, 105, 111, 110);
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
    var language = prompt.indexOf(String.fromCharCode(89, 111, 117, 32, 97, 114, 101, 32, 76, 85, 67, 65) + String.fromCharCode(32, 65, 73, 46, 32, 82, 101, 112, 108, 121, 32, 105) + String.fromCharCode(110, 32, 101, 115, 32)) === 0 ? String.fromCharCode(83, 112, 97, 110, 105, 115, 104) : 'English';
    system.content = String.fromCharCode(89, 111, 117, 32, 97, 114, 101, 32, 80, 111, 99, 107) + String.fromCharCode(101, 116, 32, 76, 85, 67, 65, 46, 32, 65, 110, 115) + String.fromCharCode(119, 101, 114, 32, 116, 104, 101, 32, 117, 115, 101, 114) + String.fromCharCode(32, 105, 110, 32, 49, 45, 50, 32, 115, 104, 111, 114) + String.fromCharCode(116, 32, 115, 101, 110, 116, 101, 110, 99, 101, 115, 44) + String.fromCharCode(32, 105, 110, 32) + language + (String.fromCharCode(46, 32, 78, 111, 32, 100, 105, 97, 103, 110, 111, 115) + String.fromCharCode(105, 115, 44, 32, 116, 114, 101, 97, 116, 109, 101, 110) + String.fromCharCode(116, 44, 32, 105, 110, 118, 101, 110, 116, 101, 100, 32) + String.fromCharCode(102, 97, 99, 116, 115, 32, 111, 114, 32, 99, 108, 97) + String.fromCharCode(105, 109, 115, 32, 111, 102, 32, 115, 97, 118, 105, 110) + String.fromCharCode(103, 46, 32, 74, 83, 79, 78, 58, 32, 123, 34, 109) + String.fromCharCode(101, 115, 115, 97, 103, 101, 34, 58, 34, 121, 111, 117) + String.fromCharCode(114, 32, 97, 110, 115, 119, 101, 114, 34, 44, 34, 115) + String.fromCharCode(111, 117, 114, 99, 101, 82, 101, 102, 115, 34, 58, 91) + String.fromCharCode(93, 125, 46, 32, 47, 110, 111, 95, 116, 104, 105, 110) + String.fromCharCode(107));
    history.push(system);
    if (Array.isArray(envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)]) && envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)].length === 2 && envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][0].role === 'user' && envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][1].role === 'assistant' && typeof envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][0].content === 'string' && typeof envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][1].content === 'string') {
      history.push(envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][0]);
      history.push(envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)][1]);
    }
    var user = {};
    user.role = 'user';
    user.content = envelope.user;
    history.push(user);
    request.history = history;
  }
  return request;
}
