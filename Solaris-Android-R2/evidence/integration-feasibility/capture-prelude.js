// Test fixture: collect exact Metro factories without launching the app.
globalThis.global = globalThis;
globalThis.__capturedFactories = Object.create(null);
globalThis.__suppressedStartup = [];
Object.defineProperty(globalThis, '__d', { configurable: true, get: function () {
  return function (factory, id, deps) { __capturedFactories[id] = {factory: factory, deps: deps}; };
}, set: function (_) {} });
Object.defineProperty(globalThis, '__r', { configurable: true, get: function () {
  return function (id) { __suppressedStartup.push(id); return {}; };
}, set: function (_) {} });
