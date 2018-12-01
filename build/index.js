(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CssSelectorGenerator"] = factory();
	else
		root["CssSelectorGenerator"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return CssSelectorGenerator; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar default_options = {\n  selectors: ['id', 'class', 'tag', 'nthchild'],\n  prefix_tag: false,\n  attribute_blacklist: [],\n  attribute_whitelist: [],\n  quote_attribute_when_needed: false,\n  id_blacklist: [],\n  class_blacklist: []\n};\n\nvar CssSelectorGenerator =\n/*#__PURE__*/\nfunction () {\n  function CssSelectorGenerator() {\n    var custom_options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n\n    _classCallCheck(this, CssSelectorGenerator);\n\n    this.options = Object.assign({}, default_options, custom_options);\n  }\n\n  _createClass(CssSelectorGenerator, [{\n    key: \"setOptions\",\n    value: function setOptions() {\n      var custom_options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n      this.options = Object.assign({}, this.options, custom_options);\n    }\n  }, {\n    key: \"getSelector\",\n    value: function getSelector(element) {\n      var selectors = [];\n      var result = null;\n      var parents = getParents(element);\n\n      for (var item in parents) {\n        var selector = getUniqueSelector(item, this.options);\n\n        if (selector) {\n          selectors.unshift(selector);\n          result = selectors.join(' > ');\n\n          if (testSelector(element, result)) {\n            return result;\n          }\n        }\n      }\n\n      return result;\n    }\n  }]);\n\n  return CssSelectorGenerator;\n}();\n\n\n\nfunction getUniqueSelector(element, options) {}\n\nfunction testSelector(element, selector) {\n  if (selector && selector !== '') {\n    var result = element.ownerDocument.querySelectorAll(selector);\n\n    if (result.length === 1 && result[0] === element) {\n      return true;\n    }\n  }\n\n  return false;\n}\n\nfunction isElement(input) {\n  return !!(input && input.nodeType === 1);\n}\n\nfunction getParents(element) {\n  var result = [];\n\n  while (isElement(element)) {\n    result.push(element);\n    element = element.parentNode;\n  }\n\n  return result;\n}\n\nfunction sanitizeItem(item) {\n  return item.split('').map(escapeCharacter).join('');\n}\n\nfunction escapeCharacter(character) {\n  if (character === ':') {\n    return \"\\\\\".concat(':'.charCodeAt(0).toString(16).toUpperCase(), \" \");\n  }\n\n  if (/[ !\"#$%&'()*+,./;<=>?@\\[\\\\\\]^`{|}~]/.test(character)) {\n    return \"\\\\\".concat(character);\n  }\n\n  return escape(character).replace(/%/g, '\\\\');\n}\n\nfunction getTagSelector(element) {\n  return sanitizeItem(element.tagName.toLowerCase());\n}\n\n//# sourceURL=webpack://CssSelectorGenerator/./src/index.js?");

/***/ })

/******/ });
});