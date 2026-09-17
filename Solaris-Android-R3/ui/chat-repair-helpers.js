// Presentation only. No model inference, permissions or records are changed here.
let chatProof=null,chatStartedAt=null,chatPendingId=null;
const chatErrorGroups={
 FIRST_TOKEN_TIMEOUT:'first',QVAC_FIRST_TOKEN_TIMEOUT:'first',
 STREAM_TIMEOUT:'timeout',COMPLETION_TIMEOUT:'timeout',QVAC_COMPLETION_TIMEOUT:'timeout',QVAC_TIMEOUT:'timeout',
 EMPTY_COMPLETION:'empty',QVAC_EMPTY_COMPLETION:'empty',OUTPUT_LIMIT:'limit',
 CANDIDATE_INVALID:'invalid',CANDIDATE_UNGROUNDED:'ungrounded',CANDIDATE_UNSAFE:'unsafe',CANDIDATE_NEGATION:'negation',
 SETTLEMENT_UNCONFIRMED:'cleanup',RUNTIME_RESTART_REQUIRED:'cleanup',
 LOCAL_PERMISSION_REQUIRED:'permission',CONTEXT_BUDGET:'context',CANCELLED:'cancelled',ACTIVITY_ENTERS_BACKGROUND:'background',VAULT_LOCKED:'locked',
 LUCA_RESPONSE_UNAVAILABLE:'unknown',OPERATION_FAILED:'unknown',
 QVAC_LIFECYCLE_OPERATION_BLOCKED:'runtime',QVAC_LIFECYCLE_SUSPEND_FAILED:'runtime',QVAC_LIFECYCLE_RESUME_FAILED:'runtime',QVAC_MODEL_LOAD_FAILED:'runtime',QVAC_RPC_CONNECTION_FAILED:'runtime',QVAC_RPC_INIT_TIMEOUT:'runtime',QVAC_WORKER_CRASHED:'runtime',QVAC_WORKER_SHUTDOWN:'runtime',QVAC_CONTEXT_OVERFLOW:'runtime',QVAC_COMPLETION_FAILED:'runtime',QVAC_NOT_READY:'runtime',WORKER_RECOVERY_REQUIRED:'runtime',
 BRIDGE_REPLY_TIMEOUT:'bridge',BRIDGE_ACK_TIMEOUT:'bridge',BRIDGE_SEND_FAILED:'bridge'
};
function safeChatCode(code){return typeof code==='string'&&Object.hasOwn(chatErrorGroups,code)?code:'OPERATION_FAILED'}
function chatFailureMessage(code){
 const kind=chatErrorGroups[safeChatCode(code)],messages={
 first:['The local model did not start replying in time. Your draft is kept. Try again or check LUCA AI setup.','El modelo local no empezó a responder a tiempo. Tu borrador se conserva. Reintenta o revisa la configuración de LUCA AI.'],
 timeout:['The local reply did not finish in time. Your draft is kept. You can try again.','La respuesta local no terminó a tiempo. Tu borrador se conserva. Puedes reintentar.'],
 limit:['The local reply reached its length limit before finishing. Your draft is kept. You can try again.','La respuesta local alcanzó su límite de longitud antes de terminar. Tu borrador se conserva. Puedes reintentar.'],
 empty:['The local model finished without an answer. Your draft is kept. You can try again.','El modelo local terminó sin una respuesta. Tu borrador se conserva. Puedes reintentar.'],
 invalid:['The reply could not be read in the required format. Your draft is kept. You can try again.','No se pudo leer la respuesta en el formato requerido. Tu borrador se conserva. Puedes reintentar.'],
 ungrounded:['The reply could not be verified against the selected sources, so it was not shown. Your draft is kept.','No se pudo verificar la respuesta con las fuentes seleccionadas y no se mostró. Tu borrador se conserva.'],
 unsafe:['The reply did not pass the answer checks, so it was not shown. Your draft is kept.','La respuesta no pasó las comprobaciones y no se mostró. Tu borrador se conserva.'],
 negation:['The reply changed a meaning that needed to be preserved, so it was not shown. Your draft is kept.','La respuesta cambió un significado que debía conservarse y no se mostró. Tu borrador se conserva.'],
 cleanup:['The local engine did not confirm it stopped. Copy your draft before closing Solaris from recent apps and reopening it to retry.','El motor local no confirmó su detención. Copia tu borrador antes de cerrar Solaris desde las aplicaciones recientes y volver a abrirlo para reintentar.'],
 permission:['Local AI permission is off or expired. Your draft is kept. Review AI permissions to continue.','El permiso de IA local está desactivado o vencido. Tu borrador se conserva. Revisa los permisos de IA para continuar.'],
 context:['The selected context exceeds this model’s limit. Your draft is kept. Choose fewer sources or shorten a long message.','El contexto seleccionado supera el límite de este modelo. Tu borrador se conserva. Elige menos fuentes o acorta un mensaje largo.'],
 cancelled:['The request was stopped. Your draft is kept.','La solicitud se detuvo. Tu borrador se conserva.'],
 background:['The request was interrupted when Solaris left the foreground. Your draft is kept. Keep Solaris open when you retry.','La solicitud se interrumpió al pasar Solaris a segundo plano. Tu borrador se conserva. Mantén Solaris abierto al reintentar.'],
 locked:['Your Vault is locked. Unlock to continue.','Tu bóveda está bloqueada. Desbloquéala para continuar.'],
 bridge:['The app did not receive confirmation from the local engine. Your draft is kept. Check LUCA AI setup before retrying.','La app no recibió confirmación del motor local. Tu borrador se conserva. Revisa la configuración de LUCA AI antes de reintentar.'],
 unknown:['The chat request failed, but its cause was not reported. Your draft is kept. Check LUCA AI setup before retrying.','La solicitud de chat falló sin informar la causa. Tu borrador se conserva. Revisa la configuración de LUCA AI antes de reintentar.']
 };
 return kind==='runtime'?(lucaErrorMessage(code)||repairText(...messages.unknown)):repairText(...messages[kind]);
}
function resetChatProof(){chatProof=null}
function chatContextGrant(){return JSON.stringify(state.experience?.localContext||null)}
function chatVerified(){
 if(!chatProof)return false;
 if(state.locked||!permitted()||chatProof.epoch!==privateEpoch||chatProof.owner!==state.ownerId||chatProof.expires!==state.grants?.expiresAt||chatProof.context!==chatContextGrant()||(chatProof.contextExpiry&&Date.parse(chatProof.contextExpiry)<=Date.now())){resetChatProof();return false}
 return true;
}
function recordChatResult(result,beforeIds,message,session){
 // Only the completed result of this normal-chat request can establish proof.
 // Historical replies, setup-test status, empty replies and unchanged state cannot.
 if(session!==privateEpoch||state.locked||result!==state||!permitted())return;
 const list=Array.isArray(result.conversation)?result.conversation:[],reply=list.at(-1),user=list.at(-2);
 if(!reply||!user||reply.role!=='assistant'||reply.mode!=='qvac-device'||typeof reply.id!=='string'||beforeIds.has(reply.id)||typeof reply.text!=='string'||!reply.text.trim()||user.role!=='user'||typeof user.id!=='string'||beforeIds.has(user.id)||user.text!==message)return;
 const contextExpiry=state.experience?.localContext?.expiresAt;chatProof={epoch:session,owner:state.ownerId,expires:state.grants.expiresAt,reply:reply.id,context:chatContextGrant(),contextExpiry:Date.parse(contextExpiry)>Date.now()?contextExpiry:null};
}
function chatWaitText(){return repairText(Date.now()-chatStartedAt<15000?'Preparing your local reply…':'Still waiting for a completed local reply…',Date.now()-chatStartedAt<15000?'Preparando tu respuesta local…':'Aún esperando una respuesta local completa…')}
function updateChatWait(){
 const mode=root.querySelector('[data-mode]'),modeText=aiModeLabel();if(mode&&mode.textContent!==modeText)mode.textContent=modeText;
 const label=document.getElementById('chat-wait-label'),elapsed=document.getElementById('chat-wait-elapsed');
 if(!waiting||chatStartedAt===null)return;
 const text=chatWaitText();if(label&&label.textContent!==text)label.textContent=text;
 if(elapsed)elapsed.textContent=Math.max(0,Math.floor((Date.now()-chatStartedAt)/1000))+'s';
}
