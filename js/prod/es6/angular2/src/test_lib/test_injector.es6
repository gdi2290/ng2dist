import {bind} from 'angular2/di';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {Reflector,
  reflector} from 'angular2/src/reflection/reflection';
import {Parser,
  Lexer,
  ChangeDetection,
  dynamicChangeDetection} from 'angular2/change_detection';
import {ExceptionHandler} from 'angular2/src/core/exception_handler';
import {TemplateLoader} from 'angular2/src/render/dom/compiler/template_loader';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {ShadowDomStrategy} from 'angular2/src/render/dom/shadow_dom/shadow_dom_strategy';
import {EmulatedUnscopedShadowDomStrategy} from 'angular2/src/render/dom/shadow_dom/emulated_unscoped_shadow_dom_strategy';
import {XHR} from 'angular2/src/services/xhr';
import {ComponentUrlMapper} from 'angular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'angular2/src/services/url_resolver';
import {StyleUrlResolver} from 'angular2/src/render/dom/shadow_dom/style_url_resolver';
import {StyleInliner} from 'angular2/src/render/dom/shadow_dom/style_inliner';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
import {DOM} from 'angular2/src/dom/dom_adapter';
import {appDocumentToken} from 'angular2/src/core/application_tokens';
import {EventManager,
  DomEventsPlugin} from 'angular2/src/render/dom/events/event_manager';
import {MockTemplateResolver} from 'angular2/src/mock/template_resolver_mock';
import {MockXHR} from 'angular2/src/mock/xhr_mock';
import {MockVmTurnZone} from 'angular2/src/mock/vm_turn_zone_mock';
import {TestBed} from './test_bed';
import {Injector} from 'angular2/di';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {FunctionWrapper} from 'angular2/src/facade/lang';
import {ViewFactory,
  VIEW_POOL_CAPACITY} from 'angular2/src/core/compiler/view_factory';
import {ProtoViewFactory} from 'angular2/src/core/compiler/proto_view_factory';
import {Renderer} from 'angular2/src/render/api';
import {DirectDomRenderer} from 'angular2/src/render/dom/direct_dom_renderer';
import * as rc from 'angular2/src/render/dom/compiler/compiler';
import * as rvf from 'angular2/src/render/dom/view/view_factory';
function _getRootBindings() {
  return [bind(Reflector).toValue(reflector)];
}
function _getAppBindings() {
  var appDoc;
  try {
    appDoc = DOM.defaultDoc();
  } catch (e) {
    appDoc = null;
  }
  return [bind(appDocumentToken).toValue(appDoc), bind(ShadowDomStrategy).toFactory((styleUrlResolver, doc) => new EmulatedUnscopedShadowDomStrategy(styleUrlResolver, doc.head), [StyleUrlResolver, appDocumentToken]), bind(Renderer).toClass(DirectDomRenderer), bind(rc.Compiler).toClass(rc.DefaultCompiler), rvf.ViewFactory, bind(rvf.VIEW_POOL_CAPACITY).toValue(500), ProtoViewFactory, ViewFactory, bind(VIEW_POOL_CAPACITY).toValue(500), Compiler, CompilerCache, bind(TemplateResolver).toClass(MockTemplateResolver), bind(ChangeDetection).toValue(dynamicChangeDetection), TemplateLoader, DynamicComponentLoader, DirectiveMetadataReader, Parser, Lexer, ExceptionHandler, bind(XHR).toClass(MockXHR), ComponentUrlMapper, UrlResolver, StyleUrlResolver, StyleInliner, TestBed, bind(VmTurnZone).toClass(MockVmTurnZone), bind(EventManager).toFactory((zone) => {
    var plugins = [new DomEventsPlugin()];
    return new EventManager(plugins, zone);
  }, [VmTurnZone])];
}
export function createTestInjector(bindings) {
  var rootInjector = Injector.resolveAndCreate(_getRootBindings());
  return rootInjector.resolveAndCreateChild(ListWrapper.concat(_getAppBindings(), bindings));
}
Object.defineProperty(createTestInjector, "parameters", {get: function() {
    return [[List]];
  }});
export function inject(tokens, fn) {
  return new FunctionWithParamTokens(tokens, fn);
}
Object.defineProperty(inject, "parameters", {get: function() {
    return [[List], [Function]];
  }});
export class FunctionWithParamTokens {
  constructor(tokens, fn) {
    this._tokens = tokens;
    this._fn = fn;
  }
  execute(injector) {
    var params = ListWrapper.map(this._tokens, (t) => injector.get(t));
    FunctionWrapper.apply(this._fn, params);
  }
}
Object.defineProperty(FunctionWithParamTokens, "parameters", {get: function() {
    return [[List], [Function]];
  }});
Object.defineProperty(FunctionWithParamTokens.prototype.execute, "parameters", {get: function() {
    return [[Injector]];
  }});
//# sourceMappingURL=test_injector.js.map

//# sourceMappingURL=./test_injector.map