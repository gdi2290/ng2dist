import {bind} from 'angular2/di';
import {ListWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {Json,
  isPresent,
  isBlank,
  RegExpWrapper,
  StringWrapper,
  BaseException} from 'angular2/src/facade/lang';
import {WebDriverExtension,
  PerfLogFeatures} from '../web_driver_extension';
import {WebDriverAdapter} from '../web_driver_adapter';
import {Promise} from 'angular2/src/facade/async';
export class IOsDriverExtension extends WebDriverExtension {
  static get BINDINGS() {
    return _BINDINGS;
  }
  constructor(driver) {
    super();
    this._driver = driver;
  }
  gc() {
    throw new BaseException('Force GC is not supported on iOS');
  }
  timeBegin(name) {
    return this._driver.executeScript(`console.time('${name}');`);
  }
  timeEnd(name, restartName = null) {
    var script = `console.timeEnd('${name}');`;
    if (isPresent(restartName)) {
      script += `console.time('${restartName}');`;
    }
    return this._driver.executeScript(script);
  }
  readPerfLog() {
    return this._driver.executeScript('1+1').then((_) => this._driver.logs('performance')).then((entries) => {
      var records = [];
      ListWrapper.forEach(entries, function(entry) {
        var message = Json.parse(entry['message'])['message'];
        if (StringWrapper.equals(message['method'], 'Timeline.eventRecorded')) {
          ListWrapper.push(records, message['params']['record']);
        }
      });
      return this._convertPerfRecordsToEvents(records);
    });
  }
  _convertPerfRecordsToEvents(records, events = null) {
    if (isBlank(events)) {
      events = [];
    }
    records.forEach((record) => {
      var endEvent = null;
      var type = record['type'];
      var data = record['data'];
      var startTime = record['startTime'];
      var endTime = record['endTime'];
      if (StringWrapper.equals(type, 'FunctionCall') && (isBlank(data) || !StringWrapper.equals(data['scriptName'], 'InjectedScript'))) {
        ListWrapper.push(events, createStartEvent('script', startTime));
        endEvent = createEndEvent('script', endTime);
      } else if (StringWrapper.equals(type, 'Time')) {
        ListWrapper.push(events, createMarkStartEvent(data['message'], startTime));
      } else if (StringWrapper.equals(type, 'TimeEnd')) {
        ListWrapper.push(events, createMarkEndEvent(data['message'], startTime));
      } else if (StringWrapper.equals(type, 'RecalculateStyles') || StringWrapper.equals(type, 'Layout') || StringWrapper.equals(type, 'UpdateLayerTree') || StringWrapper.equals(type, 'Paint') || StringWrapper.equals(type, 'Rasterize') || StringWrapper.equals(type, 'CompositeLayers')) {
        ListWrapper.push(events, createStartEvent('render', startTime));
        endEvent = createEndEvent('render', endTime);
      }
      if (isPresent(record['children'])) {
        this._convertPerfRecordsToEvents(record['children'], events);
      }
      if (isPresent(endEvent)) {
        ListWrapper.push(events, endEvent);
      }
    });
    return events;
  }
  perfLogFeatures() {
    return new PerfLogFeatures({render: true});
  }
  supports(capabilities) {
    return StringWrapper.equals(capabilities['browserName'].toLowerCase(), 'safari');
  }
}
Object.defineProperty(IOsDriverExtension, "parameters", {get: function() {
    return [[WebDriverAdapter]];
  }});
Object.defineProperty(IOsDriverExtension.prototype.timeBegin, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(IOsDriverExtension.prototype.timeEnd, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(IOsDriverExtension.prototype.supports, "parameters", {get: function() {
    return [[StringMap]];
  }});
function createEvent(ph, name, time, args = null) {
  var result = {
    'cat': 'timeline',
    'name': name,
    'ts': time,
    'ph': ph,
    'pid': 'pid0'
  };
  if (isPresent(args)) {
    result['args'] = args;
  }
  return result;
}
function createStartEvent(name, time, args = null) {
  return createEvent('B', name, time, args);
}
function createEndEvent(name, time, args = null) {
  return createEvent('E', name, time, args);
}
function createMarkStartEvent(name, time) {
  return createEvent('b', name, time);
}
function createMarkEndEvent(name, time) {
  return createEvent('e', name, time);
}
var _BINDINGS = [bind(IOsDriverExtension).toFactory((driver) => new IOsDriverExtension(driver), [WebDriverAdapter])];
//# sourceMappingURL=ios_driver_extension.js.map

//# sourceMappingURL=./ios_driver_extension.map