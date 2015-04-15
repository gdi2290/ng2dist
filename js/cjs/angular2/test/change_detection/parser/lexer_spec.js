'use strict'; var parse5Adapter = require('angular2/src/dom/parse5_adapter'); parse5Adapter.Parse5DomAdapter.makeCurrent();
Object.defineProperties(module.exports, {
  main: {get: function() {
      return main;
    }},
  __esModule: {value: true}
});
var $__angular2_47_test_95_lib__,
    $__angular2_47_src_47_change_95_detection_47_parser_47_lexer__,
    $__angular2_47_src_47_facade_47_collection__,
    $__angular2_47_src_47_facade_47_lang__;
var $__0 = ($__angular2_47_test_95_lib__ = require("angular2/test_lib"), $__angular2_47_test_95_lib__ && $__angular2_47_test_95_lib__.__esModule && $__angular2_47_test_95_lib__ || {default: $__angular2_47_test_95_lib__}),
    describe = $__0.describe,
    it = $__0.it,
    expect = $__0.expect;
var $__1 = ($__angular2_47_src_47_change_95_detection_47_parser_47_lexer__ = require("angular2/src/change_detection/parser/lexer"), $__angular2_47_src_47_change_95_detection_47_parser_47_lexer__ && $__angular2_47_src_47_change_95_detection_47_parser_47_lexer__.__esModule && $__angular2_47_src_47_change_95_detection_47_parser_47_lexer__ || {default: $__angular2_47_src_47_change_95_detection_47_parser_47_lexer__}),
    Lexer = $__1.Lexer,
    Token = $__1.Token;
var $__2 = ($__angular2_47_src_47_facade_47_collection__ = require("angular2/src/facade/collection"), $__angular2_47_src_47_facade_47_collection__ && $__angular2_47_src_47_facade_47_collection__.__esModule && $__angular2_47_src_47_facade_47_collection__ || {default: $__angular2_47_src_47_facade_47_collection__}),
    List = $__2.List,
    ListWrapper = $__2.ListWrapper;
var $__3 = ($__angular2_47_src_47_facade_47_lang__ = require("angular2/src/facade/lang"), $__angular2_47_src_47_facade_47_lang__ && $__angular2_47_src_47_facade_47_lang__.__esModule && $__angular2_47_src_47_facade_47_lang__ || {default: $__angular2_47_src_47_facade_47_lang__}),
    StringWrapper = $__3.StringWrapper,
    int = $__3.int;
function lex(text) {
  return new Lexer().tokenize(text);
}
Object.defineProperty(lex, "parameters", {get: function() {
    return [[$traceurRuntime.type.string]];
  }});
