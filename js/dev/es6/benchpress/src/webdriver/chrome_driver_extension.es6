import {assert} from "rtts_assert/rtts_assert";
import {bind} from 'angular2/di';
import {ListWrapper,
  StringMapWrapper,
  StringMap} from 'angular2/src/facade/collection';
import {Json,
  isPresent,
  isBlank,
  RegExpWrapper,
  StringWrapper,
  BaseException,
  NumberWrapper} from 'angular2/src/facade/lang';
import {WebDriverExtension,
  PerfLogFeatures} from '../web_driver_extension';
import {WebDriverAdapter} from '../web_driver_adapter';
import {Promise} from 'angular2/src/facade/async';
export class ChromeDriverExtension extends WebDriverExtension {
  static get BINDINGS() {
    return _BINDINGS;
  }
  constructor(driver) {
    assert.argumentTypes(driver, WebDriverAdapter);
    super();
    this._driver = driver;
  }
  gc() {
    return this._driver.executeScript('window.gc()');
  }
  timeBegin(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((this._driver.executeScript(`console.time('${name}');`)), Promise);
  }
  timeEnd(name, restartName = null) {
    assert.argumentTypes(name, assert.type.string, restartName, assert.type.string);
    var script = `console.timeEnd('${name}');`;
    if (isPresent(restartName)) {
      script += `console.time('${restartName}');`;
    }
    return assert.returnType((this._driver.executeScript(script)), Promise);
  }
  readPerfLog() {
    return this._driver.executeScript('1+1').then((_) => this._driver.logs('performance')).then((entries) => {
      var events = [];
      ListWrapper.forEach(entries, function(entry) {
        var message = Json.parse(entry['message'])['message'];
        if (StringWrapper.equals(message['method'], 'Tracing.dataCollected')) {
          ListWrapper.push(events, message['params']);
        }
        if (StringWrapper.equals(message['method'], 'Tracing.bufferUsage')) {
          throw new BaseException('The DevTools trace buffer filled during the test!');
        }
      });
      return this._convertPerfRecordsToEvents(events);
    });
  }
  _convertPerfRecordsToEvents(chromeEvents, normalizedEvents = null) {
    if (isBlank(normalizedEvents)) {
      normalizedEvents = [];
    }
    var majorGCPids = {};
    chromeEvents.forEach((event) => {
      var cat = event['cat'];
      var name = event['name'];
      var args = event['args'];
      var pid = event['pid'];
      var ph = event['ph'];
      if (StringWrapper.equals(cat, 'disabled-by-default-devtools.timeline')) {
        if (StringWrapper.equals(name, 'FunctionCall') && (isBlank(args) || isBlank(args['data']) || !StringWrapper.equals(args['data']['scriptName'], 'InjectedScript'))) {
          ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': 'script'}));
        } else if (StringWrapper.equals(name, 'RecalculateStyles') || StringWrapper.equals(name, 'Layout') || StringWrapper.equals(name, 'UpdateLayerTree') || StringWrapper.equals(name, 'Paint') || StringWrapper.equals(name, 'Rasterize') || StringWrapper.equals(name, 'CompositeLayers')) {
          ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': 'render'}));
        } else if (StringWrapper.equals(name, 'GCEvent')) {
          var normArgs = {'usedHeapSize': isPresent(args['usedHeapSizeAfter']) ? args['usedHeapSizeAfter'] : args['usedHeapSizeBefore']};
          if (StringWrapper.equals(event['ph'], 'E')) {
            normArgs['majorGc'] = isPresent(majorGCPids[pid]) && majorGCPids[pid];
          }
          majorGCPids[pid] = false;
          ListWrapper.push(normalizedEvents, normalizeEvent(event, {
            'name': 'gc',
            'args': normArgs
          }));
        }
      } else if (StringWrapper.equals(cat, 'blink.console')) {
        ListWrapper.push(normalizedEvents, normalizeEvent(event, {'name': name}));
      } else if (StringWrapper.equals(cat, 'v8')) {
        if (StringWrapper.equals(name, 'majorGC')) {
          if (StringWrapper.equals(ph, 'B')) {
            majorGCPids[pid] = true;
          }
        }
      }
    });
    return normalizedEvents;
  }
  perfLogFeatures() {
    return assert.returnType((new PerfLogFeatures({
      render: true,
      gc: true
    })), PerfLogFeatures);
  }
  supports(capabilities) {
    assert.argumentTypes(capabilities, StringMap);
    return assert.returnType((StringWrapper.equals(capabilities['browserName'].toLowerCase(), 'chrome')), assert.type.boolean);
  }
}
Object.defineProperty(ChromeDriverExtension, "parameters", {get: function() {
    return [[WebDriverAdapter]];
  }});
Object.defineProperty(ChromeDriverExtension.prototype.timeBegin, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(ChromeDriverExtension.prototype.timeEnd, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(ChromeDriverExtension.prototype.supports, "parameters", {get: function() {
    return [[StringMap]];
  }});
function normalizeEvent(chromeEvent, data) {
  var ph = chromeEvent['ph'];
  if (StringWrapper.equals(ph, 'S')) {
    ph = 'b';
  } else if (StringWrapper.equals(ph, 'F')) {
    ph = 'e';
  }
  var result = {
    'pid': chromeEvent['pid'],
    'ph': ph,
    'cat': 'timeline',
    'ts': chromeEvent['ts'] / 1000
  };
  if (chromeEvent['ph'] === 'X') {
    var dur = chromeEvent['dur'];
    if (isBlank(dur)) {
      dur = chromeEvent['tdur'];
    }
    result['dur'] = isBlank(dur) ? 0.0 : dur / 1000;
  }
  StringMapWrapper.forEach(data, (value, prop) => {
    result[prop] = value;
  });
  return result;
}
var _BINDINGS = [bind(ChromeDriverExtension).toFactory((driver) => new ChromeDriverExtension(driver), [WebDriverAdapter])];
//# sourceMappingURL=chrome_driver_extension.js.map

//# sourceMappingURL=./chrome_driver_extension.map