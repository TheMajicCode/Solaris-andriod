// Analysis compilation only. No package/framework upgrade or app mutation.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../..');
const babelPath = path.join(root, 'reconstruction-work/r2-tools/babel-standalone-7.28.5/package/babel.js');
const Babel = require(babelPath);
if (Babel.version !== '7.28.5') throw new Error('Unexpected Babel version');
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: node transpile-hermes-fixture.cjs input.js output.js');
if (fs.existsSync(output)) throw new Error('Refusing to overwrite output');
const code = fs.readFileSync(input, 'utf8');
const options = {sourceType:'script', sourceMaps:true, filename:path.basename(input),
  assumptions: {}, presets: [], plugins: [
    'transform-classes', 'transform-async-to-generator', 'transform-parameters',
    'transform-destructuring', 'transform-object-rest-spread',
    'transform-optional-chaining', 'transform-nullish-coalescing-operator'
  ]};
const result = Babel.transform(code, options);
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
fs.writeFileSync(output, result.code+'\n');
fs.writeFileSync(output+'.map', JSON.stringify(result.map)+'\n');
fs.writeFileSync(output+'.provenance.json', JSON.stringify({compiler:'@babel/standalone',version:Babel.version,
  compilerSha256:sha(fs.readFileSync(babelPath)),input,output,inputSha256:sha(code),
  outputSha256:sha(result.code+'\n'),options},null,2)+'\n');
console.log(JSON.stringify({output,inputSha256:sha(code),outputSha256:sha(result.code+'\n')}));
