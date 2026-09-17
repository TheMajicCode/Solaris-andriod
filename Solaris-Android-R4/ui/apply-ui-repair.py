#!/usr/bin/env python3
"""Evidence-bound 604 UI changes applied to verified editable 603 source."""
import hashlib, json
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent.parent / 'Solaris-Android-R3/ui/sanctuary.html'
source = BASE.read_text()
assert hashlib.sha256(BASE.read_bytes()).hexdigest() == 'ef223edffb22dbbcafded33f94c54ec2c784121ecba006ac9cea29c9325642e2'
changes = []

def replace(name, old, new):
    global source
    assert source.count(old) == 1, (name, source.count(old))
    source = source.replace(old, new)
    changes.append({'change': name, 'old': old, 'new': new})

replace('Track transient notice ownership', "errorAction='',methodSaving=false;", "errorAction='',errorOwner=null,methodSaving=false;")
replace('Real errors supersede transient notice ownership', "function showError(code,action=''){", "function showError(code,action=''){errorOwner=null;")
replace('Clearing an error clears ownership', "function updateError(){if(!error){errorCode='';errorAction='';}", "function updateError(){if(!error){errorCode='';errorAction='';errorOwner=null;}")
replace('Chat shortcuts use chat progress only; late notices cannot replace errors', "const notice=setTimeout(()=>{if(actionJobs.get(group)===job&&isCurrent()){error=", "const notice=action.startsWith('ask:')?null:setTimeout(()=>{if(actionJobs.get(group)===job&&isCurrent()&&!error){errorOwner=job;error=")
replace('Finished actions clear only their own transient notice', "finally{clearTimeout(notice);if(actionJobs.get(group)===job)actionJobs.delete(group);updatePendingControls();}", "finally{clearTimeout(notice);if(errorOwner===job){error='';updateError();}if(actionJobs.get(group)===job)actionJobs.delete(group);updatePendingControls();}")

start = source.index('function recordChatResult(')
end = source.index('function chatWaitText()', start)
old = source[start:end]
new = '''function completedChat(result,beforeIds,message,session){
 if(session!==privateEpoch||state.locked||result!==state)return false;
 const list=Array.isArray(result.conversation)?result.conversation:[],reply=list.at(-1),user=list.at(-2);
 return !!(reply&&user&&reply.role==='assistant'&&typeof reply.id==='string'&&!beforeIds.has(reply.id)&&typeof reply.text==='string'&&reply.text.trim()&&user.role==='user'&&typeof user.id==='string'&&!beforeIds.has(user.id)&&user.text===message);
}
function recordChatResult(result,beforeIds,message,session){
 if(!completedChat(result,beforeIds,message,session)||!permitted()||result.conversation.at(-1).mode!=='qvac-device')return;
 const contextExpiry=state.experience?.localContext?.expiresAt;chatProof={epoch:session,owner:state.ownerId,expires:state.grants.expiresAt,reply:result.conversation.at(-1).id,context:chatContextGrant(),contextExpiry:Date.parse(contextExpiry)>Date.now()?contextExpiry:null};
}
'''
replace('Completion receipt is distinct from model-inference proof', old, new)
replace('Only a confirmed new reply clears the submitted draft and same-chat error', "if(accepted.revision===result.revision)recordChatResult(accepted,beforeIds,text,session);if(chatDraft===text){chatDraft='';const input=document.getElementById('chat-draft');if(input?.value===text)input.value='';}", "if(accepted.revision===result.revision&&completedChat(accepted,beforeIds,text,session)){recordChatResult(accepted,beforeIds,text,session);if(errorAction==='converse'){error='';updateError();}if(chatDraft===text){chatDraft='';const input=document.getElementById('chat-draft');if(input?.value===text)input.value='';}}")
replace('Settled controls update after navigation back to chat', "if(ticket===navigationEpoch&&session===privateEpoch&&route==='luca'&&(!sub||sub==='sourcePicker'))", "if(session===privateEpoch&&route==='luca'&&(!sub||sub==='sourcePicker'))")
replace('Progress is observational, not a claim about engine activity', "Date.now()-chatStartedAt<15000?'Preparing your local reply…':'Still waiting for a completed local reply…',Date.now()-chatStartedAt<15000?'Preparando tu respuesta local…':'Aún esperando una respuesta local completa…'", "Date.now()-chatStartedAt<15000?'Waiting for your reply…':'Your reply is taking longer…',Date.now()-chatStartedAt<15000?'Esperando tu respuesta…':'Tu respuesta está tardando más…'")
replace('Zero-source selection is an explicit choice', "${btn(selected.size+' '+tr('selected sources'),'sourcePicker','plain')}", "${btn(selected.size?selected.size+' '+tr('selected sources'):repairText('Choose sources','Elegir fuentes'),'sourcePicker','plain')}")
replace('Visible zero-source context explanation', "${sub==='sourcePicker'?`<div class=\"sources\">", "${!selected.size?`<small class=\"muted\">${repairText('No records selected. Choose sources for personal answers.','Sin registros seleccionados. Elige fuentes para respuestas personales.')}</small>`:''}${sub==='sourcePicker'?`<div class=\"sources\">")
replace('Source picker offers existing category permission control', "${btn('Done','sourcePickerDone','plain')}</div>`:''}</section>`}", "${btn('Choose context categories','contextSettings','plain')}${btn('Done','sourcePickerDone','plain')}</div>`:''}</section>`}")

