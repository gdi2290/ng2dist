System.register(["angular2/test_lib", "angular2/forms"], function($__export) {
  "use strict";
  var ddescribe,
      describe,
      it,
      iit,
      xit,
      expect,
      beforeEach,
      afterEach,
      el,
      ControlGroup,
      Control,
      Validators;
  function main() {
    function validator(key, error) {
      return function(c) {
        var r = {};
        r[key] = error;
        return r;
      };
    }
    Object.defineProperty(validator, "parameters", {get: function() {
        return [[assert.type.string], [assert.type.any]];
      }});
    describe("Validators", (function() {
      describe("required", (function() {
        it("should error on an empty string", (function() {
          expect(Validators.required(new Control(""))).toEqual({"required": true});
        }));
        it("should error on null", (function() {
          expect(Validators.required(new Control(null))).toEqual({"required": true});
        }));
        it("should not error on a non-empty string", (function() {
          expect(Validators.required(new Control("not empty"))).toEqual(null);
        }));
      }));
      describe("compose", (function() {
        it("should collect errors from all the validators", (function() {
          var c = Validators.compose([validator("a", true), validator("b", true)]);
          expect(c(new Control(""))).toEqual({
            "a": true,
            "b": true
          });
        }));
        it("should run validators left to right", (function() {
          var c = Validators.compose([validator("a", 1), validator("a", 2)]);
          expect(c(new Control(""))).toEqual({"a": 2});
        }));
        it("should return null when no errors", (function() {
          var c = Validators.compose([Validators.nullValidator, Validators.nullValidator]);
          expect(c(new Control(""))).toEqual(null);
        }));
      }));
      describe("controlGroupValidator", (function() {
        it("should collect errors from the child controls", (function() {
          var one = new Control("one", validator("a", true));
          var two = new Control("one", validator("b", true));
          var g = new ControlGroup({
            "one": one,
            "two": two
          });
          expect(Validators.group(g)).toEqual({
            "a": [one],
            "b": [two]
          });
        }));
        it("should not include controls that have no errors", (function() {
          var one = new Control("one", validator("a", true));
          var two = new Control("two");
          var g = new ControlGroup({
            "one": one,
            "two": two
          });
          expect(Validators.group(g)).toEqual({"a": [one]});
        }));
        it("should return null when no errors", (function() {
          var g = new ControlGroup({"one": new Control("one")});
          expect(Validators.group(g)).toEqual(null);
        }));
      }));
    }));
  }
  $__export("main", main);
  return {
    setters: [function($__m) {
      ddescribe = $__m.ddescribe;
      describe = $__m.describe;
      it = $__m.it;
      iit = $__m.iit;
      xit = $__m.xit;
      expect = $__m.expect;
      beforeEach = $__m.beforeEach;
      afterEach = $__m.afterEach;
      el = $__m.el;
    }, function($__m) {
      ControlGroup = $__m.ControlGroup;
      Control = $__m.Control;
      Validators = $__m.Validators;
    }],
    execute: function() {
    }
  };
});
//# sourceMappingURL=validators_spec.es6.map

//# sourceMappingURL=./validators_spec.js.map