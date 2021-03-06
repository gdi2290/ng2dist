System.register(["rtts_assert/rtts_assert"], function($__export) {
  "use strict";
  var assert,
      DirectiveRecord;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }],
    execute: function() {
      DirectiveRecord = $__export("DirectiveRecord", (function() {
        var DirectiveRecord = function DirectiveRecord(elementIndex, directiveIndex, callOnAllChangesDone, callOnChange) {
          assert.argumentTypes(elementIndex, assert.type.number, directiveIndex, assert.type.number, callOnAllChangesDone, assert.type.boolean, callOnChange, assert.type.boolean);
          this.elementIndex = elementIndex;
          this.directiveIndex = directiveIndex;
          this.callOnAllChangesDone = callOnAllChangesDone;
          this.callOnChange = callOnChange;
        };
        return ($traceurRuntime.createClass)(DirectiveRecord, {get name() {
            return (this.elementIndex + "_" + this.directiveIndex);
          }}, {});
      }()));
      Object.defineProperty(DirectiveRecord, "parameters", {get: function() {
          return [[assert.type.number], [assert.type.number], [assert.type.boolean], [assert.type.boolean]];
        }});
    }
  };
});
//# sourceMappingURL=directive_record.es6.map

//# sourceMappingURL=./directive_record.js.map