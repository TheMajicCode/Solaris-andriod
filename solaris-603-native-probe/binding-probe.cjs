console.log('Runtime',Bare.versions);
const binding=require.addon('./reference-worker/node_modules/@qvac/llm-llamacpp/prebuilds/linux-x64/qvac__llm-llamacpp.bare');
console.log('Binding',Object.keys(binding));
