import {bind} from 'angular2/di';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {ABSTRACT,
  BaseException} from 'angular2/src/facade/lang';
import {StringMap} from 'angular2/src/facade/collection';
export class Metric {
  static bindTo(delegateToken) {
    return [bind(Metric).toFactory((delegate) => delegate, [delegateToken])];
  }
  beginMeasure() {
    throw new BaseException('NYI');
  }
  endMeasure(restart) {
    throw new BaseException('NYI');
  }
  describe() {
    throw new BaseException('NYI');
  }
}
Object.defineProperty(Metric, "annotations", {get: function() {
    return [new ABSTRACT()];
  }});
Object.defineProperty(Metric.prototype.endMeasure, "parameters", {get: function() {
    return [[assert.type.boolean]];
  }});
//# sourceMappingURL=metric.js.map

//# sourceMappingURL=./metric.map