"use strict";

var _interopRequireDefault = require("/Users/zhangyue/Desktop/babel-plugin-import/node_modules/babel-preset-umi/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _toConsumableArray2 = _interopRequireDefault(require("/Users/zhangyue/Desktop/babel-plugin-import/node_modules/babel-preset-umi/node_modules/@babel/runtime/helpers/toConsumableArray"));

var _assert = _interopRequireDefault(require("assert"));

var _Plugin = _interopRequireDefault(require("./Plugin"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _default(_ref) {
  var types = _ref.types;
  var plugins = null; // Only for test
  // eslint-disable-next-line no-underscore-dangle

  global.__clearBabelAntdPlugin = function () {
    plugins = null;
  };

  function applyInstance(method, args, context) {
    // eslint-disable-next-line no-restricted-syntax
    var _iterator = _createForOfIteratorHelper(plugins),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var plugin = _step.value;

        if (plugin[method]) {
          plugin[method].apply(plugin, [].concat((0, _toConsumableArray2.default)(args), [context]));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  var Program = {
    enter: function enter(path, _ref2) {
      var _ref2$opts = _ref2.opts,
          opts = _ref2$opts === void 0 ? {} : _ref2$opts;

      // Init plugin instances once.
      if (!plugins) {
        if (Array.isArray(opts)) {
          plugins = opts.map(function (_ref3, index) {
            var libraryName = _ref3.libraryName,
                libraryDirectory = _ref3.libraryDirectory,
                style = _ref3.style,
                styleLibraryDirectory = _ref3.styleLibraryDirectory,
                customStyleName = _ref3.customStyleName,
                camel2DashComponentName = _ref3.camel2DashComponentName,
                camel2UnderlineComponentName = _ref3.camel2UnderlineComponentName,
                fileName = _ref3.fileName,
                customName = _ref3.customName,
                transformToDefaultImport = _ref3.transformToDefaultImport;
            (0, _assert.default)(libraryName, 'libraryName should be provided');
            return new _Plugin.default(libraryName, libraryDirectory, style, styleLibraryDirectory, customStyleName, camel2DashComponentName, camel2UnderlineComponentName, fileName, customName, transformToDefaultImport, types, index);
          });
        } else {
          (0, _assert.default)(opts.libraryName, 'libraryName should be provided');
          plugins = [new _Plugin.default(opts.libraryName, opts.libraryDirectory, opts.style, opts.styleLibraryDirectory, opts.customStyleName, opts.camel2DashComponentName, opts.camel2UnderlineComponentName, opts.fileName, opts.customName, opts.transformToDefaultImport, types)];
        }
      }

      applyInstance('ProgramEnter', arguments, this); // eslint-disable-line
    },
    exit: function exit() {
      applyInstance('ProgramExit', arguments, this); // eslint-disable-line
    }
  };
  var methods = ['ImportDeclaration', 'CallExpression', 'MemberExpression', 'Property', 'VariableDeclarator', 'ArrayExpression', 'LogicalExpression', 'ConditionalExpression', 'IfStatement', 'ExpressionStatement', 'ReturnStatement', 'ExportDefaultDeclaration', 'BinaryExpression', 'NewExpression', 'ClassDeclaration'];
  var ret = {
    visitor: {
      Program: Program
    }
  }; // eslint-disable-next-line no-restricted-syntax

  var _loop = function _loop() {
    var method = _methods[_i];

    ret.visitor[method] = function () {
      // eslint-disable-line
      applyInstance(method, arguments, ret.visitor); // eslint-disable-line
    };
  };

  for (var _i = 0, _methods = methods; _i < _methods.length; _i++) {
    _loop();
  }

  return ret;
}