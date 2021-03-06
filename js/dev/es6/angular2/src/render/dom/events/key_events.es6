import {assert} from "rtts_assert/rtts_assert";
import {DOM} from 'angular2/src/dom/dom_adapter';
import {isPresent,
  isBlank,
  StringWrapper,
  RegExpWrapper,
  BaseException,
  NumberWrapper} from 'angular2/src/facade/lang';
import {StringMapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {EventManagerPlugin} from './event_manager';
var modifierKeys = ['alt', 'control', 'meta', 'shift'];
var modifierKeyGetters = {
  'alt': (event) => event.altKey,
  'control': (event) => event.ctrlKey,
  'meta': (event) => event.metaKey,
  'shift': (event) => event.shiftKey
};
export class KeyEventsPlugin extends EventManagerPlugin {
  constructor() {
    super();
  }
  supports(eventName) {
    assert.argumentTypes(eventName, assert.type.string);
    return assert.returnType((isPresent(KeyEventsPlugin.parseEventName(eventName))), assert.type.boolean);
  }
  addEventListener(element, eventName, handler, shouldSupportBubble) {
    assert.argumentTypes(element, assert.type.any, eventName, assert.type.string, handler, Function, shouldSupportBubble, assert.type.boolean);
    var parsedEvent = KeyEventsPlugin.parseEventName(eventName);
    var outsideHandler = KeyEventsPlugin.eventCallback(element, shouldSupportBubble, StringMapWrapper.get(parsedEvent, 'fullKey'), handler, this.manager.getZone());
    this.manager.getZone().runOutsideAngular(() => {
      DOM.on(element, StringMapWrapper.get(parsedEvent, 'domEventName'), outsideHandler);
    });
  }
  static parseEventName(eventName) {
    assert.argumentTypes(eventName, assert.type.string);
    eventName = eventName.toLowerCase();
    var parts = eventName.split('.');
    var domEventName = ListWrapper.removeAt(parts, 0);
    if ((parts.length === 0) || !(StringWrapper.equals(domEventName, 'keydown') || StringWrapper.equals(domEventName, 'keyup'))) {
      return null;
    }
    var key = ListWrapper.removeLast(parts);
    var fullKey = '';
    ListWrapper.forEach(modifierKeys, (modifierName) => {
      if (ListWrapper.contains(parts, modifierName)) {
        ListWrapper.remove(parts, modifierName);
        fullKey += modifierName + '.';
      }
    });
    fullKey += key;
    if (parts.length != 0 || key.length === 0) {
      return null;
    }
    return {
      'domEventName': domEventName,
      'fullKey': fullKey
    };
  }
  static getEventFullKey(event) {
    var fullKey = '';
    var key = DOM.getEventKey(event);
    key = key.toLowerCase();
    if (StringWrapper.equals(key, ' ')) {
      key = 'space';
    } else if (StringWrapper.equals(key, '.')) {
      key = 'dot';
    }
    ListWrapper.forEach(modifierKeys, (modifierName) => {
      if (modifierName != key) {
        var modifierGetter = StringMapWrapper.get(modifierKeyGetters, modifierName);
        if (modifierGetter(event)) {
          fullKey += modifierName + '.';
        }
      }
    });
    fullKey += key;
    return assert.returnType((fullKey), assert.type.string);
  }
  static eventCallback(element, shouldSupportBubble, fullKey, handler, zone) {
    return (event) => {
      var correctElement = shouldSupportBubble || event.target === element;
      if (correctElement && KeyEventsPlugin.getEventFullKey(event) === fullKey) {
        zone.run(() => handler(event));
      }
    };
  }
}
Object.defineProperty(KeyEventsPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(KeyEventsPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[], [assert.type.string], [Function], [assert.type.boolean]];
  }});
Object.defineProperty(KeyEventsPlugin.parseEventName, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
//# sourceMappingURL=key_events.js.map

//# sourceMappingURL=./key_events.map