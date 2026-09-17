const path=__dirname;
const binding=require.addon('./reference-worker/node_modules/@qvac/llm-llamacpp/prebuilds/linux-x64/qvac__llm-llamacpp.bare');
const fixture=require(Bare.argv[2]);
const mode=fixture.mode;
const configs={device:'cpu',gpu_layers:0,ctx_size:2048,predict:256,temp:0.3,reasoning_budget:0,parallel:1,verbosity:0,backendsDir:path+'/reference-worker/node_modules/@qvac/llm-llamacpp/prebuilds'};
const started=Date.now();
let output='', first=null, doneResolve, doneReject;
const done=new Promise((r,j)=>{doneResolve=r;doneReject=j});
let handle;
const watchdog=setTimeout(()=>{console.log(JSON.stringify({type:'watchdog',mode,output,ms:Date.now()-started}));if(handle)binding.destroyInstance(handle);Bare.exitCode=2;},15000);
const obj={};
function cb(addon,event,data,error,jobId){
 const ms=Date.now()-started;
 console.log(JSON.stringify({type:'raw-event',ms,event,data,error,jobId}));
 if(data && typeof data==='object' && 'TPS' in data){console.log(JSON.stringify({type:'done',mode,ms,firstTokenMs:first,output,event,data,jobId})); doneResolve();}
 else if(String(event).includes('Error')){console.log(JSON.stringify({type:'error',mode,ms,event,data,error,jobId}));doneReject(new Error(String(error || data)));}
 else if(typeof data==='string'&&!String(event).includes('LogMsg')){if(first===null)first=ms;output+=data;console.log(JSON.stringify({type:'token',ms,text:data}));}
}
async function main(){
 console.log(JSON.stringify({type:'start',mode,configs,runtime:Bare.versions}));
 handle=binding.createInstance(obj,{path:path+'/acquired/Qwen3-0.6B-Q4_0.gguf',projectionPath:'',config:Object.fromEntries(Object.entries(configs).map(([k,v])=>[k,String(v)]))},cb,null);
 await binding.activate(handle);
 console.log(JSON.stringify({type:'loaded',ms:Date.now()-started}));
 const history=fixture.history;
 const gen=fixture.generationParams;
 console.log(JSON.stringify({type:'request',history,generationParams:gen}));
 const admission=await binding.runJob(handle,[{type:'text',input:JSON.stringify(history),prefill:false,generationParams:gen,saveCacheToDisk:false}]);
 console.log(JSON.stringify({type:'admission',admission,ms:Date.now()-started}));
 await done;clearTimeout(watchdog);
 binding.destroyInstance(handle);
}
main().catch(e=>{console.log(JSON.stringify({type:'fatal',error:String(e),stack:e.stack})); clearTimeout(watchdog);if(handle)binding.destroyInstance(handle);Bare.exitCode=1;});
