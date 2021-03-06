System.register(["angular2/di", "angular2/src/facade/async", "angular2/src/facade/lang", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var bind,
      Promise,
      PromiseWrapper,
      ABSTRACT,
      BaseException,
      StringMap,
      Metric;
  return {
    setters: [function($__m) {
      bind = $__m.bind;
    }, function($__m) {
      Promise = $__m.Promise;
      PromiseWrapper = $__m.PromiseWrapper;
    }, function($__m) {
      ABSTRACT = $__m.ABSTRACT;
      BaseException = $__m.BaseException;
    }, function($__m) {
      StringMap = $__m.StringMap;
    }],
    execute: function() {
      Metric = $__export("Metric", (function() {
        var Metric = function Metric() {
          ;
        };
        return ($traceurRuntime.createClass)(Metric, {
          beginMeasure: function() {
            throw new BaseException('NYI');
          },
          endMeasure: function(restart) {
            throw new BaseException('NYI');
          },
          describe: function() {
            throw new BaseException('NYI');
          }
        }, {bindTo: function(delegateToken) {
            return [bind(Metric).toFactory((function(delegate) {
              return delegate;
            }), [delegateToken])];
          }});
      }()));
      Object.defineProperty(Metric, "annotations", {get: function() {
          return [new ABSTRACT()];
        }});
      Object.defineProperty(Metric.prototype.endMeasure, "parameters", {get: function() {
          return [[assert.type.boolean]];
        }});
    }
  };
});
//# sourceMappingURL=metric.es6.map

//# sourceMappingURL=./metric.js.map