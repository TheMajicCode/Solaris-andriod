import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'fixtures/qvac-0.18.2');

// The real lifecycle/handler source bytes run unchanged. These two imports are
// explicit host stubs, not an assertion that the complete Bare SDK runs in Node.
export async function recoveredSdk() {
  for (const item of JSON.parse(fs.readFileSync(path.join(root, 'evidence/SDK-FIXTURES.json'))).files) {
    const bytes = fs.readFileSync(path.join(root, item.path));
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw Error('SDK fixture digest mismatch');
  }
  const context = vm.createContext({console, AggregateError, Error, Map, Set, Promise});
  const modules = new Map();
  const errors = new vm.SyntheticModule(['LifecycleOperationBlockedError', 'LifecycleResumeFailedError', 'LifecycleSuspendFailedError'], function() {
    this.setExport('LifecycleOperationBlockedError', class extends Error {
      constructor(type, state) { super('QVAC_LIFECYCLE_OPERATION_BLOCKED'); this.code='QVAC_LIFECYCLE_OPERATION_BLOCKED'; this.requestType=type; this.state=state; }
    });
    this.setExport('LifecycleResumeFailedError', class extends Error {
      constructor() { super('QVAC_LIFECYCLE_RESUME_FAILED'); this.code='QVAC_LIFECYCLE_RESUME_FAILED'; }
    });
    this.setExport('LifecycleSuspendFailedError', class extends Error {
      constructor() { super('QVAC_LIFECYCLE_SUSPEND_FAILED'); this.code='QVAC_LIFECYCLE_SUSPEND_FAILED'; }
    });
  }, {context});
  const logger = new vm.SyntheticModule(['getServerLogger'], function() {
    this.setExport('getServerLogger', () => ({info(){}, debug(){}, error(){}}));
  }, {context});
  function source(relative) {
    const absolute = path.join(base, relative);
    if (!modules.has(absolute)) modules.set(absolute, new vm.SourceTextModule(fs.readFileSync(absolute, 'utf8'), {identifier:absolute, context}));
    return modules.get(absolute);
  }
  const lifecycle = source('dist/server/bare/runtime-lifecycle.js');
  const handlers = ['state', 'resume', 'suspend'].map(name => source(`dist/server/rpc/handlers/${name}.js`));
  const link = specifier => {
    if (specifier.endsWith('logging/index.js')) return logger;
    if (specifier.endsWith('utils/errors-server.js')) return errors;
    if (specifier.endsWith('server/bare/runtime-lifecycle.js')) return lifecycle;
    throw Error('Unexpected SDK test import');
  };
  await lifecycle.link(link);
  await lifecycle.evaluate();
  for (const handler of handlers) { await handler.link(link); await handler.evaluate(); }
  const [state, resume, suspend] = handlers.map(m => m.namespace);
  const calls = [];
  // Public API unwrapping matches inspected Hermes: state resolves string;
  // resume/suspend resolve void. This tiny wrapper is synthetic, not SDK source.
  const runtime = {
    async state() { calls.push('state'); return state.handleState().state; },
    async resume() { calls.push('resume'); await resume.handleResume(); },
    async suspend() { calls.push('suspend'); await suspend.handleSuspend(); }
  };
  return {sdk:lifecycle.namespace, runtime, calls};
}
