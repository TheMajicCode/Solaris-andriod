'use strict';
// Build-time syntax-preserving minifier. Local binding names only; no optimization.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=__dirname;
const toolRoot=path.resolve(root,'../../reconstruction-inputs/ui-toolchain/node_modules');
const terser=require(path.join(toolRoot,'terser')),acorn=require(path.join(toolRoot,'acorn'));
const scope=require(path.join(toolRoot,'eslint-scope'));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const input=fs.readFileSync(path.join(root,'sanctuary.html'),'utf8');
const cssTree=require(path.join(toolRoot,'css-tree'));
function tree(text){
 const ast=acorn.parse(text,{ecmaVersion:2022,sourceType:'script',ranges:true});
 const manager=scope.analyze(ast,{ecmaVersion:2022,sourceType:'script'}),bindings=new Map();
 manager.scopes.forEach((sc,i)=>sc.variables.forEach((variable,j)=>{
  const name='__scope_'+i+'_binding_'+j;
  for(const node of variable.identifiers)bindings.set(node,name);
  for(const ref of variable.references)bindings.set(ref.identifier,name);
 }));
 const normalized=JSON.stringify(ast,(key,value)=>{
  if(['start','end','range','raw'].includes(key))return undefined;
  if(value&&value.type==='Identifier'&&bindings.has(value))return {type:'Identifier',name:bindings.get(value)};
  if(key==='shorthand')return false; // {local} and {local:renamed} have the same key/value binding.
  return typeof value==='bigint'?String(value):value;
 });
 return {normalized,globalNames:manager.globalScope.variables.map(v=>v.name),scopeNames:manager.scopes.map(sc=>sc.variables.map(v=>v.name))};
}
(async()=>{
 const matches=[...input.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(matches.length,1);
 const match=matches[0],rawScript=match[1],assets=[];const original=rawScript.replace(/"data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+\/=]+"/g,raw=>{const marker='SOLARIS_UNCHANGED_ASSET_'+assets.length;assert(!input.includes(marker));assets.push({marker,raw});return JSON.stringify(marker)});
 console.error('stage: prepared-assets',original.length,assets.length);
 const options={compress:false,mangle:{toplevel:false,keep_fnames:true,keep_classnames:true},ecma:2020,format:{comments:false,inline_script:true,quote_style:3,keep_quoted_props:true,semicolons:true}};
 const result=await terser.minify(original,options);console.error('stage: minified-js');assert.equal(typeof result.code,'string');
 const a=tree(original),b=tree(result.code);console.error('stage: parsed-js');assert.equal(b.normalized,a.normalized,'Output must retain the complete binding-normalized syntax tree');
 assert.deepEqual(b.globalNames,a.globalNames,'Global names must remain unchanged');
 const appScope=a.scopeNames.findIndex(names=>names.includes('state')&&names.includes('chatDraft'));assert(appScope>=0);const symbols=Object.fromEntries(a.scopeNames[appScope].map((name,i)=>[name,b.scopeNames[appScope][i]]));fs.writeFileSync(path.join(root,'UI-TEST-SYMBOLS.json'),JSON.stringify(symbols,null,2)+'\n');
 const before=input.slice(0,match.index+8),after=input.slice(match.index+match[0].length-9);
 let restored=result.code;for(const {marker,raw} of assets){assert.equal(restored.split(JSON.stringify(marker)).length,2);restored=restored.replace(JSON.stringify(marker),raw);}let output=before+restored+after;const cssChecks=[];console.error('stage: restored-assets');output=output.replace(/<style>([\s\S]*?)<\/style>/g,(all,css)=>{const original=cssTree.toPlainObject(cssTree.parse(css,{positions:false})),compact=cssTree.generate(cssTree.fromPlainObject(original)),again=cssTree.toPlainObject(cssTree.parse(compact,{positions:false}));assert.equal(sha(JSON.stringify(again)),sha(JSON.stringify(original)),'CSS syntax tree must remain unchanged');console.error('stage: checked-css');cssChecks.push({inputSha256:sha(css),outputSha256:sha(compact),beforeBytes:Buffer.byteLength(css),afterBytes:Buffer.byteLength(compact),syntaxTreeUnchanged:true});return '<style>'+compact+'</style>'});
 fs.writeFileSync(path.join(root,'sanctuary.compact.html'),output);
 const report={inputSha256:sha(input),formattedSha256:sha(output),originalScriptBytes:Buffer.byteLength(rawScript),formattedScriptBytes:Buffer.byteLength(restored),verbatimPreservedAssets:assets.map(a=>({sha256:sha(a.raw),bytes:Buffer.byteLength(a.raw)})),originalBindingTreeSha256:sha(a.normalized),formattedBindingTreeSha256:sha(b.normalized),bindingNormalizedSyntaxTreeIdentical:true,globalNamesUnchanged:true,nonScriptContentUnchangedExceptSyntaxPreservingCss:true,cssChecks,terserVersion:require(path.join(toolRoot,'terser/package.json')).version,acornVersion:require(path.join(toolRoot,'acorn/package.json')).version,eslintScopeVersion:require(path.join(toolRoot,'eslint-scope/package.json')).version,options};
 fs.writeFileSync(path.join(root,'UI-FORMAT-CHECK.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