replace('Public return marker contains no private message or source', "let chatProof=null,chatStartedAt=null,chatPendingId=null;", "let chatProof=null,chatStartedAt=null,chatPendingId=null,chatReturn=0;")
replace('Background hide records only destination and interrupted status', "window.__solarisPrivateHide=()=>{navigationEpoch++;", "window.__solarisPrivateHide=()=>{if(!state.locked&&chatReturn!==-1)chatReturn=route==='luca'?(waiting?2:1):0;navigationEpoch++;")
replace('Unlock home callback returns to chat without inference or replay', "window.__solarisDailyRoute=r=>{navigationEpoch++;route=r;sub=null;render()};", "window.__solarisDailyRoute=r=>{navigationEpoch++;if(chatReturn===1||chatReturn===2){if(r==='home')r='luca';chatReturn=chatReturn===2?3:0;}route=r;sub=null;render()};")
replace('Explicit lock clears the public return marker', "if(a==='lock'){await request('lock');", "if(a==='lock'){chatReturn=-1;try{await request('lock');}finally{chatReturn=0;}")
replace('Fresh explicit lock clears the old interruption notice', "if(state.locked){privateEpoch++;", "if(state.locked){if(chatReturn===3)chatReturn=0;privateEpoch++;")
replace('Interruption explanation does not claim an unsaved draft survived', '<div class="messages" aria-label="Conversation">', '''${chatReturn===3?`<p class="muted" role="status">${repairText('Your saved chat is below. Leaving Solaris stopped the reply and cleared the draft. Type your question again to retry.','Tu chat guardado sigue abajo. Salir de Solaris detuvo la respuesta y borró el borrador. Escríbelo de nuevo para reintentar.')}</p>`:''}<div class="messages" aria-label="Conversation">''')
replace('Only explicit send dismisses interruption state', "if(waiting||!message.trim())return;useAI=permitted();", "if(waiting||!message.trim())return;chatReturn=0;useAI=permitted();")

out = HERE / 'sanctuary.html'
out.write_text(source)
(HERE/'UI-PATCH.json').write_text(json.dumps({'baselineSha256':hashlib.sha256(BASE.read_bytes()).hexdigest(),'outputSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'changes':changes},indent=2)+'\n')
print(json.dumps({'output':str(out),'bytes':out.stat().st_size,'changes':len(changes)}))
