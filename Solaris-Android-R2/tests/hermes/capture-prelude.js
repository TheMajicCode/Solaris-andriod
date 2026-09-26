// Diagnostic isolation only. Never package this file in an Android application.
globalThis.__solarisOracle = {factories: Object.create(null), entries: [], loaded: []};
Object.defineProperty(globalThis, '__d', {
  configurable: true,
  get: function () { return function (factory, id, deps) {
    if (__solarisOracle.factories[id]) throw Error('Duplicate Metro module ' + id);
    __solarisOracle.factories[id] = {factory: factory, deps: deps};
  }; },
  set: function (_) {},
});
Object.defineProperty(globalThis, '__r', {
  configurable: true,
  get: function () { return function (id) { __solarisOracle.entries.push(id); }; },
  set: function (_) {},
});
