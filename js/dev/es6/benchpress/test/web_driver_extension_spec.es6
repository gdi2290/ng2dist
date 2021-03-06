import {assert} from "rtts_assert/rtts_assert";
import {afterEach,
  AsyncTestCompleter,
  beforeEach,
  ddescribe,
  describe,
  expect,
  iit,
  inject,
  it,
  xit} from 'angular2/test_lib';
import {StringMap,
  ListWrapper} from 'angular2/src/facade/collection';
import {isPresent,
  StringWrapper} from 'angular2/src/facade/lang';
import {PromiseWrapper} from 'angular2/src/facade/async';
import {WebDriverExtension,
  bind,
  Injector,
  Options} from 'benchpress/common';
export function main() {
  function createExtension(ids, caps) {
    return Injector.resolveAndCreate([ListWrapper.map(ids, (id) => bind(id).toValue(new MockExtension(id))), bind(Options.CAPABILITIES).toValue(caps), WebDriverExtension.bindTo(ids)]).asyncGet(WebDriverExtension);
  }
  describe('WebDriverExtension.bindTo', () => {
    it('should bind the extension that matches the capabilities', inject([AsyncTestCompleter], (async) => {
      createExtension(['m1', 'm2', 'm3'], {'browser': 'm2'}).then((m) => {
        expect(m.id).toEqual('m2');
        async.done();
      });
    }));
    it('should throw if there is no match', inject([AsyncTestCompleter], (async) => {
      PromiseWrapper.catchError(createExtension(['m1'], {'browser': 'm2'}), (err) => {
        expect(isPresent(err)).toBe(true);
        async.done();
      });
    }));
  });
}
class MockExtension extends WebDriverExtension {
  constructor(id) {
    super();
    this.id = id;
  }
  supports(capabilities) {
    assert.argumentTypes(capabilities, StringMap);
    return assert.returnType((StringWrapper.equals(capabilities['browser'], this.id)), assert.type.boolean);
  }
}
Object.defineProperty(MockExtension.prototype.supports, "parameters", {get: function() {
    return [[StringMap]];
  }});
//# sourceMappingURL=web_driver_extension_spec.js.map

//# sourceMappingURL=./web_driver_extension_spec.map