function expectToken(token, index) {
  expect(token instanceof Token).toBe(true);
  expect(token.index).toEqual(index);
}
function expectCharacterToken(token, index, character) {
  expect(character.length).toBe(1);
  expectToken(token, index);
  expect(token.isCharacter(StringWrapper.charCodeAt(character, 0))).toBe(true);
}
function expectOperatorToken(token, index, operator) {
  expectToken(token, index);
  expect(token.isOperator(operator)).toBe(true);
}
function expectNumberToken(token, index, n) {
  expectToken(token, index);
  expect(token.isNumber()).toBe(true);
  expect(token.toNumber()).toEqual(n);
}
function expectStringToken(token, index, str) {
  expectToken(token, index);
  expect(token.isString()).toBe(true);
  expect(token.toString()).toEqual(str);
}
function expectIdentifierToken(token, index, identifier) {
  expectToken(token, index);
  expect(token.isIdentifier()).toBe(true);
  expect(token.toString()).toEqual(identifier);
}
function expectKeywordToken(token, index, keyword) {
  expectToken(token, index);
  expect(token.isKeyword()).toBe(true);
  expect(token.toString()).toEqual(keyword);
}
function main() {
  describe('lexer', function() {
    describe('token', function() {
      it('should tokenize a simple identifier', function() {
        var tokens = lex("j");
        expect(tokens.length).toEqual(1);
        expectIdentifierToken(tokens[0], 0, 'j');
      });
      it('should tokenize a dotted identifier', function() {
        var tokens = lex("j.k");
        expect(tokens.length).toEqual(3);
        expectIdentifierToken(tokens[0], 0, 'j');
        expectCharacterToken(tokens[1], 1, '.');
        expectIdentifierToken(tokens[2], 2, 'k');
      });
      it('should tokenize an operator', function() {
        var tokens = lex("j-k");
        expect(tokens.length).toEqual(3);
        expectOperatorToken(tokens[1], 1, '-');
      });
      it('should tokenize an indexed operator', function() {
        var tokens = lex("j[k]");
        expect(tokens.length).toEqual(4);
        expectCharacterToken(tokens[1], 1, "[");
        expectCharacterToken(tokens[3], 3, "]");
      });
      it('should tokenize numbers', function() {
        var tokens = lex("88");
        expect(tokens.length).toEqual(1);
        expectNumberToken(tokens[0], 0, 88);
      });
      it('should tokenize numbers within index ops', function() {
        expectNumberToken(lex("a[22]")[2], 2, 22);
      });
      it('should tokenize simple quoted strings', function() {
        expectStringToken(lex('"a"')[0], 0, "a");
      });
      it('should tokenize quoted strings with escaped quotes', function() {
        expectStringToken(lex('"a\\""')[0], 0, 'a"');
      });
      it('should tokenize a string', function() {
        var tokens = lex("j-a.bc[22]+1.3|f:'a\\\'c':\"d\\\"e\"");
        expectIdentifierToken(tokens[0], 0, 'j');
        expectOperatorToken(tokens[1], 1, '-');
        expectIdentifierToken(tokens[2], 2, 'a');
        expectCharacterToken(tokens[3], 3, '.');
        expectIdentifierToken(tokens[4], 4, 'bc');
        expectCharacterToken(tokens[5], 6, '[');
        expectNumberToken(tokens[6], 7, 22);
        expectCharacterToken(tokens[7], 9, ']');
        expectOperatorToken(tokens[8], 10, '+');
        expectNumberToken(tokens[9], 11, 1.3);
        expectOperatorToken(tokens[10], 14, '|');
        expectIdentifierToken(tokens[11], 15, 'f');
        expectCharacterToken(tokens[12], 16, ':');
        expectStringToken(tokens[13], 17, "a'c");
        expectCharacterToken(tokens[14], 23, ':');
        expectStringToken(tokens[15], 24, 'd"e');
      });
      it('should tokenize undefined', function() {
        var tokens = lex("undefined");
        expectKeywordToken(tokens[0], 0, "undefined");
        expect(tokens[0].isKeywordUndefined()).toBe(true);
      });
      it('should ignore whitespace', function() {
        var tokens = lex("a \t \n \r b");
        expectIdentifierToken(tokens[0], 0, 'a');
        expectIdentifierToken(tokens[1], 8, 'b');
      });
      it('should tokenize quoted string', function() {
        var str = "['\\'', \"\\\"\"]";
        var tokens = lex(str);
        expectStringToken(tokens[1], 1, "'");
        expectStringToken(tokens[3], 7, '"');
      });
      it('should tokenize escaped quoted string', function() {
        var str = '"\\"\\n\\f\\r\\t\\v\\u00A0"';
        var tokens = lex(str);
        expect(tokens.length).toEqual(1);
        expect(tokens[0].toString()).toEqual('"\n\f\r\t\v\u00A0');
      });
      it('should tokenize unicode', function() {
        var tokens = lex('"\\u00A0"');
        expect(tokens.length).toEqual(1);
        expect(tokens[0].toString()).toEqual('\u00a0');
      });
      it('should tokenize relation', function() {
        var tokens = lex("! == != < > <= >=");
        expectOperatorToken(tokens[0], 0, '!');
        expectOperatorToken(tokens[1], 2, '==');
        expectOperatorToken(tokens[2], 5, '!=');
        expectOperatorToken(tokens[3], 8, '<');
        expectOperatorToken(tokens[4], 10, '>');
        expectOperatorToken(tokens[5], 12, '<=');
        expectOperatorToken(tokens[6], 15, '>=');
      });
      it('should tokenize statements', function() {
        var tokens = lex("a;b;");
        expectIdentifierToken(tokens[0], 0, 'a');
        expectCharacterToken(tokens[1], 1, ';');
        expectIdentifierToken(tokens[2], 2, 'b');
        expectCharacterToken(tokens[3], 3, ';');
      });
      it('should tokenize function invocation', function() {
        var tokens = lex("a()");
        expectIdentifierToken(tokens[0], 0, 'a');
        expectCharacterToken(tokens[1], 1, '(');
        expectCharacterToken(tokens[2], 2, ')');
      });
      it('should tokenize simple method invocations', function() {
        var tokens = lex("a.method()");
        expectIdentifierToken(tokens[2], 2, 'method');
      });
      it('should tokenize method invocation', function() {
        var tokens = lex("a.b.c (d) - e.f()");
        expectIdentifierToken(tokens[0], 0, 'a');
        expectCharacterToken(tokens[1], 1, '.');
        expectIdentifierToken(tokens[2], 2, 'b');
        expectCharacterToken(tokens[3], 3, '.');
        expectIdentifierToken(tokens[4], 4, 'c');
        expectCharacterToken(tokens[5], 6, '(');
        expectIdentifierToken(tokens[6], 7, 'd');
        expectCharacterToken(tokens[7], 8, ')');
        expectOperatorToken(tokens[8], 10, '-');
        expectIdentifierToken(tokens[9], 12, 'e');
        expectCharacterToken(tokens[10], 13, '.');
        expectIdentifierToken(tokens[11], 14, 'f');
        expectCharacterToken(tokens[12], 15, '(');
        expectCharacterToken(tokens[13], 16, ')');
      });
      it('should tokenize number', function() {
        var tokens = lex("0.5");
        expectNumberToken(tokens[0], 0, 0.5);
      });
      it('should tokenize number with exponent', function() {
        var tokens = lex("0.5E-10");
        expect(tokens.length).toEqual(1);
        expectNumberToken(tokens[0], 0, 0.5E-10);
        tokens = lex("0.5E+10");
        expectNumberToken(tokens[0], 0, 0.5E+10);
      });
      it('should throws exception for invalid exponent', function() {
        expect(function() {
          lex("0.5E-");
        }).toThrowError('Lexer Error: Invalid exponent at column 4 in expression [0.5E-]');
        expect(function() {
          lex("0.5E-A");
        }).toThrowError('Lexer Error: Invalid exponent at column 4 in expression [0.5E-A]');
      });
      it('should tokenize number starting with a dot', function() {
        var tokens = lex(".5");
        expectNumberToken(tokens[0], 0, 0.5);
      });
      it('should throw error on invalid unicode', function() {
        expect(function() {
          lex("'\\u1''bla'");
        }).toThrowError("Lexer Error: Invalid unicode escape [\\u1''b] at column 2 in expression ['\\u1''bla']");
      });
      it('should tokenize hash as operator', function() {
        var tokens = lex("#");
        expectOperatorToken(tokens[0], 0, '#');
      });
    });
  });
}
//# sourceMappingURL=lexer_spec.js.map

//# sourceMappingURL=./lexer_spec.map
 main();