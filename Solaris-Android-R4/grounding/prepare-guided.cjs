/* Deterministically lower new string constants without adding HBC table IDs.
 * Editable helpers retain ordinary readable strings; only compiler input uses
 * bounded eight-code-unit String.fromCharCode chunks. The exact compiled helper is VM-tested.
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const Babel = require(path.join(root, 'reconstruction-work/r2-tools/babel-standalone-7.28.5/package/babel.js'));
const [input, stringsFile, output] = process.argv.slice(2);
if (!output) throw Error('Usage: prepare-donor.cjs source.js base-strings.json output.js');
const known = new Set(JSON.parse(fs.readFileSync(stringsFile, 'utf8')));
const source = fs.readFileSync(input, 'utf8');
const result = Babel.transform(source, {
  sourceType: 'script', comments: true, compact: false,
  plugins: [function({types:t}) {
    function stringExpression(value) {
      const parts = [];
      for(let i=0; i<value.length; i+=8) {
        const args=[];
        for(let j=i; j<Math.min(i+8,value.length); j++) args.push(t.numericLiteral(value.charCodeAt(j)));
        parts.push(t.callExpression(t.memberExpression(t.identifier('String'),t.identifier('fromCharCode')),args));
      }
      if(!parts.length) return t.stringLiteral('');
      return parts.reduce((a,b)=>t.binaryExpression('+',a,b));
    }
    return {visitor:{
      MemberExpression(p) {
        if(!p.node.computed && t.isIdentifier(p.node.property) && !known.has(p.node.property.name)) {
          p.node.property=stringExpression(p.node.property.name); p.node.computed=true;
        }
      },
      StringLiteral(p) {
        if(!known.has(p.node.value)) { p.replaceWith(stringExpression(p.node.value)); p.skip(); }
      }
    }};
  }]
});
fs.writeFileSync(output,result.code+'\n');
