import {assert} from "rtts_assert/rtts_assert";
import {Map,
  List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {ResolvedBinding,
  Binding,
  BindingBuilder,
  bind} from './binding';
import {ProviderError,
  NoProviderError,
  AsyncBindingError,
  CyclicDependencyError,
  InstantiationError,
  InvalidBindingError} from './exceptions';
import {FunctionWrapper,
  Type,
  isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {Key} from './key';
var _constructing = new Object();
var _notFound = new Object();
class _Waiting {
  constructor(promise) {
    assert.argumentTypes(promise, Promise);
    this.promise = promise;
  }
}
Object.defineProperty(_Waiting, "parameters", {get: function() {
    return [[Promise]];
  }});
function _isWaiting(obj) {
  return assert.returnType((obj instanceof _Waiting), assert.type.boolean);
}
export class Injector {
  static resolve(bindings) {
    assert.argumentTypes(bindings, List);
    var resolvedBindings = _resolveBindings(bindings);
    var flatten = _flattenBindings(resolvedBindings, MapWrapper.create());
    return assert.returnType((_createListOfBindings(flatten)), assert.genericType(List, ResolvedBinding));
  }
  static resolveAndCreate(bindings, {defaultBindings = false} = {}) {
    assert.argumentTypes(bindings, List);
    return new Injector(Injector.resolve(bindings), null, defaultBindings);
  }
  static fromResolvedBindings(bindings, {defaultBindings = false} = {}) {
    assert.argumentTypes(bindings, assert.genericType(List, ResolvedBinding));
    return new Injector(bindings, null, defaultBindings);
  }
  constructor(bindings, parent, defaultBindings) {
    assert.argumentTypes(bindings, assert.genericType(List, ResolvedBinding), parent, Injector, defaultBindings, assert.type.boolean);
    this._bindings = bindings;
    this._instances = this._createInstances();
    this._parent = parent;
    this._defaultBindings = defaultBindings;
    this._asyncStrategy = new _AsyncInjectorStrategy(this);
    this._syncStrategy = new _SyncInjectorStrategy(this);
  }
  get(token) {
    return this._getByKey(Key.get(token), false, false, false);
  }
  getOptional(token) {
    return this._getByKey(Key.get(token), false, false, true);
  }
  asyncGet(token) {
    return this._getByKey(Key.get(token), true, false, false);
  }
  resolveAndCreateChild(bindings) {
    assert.argumentTypes(bindings, List);
    return assert.returnType((new Injector(Injector.resolve(bindings), this, false)), Injector);
  }
  createChildFromResolved(bindings) {
    assert.argumentTypes(bindings, assert.genericType(List, ResolvedBinding));
    return assert.returnType((new Injector(bindings, this, false)), Injector);
  }
  _createInstances() {
    return assert.returnType((ListWrapper.createFixedSize(Key.numberOfKeys + 1)), List);
  }
  _getByKey(key, returnPromise, returnLazy, optional) {
    if (returnLazy) {
      return () => this._getByKey(key, returnPromise, false, optional);
    }
    var strategy = returnPromise ? this._asyncStrategy : this._syncStrategy;
    var instance = strategy.readFromCache(key);
    if (instance !== _notFound)
      return instance;
    instance = strategy.instantiate(key);
    if (instance !== _notFound)
      return instance;
    if (isPresent(this._parent)) {
      return this._parent._getByKey(key, returnPromise, returnLazy, optional);
    }
    if (optional) {
      return null;
    } else {
      throw new NoProviderError(key);
    }
  }
  _resolveDependencies(key, binding, forceAsync) {
    try {
      var getDependency = (d) => this._getByKey(d.key, forceAsync || d.asPromise, d.lazy, d.optional);
      return assert.returnType((ListWrapper.map(binding.dependencies, getDependency)), List);
    } catch (e) {
      this._clear(key);
      if (e instanceof ProviderError)
        e.addKey(key);
      throw e;
    }
  }
  _getInstance(key) {
    assert.argumentTypes(key, Key);
    if (this._instances.length <= key.id)
      return null;
    return ListWrapper.get(this._instances, key.id);
  }
  _setInstance(key, obj) {
    assert.argumentTypes(key, Key, obj, assert.type.any);
    ListWrapper.set(this._instances, key.id, obj);
  }
  _getBinding(key) {
    assert.argumentTypes(key, Key);
    var binding = this._bindings.length <= key.id ? null : ListWrapper.get(this._bindings, key.id);
    if (isBlank(binding) && this._defaultBindings) {
      return bind(key.token).toClass(key.token).resolve();
    } else {
      return binding;
    }
  }
  _markAsConstructing(key) {
    assert.argumentTypes(key, Key);
    this._setInstance(key, _constructing);
  }
  _clear(key) {
    assert.argumentTypes(key, Key);
    this._setInstance(key, null);
  }
}
Object.defineProperty(Injector, "parameters", {get: function() {
    return [[assert.genericType(List, ResolvedBinding)], [Injector], [assert.type.boolean]];
  }});
Object.defineProperty(Injector.resolve, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(Injector.resolveAndCreate, "parameters", {get: function() {
    return [[List], []];
  }});
Object.defineProperty(Injector.fromResolvedBindings, "parameters", {get: function() {
    return [[assert.genericType(List, ResolvedBinding)], []];
  }});
Object.defineProperty(Injector.prototype.resolveAndCreateChild, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(Injector.prototype.createChildFromResolved, "parameters", {get: function() {
    return [[assert.genericType(List, ResolvedBinding)]];
  }});
Object.defineProperty(Injector.prototype._getByKey, "parameters", {get: function() {
    return [[Key], [assert.type.boolean], [assert.type.boolean], [assert.type.boolean]];
  }});
Object.defineProperty(Injector.prototype._resolveDependencies, "parameters", {get: function() {
    return [[Key], [ResolvedBinding], [assert.type.boolean]];
  }});
Object.defineProperty(Injector.prototype._getInstance, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._setInstance, "parameters", {get: function() {
    return [[Key], []];
  }});
Object.defineProperty(Injector.prototype._getBinding, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._markAsConstructing, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._clear, "parameters", {get: function() {
    return [[Key]];
  }});
class _SyncInjectorStrategy {
  constructor(injector) {
    assert.argumentTypes(injector, Injector);
    this.injector = injector;
  }
  readFromCache(key) {
    assert.argumentTypes(key, Key);
    if (key.token === Injector) {
      return this.injector;
    }
    var instance = this.injector._getInstance(key);
    if (instance === _constructing) {
      throw new CyclicDependencyError(key);
    } else if (isPresent(instance) && !_isWaiting(instance)) {
      return instance;
    } else {
      return _notFound;
    }
  }
  instantiate(key) {
    assert.argumentTypes(key, Key);
    var binding = this.injector._getBinding(key);
    if (isBlank(binding))
      return _notFound;
    if (binding.providedAsPromise)
      throw new AsyncBindingError(key);
    this.injector._markAsConstructing(key);
    var deps = this.injector._resolveDependencies(key, binding, false);
    return this._createInstance(key, binding, deps);
  }
  _createInstance(key, binding, deps) {
    assert.argumentTypes(key, Key, binding, ResolvedBinding, deps, List);
    try {
      var instance = FunctionWrapper.apply(binding.factory, deps);
      this.injector._setInstance(key, instance);
      return instance;
    } catch (e) {
      this.injector._clear(key);
      throw new InstantiationError(e, key);
    }
  }
}
Object.defineProperty(_SyncInjectorStrategy, "parameters", {get: function() {
    return [[Injector]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype._createInstance, "parameters", {get: function() {
    return [[Key], [ResolvedBinding], [List]];
  }});
class _AsyncInjectorStrategy {
  constructor(injector) {
    assert.argumentTypes(injector, Injector);
    this.injector = injector;
  }
  readFromCache(key) {
    assert.argumentTypes(key, Key);
    if (key.token === Injector) {
      return PromiseWrapper.resolve(this.injector);
    }
    var instance = this.injector._getInstance(key);
    if (instance === _constructing) {
      throw new CyclicDependencyError(key);
    } else if (_isWaiting(instance)) {
      return instance.promise;
    } else if (isPresent(instance)) {
      return PromiseWrapper.resolve(instance);
    } else {
      return _notFound;
    }
  }
  instantiate(key) {
    var binding = this.injector._getBinding(key);
    if (isBlank(binding))
      return _notFound;
    this.injector._markAsConstructing(key);
    var deps = this.injector._resolveDependencies(key, binding, true);
    var depsPromise = PromiseWrapper.all(deps);
    var promise = PromiseWrapper.then(depsPromise, null, (e) => this._errorHandler(key, e)).then((deps) => this._findOrCreate(key, binding, deps)).then((instance) => this._cacheInstance(key, instance));
    this.injector._setInstance(key, new _Waiting(promise));
    return promise;
  }
  _errorHandler(key, e) {
    assert.argumentTypes(key, Key, e, assert.type.any);
    if (e instanceof ProviderError)
      e.addKey(key);
    return assert.returnType((PromiseWrapper.reject(e)), Promise);
  }
  _findOrCreate(key, binding, deps) {
    assert.argumentTypes(key, Key, binding, ResolvedBinding, deps, List);
    try {
      var instance = this.injector._getInstance(key);
      if (!_isWaiting(instance))
        return instance;
      return FunctionWrapper.apply(binding.factory, deps);
    } catch (e) {
      this.injector._clear(key);
      throw new InstantiationError(e, key);
    }
  }
  _cacheInstance(key, instance) {
    this.injector._setInstance(key, instance);
    return instance;
  }
}
Object.defineProperty(_AsyncInjectorStrategy, "parameters", {get: function() {
    return [[Injector]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype._errorHandler, "parameters", {get: function() {
    return [[Key], []];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype._findOrCreate, "parameters", {get: function() {
    return [[Key], [ResolvedBinding], [List]];
  }});
function _resolveBindings(bindings) {
  assert.argumentTypes(bindings, List);
  var resolvedList = ListWrapper.createFixedSize(bindings.length);
  for (var i = 0; i < bindings.length; i++) {
    var unresolved = bindings[i];
    var resolved;
    if (unresolved instanceof ResolvedBinding) {
      resolved = unresolved;
    } else if (unresolved instanceof Type) {
      resolved = bind(unresolved).toClass(unresolved).resolve();
    } else if (unresolved instanceof Binding) {
      resolved = unresolved.resolve();
    } else if (unresolved instanceof List) {
      resolved = _resolveBindings(unresolved);
    } else if (unresolved instanceof BindingBuilder) {
      throw new InvalidBindingError(unresolved.token);
    } else {
      throw new InvalidBindingError(unresolved);
    }
    resolvedList[i] = resolved;
  }
  return assert.returnType((resolvedList), List);
}
Object.defineProperty(_resolveBindings, "parameters", {get: function() {
    return [[List]];
  }});
function _createListOfBindings(flattenedBindings) {
  var bindings = ListWrapper.createFixedSize(Key.numberOfKeys + 1);
  MapWrapper.forEach(flattenedBindings, (v, keyId) => bindings[keyId] = v);
  return assert.returnType((bindings), List);
}
function _flattenBindings(bindings, res) {
  assert.argumentTypes(bindings, List, res, Map);
  ListWrapper.forEach(bindings, function(b) {
    if (b instanceof ResolvedBinding) {
      MapWrapper.set(res, b.key.id, b);
    } else if (b instanceof List) {
      _flattenBindings(b, res);
    }
  });
  return res;
}
Object.defineProperty(_flattenBindings, "parameters", {get: function() {
    return [[List], [Map]];
  }});
//# sourceMappingURL=injector.js.map

//# sourceMappingURL=./injector.map