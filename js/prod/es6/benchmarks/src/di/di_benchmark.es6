import {Injectable,
  Injector,
  Key,
  bind} from "angular2/di";
import {reflector} from 'angular2/src/reflection/reflection';
import {ReflectionCapabilities} from 'angular2/src/reflection/reflection_capabilities';
import {getIntParameter,
  bindAction,
  microBenchmark} from 'angular2/src/test_lib/benchmark_util';
import {BrowserDomAdapter} from 'angular2/src/dom/browser_adapter';
var count = 0;
function setupReflector() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
}
export function main() {
  BrowserDomAdapter.makeCurrent();
  var iterations = getIntParameter('iterations');
  setupReflector();
  var bindings = [A, B, C, D, E];
  var injector = Injector.resolveAndCreate(bindings);
  var D_KEY = Key.get(D);
  var E_KEY = Key.get(E);
  var childInjector = injector.resolveAndCreateChild([]).resolveAndCreateChild([]).resolveAndCreateChild([]).resolveAndCreateChild([]).resolveAndCreateChild([]);
  var variousBindings = [A, bind(B).toClass(C), [D, [E]], bind(F).toValue(6)];
  var variousBindingsResolved = Injector.resolve(variousBindings);
  function getByToken() {
    for (var i = 0; i < iterations; ++i) {
      injector.get(D);
      injector.get(E);
    }
  }
  function getByKey() {
    for (var i = 0; i < iterations; ++i) {
      injector.get(D_KEY);
      injector.get(E_KEY);
    }
  }
  function getChild() {
    for (var i = 0; i < iterations; ++i) {
      childInjector.get(D);
      childInjector.get(E);
    }
  }
  function instantiate() {
    for (var i = 0; i < iterations; ++i) {
      var child = injector.resolveAndCreateChild([E]);
      child.get(E);
    }
  }
  function createVariety() {
    for (var i = 0; i < iterations; ++i) {
      Injector.resolveAndCreate(variousBindings);
    }
  }
  function createVarietyResolved() {
    for (var i = 0; i < iterations; ++i) {
      Injector.fromResolvedBindings(variousBindingsResolved);
    }
  }
  bindAction('#getByToken', () => microBenchmark('injectAvg', iterations, getByToken));
  bindAction('#getByKey', () => microBenchmark('injectAvg', iterations, getByKey));
  bindAction('#getChild', () => microBenchmark('injectAvg', iterations, getChild));
  bindAction('#instantiate', () => microBenchmark('injectAvg', iterations, instantiate));
  bindAction('#createVariety', () => microBenchmark('injectAvg', iterations, createVariety));
  bindAction('#createVarietyResolved', () => microBenchmark('injectAvg', iterations, createVarietyResolved));
}
class A {
  constructor() {
    count++;
  }
}
Object.defineProperty(A, "annotations", {get: function() {
    return [new Injectable()];
  }});
class B {
  constructor(a) {
    count++;
  }
}
Object.defineProperty(B, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(B, "parameters", {get: function() {
    return [[A]];
  }});
class C {
  constructor(b) {
    count++;
  }
}
Object.defineProperty(C, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(C, "parameters", {get: function() {
    return [[B]];
  }});
class D {
  constructor(c, b) {
    count++;
  }
}
Object.defineProperty(D, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(D, "parameters", {get: function() {
    return [[C], [B]];
  }});
class E {
  constructor(d, c) {
    count++;
  }
}
Object.defineProperty(E, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(E, "parameters", {get: function() {
    return [[D], [C]];
  }});
class F {
  constructor(e, d) {
    count++;
  }
}
Object.defineProperty(F, "annotations", {get: function() {
    return [new Injectable()];
  }});
Object.defineProperty(F, "parameters", {get: function() {
    return [[E], [D]];
  }});
//# sourceMappingURL=di_benchmark.js.map

//# sourceMappingURL=./di_benchmark.map