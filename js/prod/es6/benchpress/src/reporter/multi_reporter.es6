import {bind,
  Injector,
  OpaqueToken} from 'angular2/di';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {MeasureValues} from '../measure_values';
import {Reporter} from '../reporter';
export class MultiReporter extends Reporter {
  static createBindings(childTokens) {
    return [bind(_CHILDREN).toAsyncFactory((injector) => PromiseWrapper.all(ListWrapper.map(childTokens, (token) => injector.asyncGet(token))), [Injector]), bind(MultiReporter).toFactory((children) => new MultiReporter(children), [_CHILDREN])];
  }
  constructor(reporters) {
    super();
    this._reporters = reporters;
  }
  reportMeasureValues(values) {
    return PromiseWrapper.all(ListWrapper.map(this._reporters, (reporter) => reporter.reportMeasureValues(values)));
  }
  reportSample(completeSample, validSample) {
    return PromiseWrapper.all(ListWrapper.map(this._reporters, (reporter) => reporter.reportSample(completeSample, validSample)));
  }
}
Object.defineProperty(MultiReporter.prototype.reportMeasureValues, "parameters", {get: function() {
    return [[MeasureValues]];
  }});
Object.defineProperty(MultiReporter.prototype.reportSample, "parameters", {get: function() {
    return [[assert.genericType(List, MeasureValues)], [assert.genericType(List, MeasureValues)]];
  }});
var _CHILDREN = new OpaqueToken('MultiReporter.children');
//# sourceMappingURL=multi_reporter.js.map

//# sourceMappingURL=./multi_reporter.map