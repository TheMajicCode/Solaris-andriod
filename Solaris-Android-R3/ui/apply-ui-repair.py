#!/usr/bin/env python3
"""Deterministic, fail-closed presentation patch of recovered 601/602 readable UI."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parents[1]/'Solaris-Android-Reconstruction/src/ui/sanctuary.html'
s=BASE.read_text()
assert hashlib.sha256(s.encode()).hexdigest()=='d37c2cca5a60085924bf777e0c0428144f5955799e3d5e1b767e4dce0a7618a9'
changes=[]
def replace(old,new):
 global s
 assert s.count(old)==1,('PATCH_ANCHOR_COUNT',old[:120],s.count(old))
 s=s.replace(old,new); changes.append({'old':old,'new':new})
replace('function repairText(en,es)',(ROOT/'chat-repair-helpers.js').read_text()+'\nfunction repairText(en,es)')
replace("function operationErrorMessage(code,action=''){","function operationErrorMessage(code,action=''){\n if(action==='converse')return chatFailureMessage(code);")
replace("function showError(code,action=''){errorCode=code;", "function showError(code,action=''){if(action==='converse')code=safeChatCode(code);errorCode=code;")
replace("The local AI could not finish an answer. Your draft is kept; try a shorter question or fewer selected records.","The local AI could not finish an answer. Your draft is kept. You can retry or check LUCA AI setup.")
replace("La IA local no pudo terminar una respuesta. Tu borrador se conserva; prueba una pregunta más corta o menos registros seleccionados.","La IA local no pudo terminar una respuesta. Tu borrador se conserva. Puedes reintentar o revisar la configuración de LUCA AI.")
replace("state={...next,hasVault:next.hasVault??state.hasVault};if(!state.locked)","if(next.locked||next.ownerId!==state.ownerId||next.grants?.local!==true||next.grants?.expiresAt!==state.grants?.expiresAt)resetChatProof();state={...next,hasVault:next.hasVault??state.hasVault};if(!state.locked)")
replace("if(state.locked){privateEpoch++;healthStatus=null;","if(state.locked){privateEpoch++;resetChatProof();chatPendingId=null;chatStartedAt=null;healthStatus=null;")
replace("const ai=lucaErrorMessage(errorCode)||", "const ai=errorAction==='converse'||lucaErrorMessage(errorCode)||")
replace("</span>${action}`}\nfunction updateError", "</span>${action}${errorAction==='converse'?`<details><summary>${repairText('Details for support','Detalles para soporte')}</summary><code>${esc(safeChatCode(errorCode))}</code></details>`:''}`}\nfunction updateError")
replace("${esc(m.text)}<small>${m.role==='user'?'You':m.mode==='qvac-device'?'Pocket LUCA AI · on this phone':'LUCA AI · guided support'}", "${esc(m.text)}<small>${m.role==='user'?tr('You'):m.mode==='qvac-device'?repairText('Pocket LUCA AI · generated on this phone','Pocket LUCA AI · generado en este teléfono'):repairText('Guided support · predefined','Apoyo guiado · predefinido')}")
replace("""aria-live="polite" ${waiting?'':'hidden'}>LUCA is thinking on your phone…</div>""", """aria-busy="${waiting}" ${waiting?'':'hidden'}><span id="chat-wait-label" role="status">${esc(chatWaitText())}</span> <span id="chat-wait-elapsed" aria-hidden="true"></span><small>${repairText('You can stop. Your draft stays here.','Puedes detener la solicitud. Tu borrador sigue aquí.')}</small></div>""")
replace("if(p.state==='ready')return Date.now()<readyUntil?{text:p.label,ready:true}:null;", "if(p.state==='ready')return Date.now()<readyUntil?{text:repairText('Model loaded · chat checked separately','Modelo cargado · chat se comprueba aparte'),ready:true}:null;")
replace("text:'LUCA AI is ready on this phone'", "text:repairText('Model loaded · chat checked separately','Modelo cargado · chat se comprueba aparte')")
old=next(x for x in s.splitlines() if x.startswith('function aiModeLabel()'))
replace(old,"function aiModeLabel(){if(!permitted()){resetChatProof();return tr('Local AI is off')}if(runtimeStatus.blocked||runtimeStatus.recovery?.blocked)return tr('Local AI needs a restart');if(waiting)return repairText('Waiting for a completed local reply','Esperando una respuesta local completa');if(chatVerified())return repairText('Chat answered in this session','El chat respondió en esta sesión');if(modelLoaded)return repairText('Model loaded · chat not verified this session','Modelo cargado · chat sin verificar en esta sesión');if(runtimeStatus.busy)return tr('Preparing on this phone');return runtimeStatus.verified?tr('Saved on this phone · not started'):repairText('Chat not verified this session','Chat sin verificar en esta sesión')}")
replace("repairText('Model loaded · ready to try','Modelo cargado · listo para probar')", "repairText('Model loaded','Modelo cargado')")
replace("</p>${p?.bytes!==undefined?", "</p><p>${esc(aiModeLabel())}</p>${p?.bytes!==undefined?")
# Unknown runtime detail must not echo arbitrary native error text into the UI.
replace("'):code);}", "'):repairText('The local engine reported an unrecognized error.','El motor local informó un error no reconocido.'));}")
replace("const ticket=navigationEpoch,session=privateEpoch,op=uid(),text=message;", "const ticket=navigationEpoch,session=privateEpoch,op=uid(),text=message,beforeIds=new Set((state.conversation||[]).map(m=>m.id));")
replace("waiting=true;chatDraft=text;render();try{", "waiting=true;chatPendingId=op;chatStartedAt=Date.now();chatDraft=text;error='';updateError();render();try{")
replace("adoptState(result);if(chatDraft===text)", "const accepted=adoptState(result);if(accepted.revision===result.revision)recordChatResult(accepted,beforeIds,text,session);if(chatDraft===text)")
replace("catch(e){if(ticket===navigationEpoch&&session===privateEpoch)showError(e.message,'converse')}finally{waiting=false;", "catch(e){if(session===privateEpoch&&!state.locked){resetChatProof();showError(e.message,'converse')}}finally{if(chatPendingId!==op)return;waiting=false;chatPendingId=null;chatStartedAt=null;")
replace("setInterval(()=>{refreshCalendarDay();updateSessionClock();", "setInterval(()=>{if(chatProof&&!chatVerified())updateRuntimeUI();updateChatWait();refreshCalendarDay();updateSessionClock();")
# Waiting copy wraps without changing the composer or navigation layout.
replace('</style>\n<meta name="solaris-privacy-baseline"', '.daily .message-wait small{display:block;margin-top:5px;color:var(--muted)}.daily .alertbar code{font-size:12px;overflow-wrap:anywhere}.daily .alertbar details summary{min-height:36px;padding:8px 0}\n</style>\n<meta name="solaris-privacy-baseline"')
(ROOT/'sanctuary.html').write_text(s)
(ROOT/'UI-PATCH.json').write_text(json.dumps({'baselineSha256':hashlib.sha256(BASE.read_bytes()).hexdigest(),'candidateSha256':hashlib.sha256(s.encode()).hexdigest(),'changes':changes},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'changes':len(changes),'candidateBytes':len(s.encode()),'sha256':hashlib.sha256(s.encode()).hexdigest()}))
