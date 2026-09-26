/* Build 604: deterministic guided replies from an already validated task.
 * No model call, store read, source auto-selection or data mutation.
 * Returns null for open chat. The caller retains every original authority,
 * permission, current-source, cancellation and persistence check.
 */
function fastGuided(task) {
  var prompt = task.prompt;
  var envelope = JSON.parse(prompt.slice(prompt.indexOf('\n') + 1, -10));
  var text = envelope.user.toLowerCase().trim();
  while (text.length && '!?.,'.indexOf(text.charAt(text.length - 1)) >= 0) text = text.slice(0, -1).trim();
  var spanish = prompt.indexOf('Reply in es ') >= 0;
  var facts = envelope.facts;
  var refs = [];
  var answer = '';
  var kind = '';
  var checkin = text.indexOf('check-in') >= 0 || text.indexOf('check in') >= 0 || text.indexOf('checkin') >= 0 || text.indexOf('registro de bienestar') >= 0;
  var question = text.indexOf('what ') === 0 || text.indexOf('how ') === 0 || text.indexOf('show ') === 0 || text.indexOf('tell ') === 0 || text.indexOf('explain ') === 0 || text.indexOf('review ') === 0 || text.indexOf('summari') === 0 || text.indexOf('my ') === 0 || text.indexOf('mi ') === 0 || text.indexOf('mis ') === 0 || text.indexOf('qué ') === 0 || text.indexOf('que ') === 0 || text.indexOf('cómo ') === 0 || text.indexOf('como ') === 0 || text.indexOf('revisa ') === 0 || text.indexOf('explica ') === 0;
  var personal = text.indexOf('my ') >= 0 || text.indexOf(' me') >= 0 || text.indexOf('mi ') >= 0 || text.indexOf('mis ') >= 0 || text === 'explain my check-in';
  checkin = checkin && question;
  var activities = question && personal && (text.indexOf('activit') >= 0 || text.indexOf('activid') >= 0 || text.indexOf('history') >= 0 || text.indexOf('historial') >= 0 || text.indexOf('recent records') >= 0);
  var step = text === 'choose a step' || text === 'help me choose a step' || text === 'elige un paso' || text === 'elegir un paso';
  var greeting = text === 'hello' || text === 'hi' || text === 'hey' || text === 'hola' || text === 'buenos días' || text === 'buenas tardes' || text === 'buenas noches';
  var capabilities = text === 'what can you do' || text === 'what can you help me with' || text === 'who are you' || text === 'help' || text === 'qué puedes hacer' || text === 'que puedes hacer' || text === 'ayuda';
  if (greeting || capabilities) {
    answer = spanish ? 'Hola. Soy Pocket LUCA. Puedo ayudarte a reflexionar, elegir un pequeño paso y revisar los registros que selecciones en Fuentes.' : 'Hello. I am Pocket LUCA. I can help you reflect, choose a small step and review the records you select in Sources.';
    kind = 'welcome';
  } else if (activities) {
    answer = spanish ? 'El chat no tiene acceso a tu historial de actividades. Abre tu historial para ver lo que iniciaste o completaste. Puedes seleccionar registros en Fuentes para revisarlos aquí.' : 'Chat does not have your activity history. Open your history to see what you started or completed. You can select records in Sources to review them here.';
    kind = 'history';
  } else if (checkin || step) {
    var latest = -1;
    var newest = '';
    var aspects = 'vitality,clarity,balance,alignment'.split(',');
    for (var i = 0; i < facts.length; i++) {
      var fields = facts[i].fields;
      var isCheckin = task.manifest.sources[i].category === 'questionnaires' && task.sourceRefs[i].id.indexOf('source_') === 0 && Object.keys(fields).length === 5;
      for (var j = 0; j < aspects.length; j++) {
        var value = fields[aspects[j]];
        if (value !== null && !(typeof value === 'number' && value >= 1 && value <= 5 && value % 1 === 0)) isCheckin = false;
      }
      if (isCheckin && typeof fields.date === 'string' && new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$').test(fields.date) && fields.date >= newest) {
        latest = i;
        newest = fields.date;
      }
    }
    if (latest < 0 && checkin) {
      answer = spanish ? 'En Solaris, un check-in es tu impresión de vitalidad, claridad, equilibrio y alineación. Selecciona un check-in en Fuentes para revisar tus respuestas; no completaré lo que falta.' : 'A Solaris check-in records your impressions of vitality, clarity, balance and alignment. Select a check-in in Sources so we can review your own answers; missing answers stay missing.';
      kind = 'checkin-select';
    } else if (latest < 0) {
      answer = spanish ? 'Elige algo pequeño y concreto: escribe lo que sientes, nombra una intención o revisa un paso pendiente. ¿Cuál encaja contigo ahora? Selecciona un check-in en Fuentes para adaptarlo a tus respuestas.' : 'Choose something small and concrete: write what is on your mind, name an intention or review an unfinished step. Which fits you now? Select a check-in in Sources to tailor this to your answers.';
      kind = 'step-select';
    } else {
      var selected = facts[latest].fields;
      var labels = spanish ? 'vitalidad,claridad,equilibrio,alineación'.split(',') : aspects;
      var ratings = [];
      var minimum = 6;
      var low = [];
      for (var k = 0; k < aspects.length; k++) {
        var rating = selected[aspects[k]];
        if (typeof rating === 'number' && rating >= 1 && rating <= 5 && rating % 1 === 0) {
          ratings.push(labels[k] + ': ' + rating + '/5');
          if (rating < minimum) { minimum = rating; low = [labels[k]]; }
          else if (rating === minimum) low.push(labels[k]);
        }
      }
      refs.push(task.sourceRefs[latest]);
      answer = spanish ? 'En el check-in seleccionado de ' + newest + ' registraste ' + (ratings.length ? ratings.join(', ') : 'ninguna valoración') + '. Son tus propias impresiones. ' : 'In the selected check-in dated ' + newest + ', you recorded ' + (ratings.length ? ratings.join(', ') : 'no aspect ratings') + '. These are your own impressions. ';
      if (!ratings.length) {
        answer += spanish ? 'Puedes volver al check-in cuando quieras responder o saltarlo.' : 'You can return to the check-in when you want to answer, or leave it skipped.';
        kind = 'checkin-empty';
      } else if (step) {
        answer += spanish ? 'Para un pequeño paso, elige un aspecto (' + low.join(', ') + ') y escribe qué te ayudaría hoy. Tú decides si quieres hacerlo.' : 'For a small step, choose an aspect (' + low.join(', ') + ') and write what would support it today. You decide whether to act on it.';
        kind = 'step';
      } else {
        answer += spanish ? '¿Qué estaba pasando cuando valoraste ' + low.join(', ') + '? Puedes empezar por uno de esos aspectos.' : 'What was happening when you rated ' + low.join(', ') + '? You can start with one of those aspects.';
        kind = 'checkin';
      }
    }
  } else if (facts.length === 0 && question && personal && (text.indexOf('record') >= 0 || text.indexOf('note') >= 0 || text.indexOf('habit') >= 0 || text.indexOf('measurement') >= 0 || text.indexOf('sleep') >= 0 || text.indexOf('journal') >= 0 || text.indexOf('registro') >= 0 || text.indexOf('hábito') >= 0 || text.indexOf('dorm') >= 0)) {
    answer = spanish ? 'No hay registros seleccionados para este mensaje. Elige los registros que quieras compartir en Fuentes, o cuéntame aquí lo que deseas revisar.' : 'No records are selected for this message. Choose the records you want to share in Sources, or tell me here what you want to review.';
    kind = 'records-select';
  }
  if (!answer) return null;
  var result = {}; result.message = answer; result.sourceRefs = refs; result.kind = kind; return result;
}
