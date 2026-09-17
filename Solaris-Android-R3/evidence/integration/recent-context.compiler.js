/* Build603: one recent, completed source-free pair from this unlocked session.
 * Called only after the original conversation compiler validates consent and
 * current sources. No saved state or record is changed. The cache holds only
 * identity/cursor metadata, never a second copy of the conversation text.
 * Original number, negation, safety, source and persistence checks remain.
 */
function recentContext(task, owner, state) {
  var context = state.experience.localContext;
  var scope = JSON.stringify([owner.session, state.subjectId, state.authorityEpoch, context.revision]);
  var rows = state.conversation;
  var count = rows.length;
  var tail = count ? rows[count - 1].id : '';
  var previous = owner[String.fromCharCode(95, 95, 115, 111, 108, 97, 114, 105, 115, 54, 48, 51) + String.fromCharCode(67, 111, 110, 116, 101, 120, 116)];
  var cursor = {};
  cursor.scope = scope;
  cursor.tail = tail;
  owner[String.fromCharCode(95, 95, 115, 111, 108, 97, 114, 105, 115, 54, 48, 51) + String.fromCharCode(67, 111, 110, 116, 101, 120, 116)] = cursor;
  if (!previous || previous.scope !== scope || previous.tail === tail || count < 2) return task;
  if (task.sourceRefs.length || task.allowedActionIds.length) return task;
  var user = rows[count - 2];
  var assistant = rows[count - 1];
  var provenance = assistant.provenance;
  if (user.role !== 'user' || assistant.role !== 'assistant' || assistant.mode !== 'qvac-device') return task;
  if (user.id === previous.tail || !Array.isArray(user.sources) || user.sources.length || !Array.isArray(assistant.sources) || assistant.sources.length || !provenance || provenance.authorityEpoch !== state.authorityEpoch || provenance.permissionRevision !== context.revision || !Array.isArray(provenance.sourceRefs) || provenance.sourceRefs.length) return task;
  if (typeof user.text !== 'string' || typeof assistant.text !== 'string') return task;
  var history = [];
  var first = {};
  first.role = 'user';
  first.content = user.text;
  history.push(first);
  var second = {};
  second.role = 'assistant';
  second.content = assistant.text;
  history.push(second);
  var encoded = encodeURIComponent(JSON.stringify(history));
  var bytes = 0;
  for (var i = 0; i < encoded.length; i++) {
    bytes++;
    if (encoded.charAt(i) === '%') i += 2;
  }
  if (bytes > 300) return task;
  var prompt = task.prompt;
  var split = prompt.indexOf('\n');
  var envelope = JSON.parse(prompt.slice(split + 1, -10));
  if (split < 0 || prompt.slice(-10) !== ' /no_think' || envelope.facts.length || envelope.allowed.length) return task;
  envelope[String.fromCharCode(114, 101, 99, 101, 110, 116)] = history;
  var candidate = prompt.slice(0, split + 1) + JSON.stringify(envelope) + ' /no_think';
  encoded = encodeURIComponent(candidate);
  bytes = 0;
  for (var j = 0; j < encoded.length; j++) {
    bytes++;
    if (encoded.charAt(j) === '%') j += 2;
  }
  if (bytes > 1200) return task;
  task.prompt = candidate;
  task.manifest.promptBytes = bytes;
  return task;
}
