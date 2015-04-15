import {isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {SetterFn} from 'angular2/src/reflection/types';
import {AST} from './parser/ast';
import {DirectiveRecord} from './directive_record';
const DIRECTIVE = "directive";
const ELEMENT = "element";
const TEXT_NODE = "textNode";
export class BindingRecord {
  constructor(mode, ast, elementIndex, propertyName, setter, directiveRecord) {
    this.mode = mode;
    this.ast = ast;
    this.elementIndex = elementIndex;
    this.propertyName = propertyName;
    this.setter = setter;
    this.directiveRecord = directiveRecord;
  }
  callOnChange() {
    return isPresent(this.directiveRecord) && this.directiveRecord.callOnChange;
  }
  isDirective() {
    return this.mode === DIRECTIVE;
  }
  isElement() {
    return this.mode === ELEMENT;
  }
  isTextNode() {
    return this.mode === TEXT_NODE;
  }
  static createForDirective(ast, propertyName, setter, directiveRecord) {
    return new BindingRecord(DIRECTIVE, ast, 0, propertyName, setter, directiveRecord);
  }
  static createForElement(ast, elementIndex, propertyName) {
    return new BindingRecord(ELEMENT, ast, elementIndex, propertyName, null, null);
  }
  static createForTextNode(ast, elementIndex) {
    return new BindingRecord(TEXT_NODE, ast, elementIndex, null, null, null);
  }
}
Object.defineProperty(BindingRecord, "parameters", {get: function() {
    return [[assert.type.string], [AST], [assert.type.number], [assert.type.string], [SetterFn], [DirectiveRecord]];
  }});
Object.defineProperty(BindingRecord.createForDirective, "parameters", {get: function() {
    return [[AST], [assert.type.string], [SetterFn], [DirectiveRecord]];
  }});
Object.defineProperty(BindingRecord.createForElement, "parameters", {get: function() {
    return [[AST], [assert.type.number], [assert.type.string]];
  }});
Object.defineProperty(BindingRecord.createForTextNode, "parameters", {get: function() {
    return [[AST], [assert.type.number]];
  }});
//# sourceMappingURL=binding_record.js.map

//# sourceMappingURL=./binding_record.map