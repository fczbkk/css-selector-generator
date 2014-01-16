(function() {
  var CssSelectorGenerator, root;

  CssSelectorGenerator = (function() {
    function CssSelectorGenerator() {}

    CssSelectorGenerator.prototype.isElement = function(element) {
      return !!((element != null ? element.nodeType : void 0) === 1);
    };

    CssSelectorGenerator.prototype.getParents = function(element) {
      var current_element, result;
      result = [];
      if (this.isElement(element)) {
        current_element = element;
        while (this.isElement(current_element)) {
          result.push(current_element);
          current_element = current_element.parentNode;
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getTagSelector = function(element) {
      return element.tagName.toLowerCase();
    };

    CssSelectorGenerator.prototype.getIdSelector = function(element) {
      var id;
      id = element.getAttribute('id');
      if (id != null) {
        return "#" + id;
      } else {
        return '';
      }
    };

    CssSelectorGenerator.prototype.getClassSelectors = function(element) {
      var class_string, item, result;
      result = [];
      class_string = element.getAttribute('class');
      if (class_string != null) {
        result = (function() {
          var _i, _len, _ref, _results;
          _ref = class_string.split(/\s+/);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push("." + item);
          }
          return _results;
        })();
      }
      return result;
    };

    CssSelectorGenerator.prototype.getAttributeSelectors = function(element) {
      var attribute, blacklist, result, _i, _len, _ref;
      result = [];
      blacklist = ['id', 'class'];
      _ref = element.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (blacklist.indexOf(attribute.nodeName) === -1) {
          result.push("[" + attribute.nodeName + "=" + attribute.nodeValue + "]");
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getNthChildSelector = function(element) {
      var i, parent_element, sibling, siblings, _i, _len;
      parent_element = element.parentNode;
      if (parent_element != null) {
        siblings = parent_element.querySelectorAll(element.tagName.toLowerCase());
        for (i = _i = 0, _len = siblings.length; _i < _len; i = ++_i) {
          sibling = siblings[i];
          if (sibling === element) {
            return ":nth-child(" + (i + 1) + ")";
          }
        }
      }
      return '';
    };

    CssSelectorGenerator.prototype.testSelector = function(element, selector, root) {
      var result;
      result = root.querySelectorAll(selector);
      return result.length === 1 && result[0] === element;
    };

    CssSelectorGenerator.prototype.getSelector = function(element) {
      var elm, parents, root, selectors, _i, _len;
      parents = this.getParents(element);
      root = parents[parents.length - 1];
      if (root.parentNode != null) {
        root = root.parentNode;
      }
      selectors = [];
      for (_i = 0, _len = parents.length; _i < _len; _i++) {
        elm = parents[_i];
        if (elm !== root) {
          selectors.unshift('' + (this.getTagSelector(elm)) + (this.getIdSelector(elm)) + (this.getClassSelectors(elm)).join('') + (this.getAttributeSelectors(elm)).join('') + (this.getNthChildSelector(elm)));
        }
      }
      return selectors.join(' ');
    };

    return CssSelectorGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.CssSelectorGenerator = CssSelectorGenerator;

}).call(this);
