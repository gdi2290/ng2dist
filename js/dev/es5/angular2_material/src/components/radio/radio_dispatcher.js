System.register(["rtts_assert/rtts_assert", "angular2/src/facade/collection"], function($__export) {
  "use strict";
  var assert,
      ListWrapper,
      MdRadioDispatcher;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      ListWrapper = $__m.ListWrapper;
    }],
    execute: function() {
      MdRadioDispatcher = $__export("MdRadioDispatcher", (function() {
        var MdRadioDispatcher = function MdRadioDispatcher() {
          this.listeners_ = [];
        };
        return ($traceurRuntime.createClass)(MdRadioDispatcher, {
          notify: function(name) {
            ListWrapper.forEach(this.listeners_, (function(f) {
              return f(name);
            }));
          },
          listen: function(listener) {
            ListWrapper.push(this.listeners_, listener);
          }
        }, {});
      }()));
      Object.defineProperty(MdRadioDispatcher.prototype.notify, "parameters", {get: function() {
          return [[assert.type.string]];
        }});
    }
  };
});
//# sourceMappingURL=radio_dispatcher.es6.map

//# sourceMappingURL=./radio_dispatcher.js.map