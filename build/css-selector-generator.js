(function() {
  var CssSelectorGenerator, root,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CssSelectorGenerator = (function() {
    CssSelectorGenerator.prototype.default_options = {
      selectors: ['tag', 'id', 'class', 'nthchild']
    };

    function CssSelectorGenerator(options) {
      if (options == null) {
        options = {};
      }
      this.options = {};
      this.setOptions(this.default_options);
      this.setOptions(options);
    }

    CssSelectorGenerator.prototype.setOptions = function(options) {
      var key, results, val;
      if (options == null) {
        options = {};
      }
      results = [];
      for (key in options) {
        val = options[key];
        if (this.default_options.hasOwnProperty(key)) {
          results.push(this.options[key] = val);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

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

    CssSelectorGenerator.prototype.sanitizeItem = function(item) {
      return escape(item).replace(/\%/g, '\\');
    };

    CssSelectorGenerator.prototype.validateId = function(id) {
      if (id == null) {
        return false;
      }
      if (/^\d/.exec(id)) {
        return false;
      }
      return document.querySelectorAll("#" + id).length === 1;
    };

    CssSelectorGenerator.prototype.getIdSelector = function(element) {
      var id;
      id = element.getAttribute('id');
      if (id != null) {
        id = this.sanitizeItem(id);
      }
      id = this.validateId(id) ? id = "#" + id : id = null;
      return id;
    };

    CssSelectorGenerator.prototype.getClassSelectors = function(element) {
      var class_string, item, result;
      result = [];
      class_string = element.getAttribute('class');
      if (class_string != null) {
        class_string = class_string.replace(/\s+/g, ' ');
        class_string = class_string.replace(/^\s|\s$/g, '');
        if (class_string !== '') {
          result = (function() {
            var i, len, ref, results;
            ref = class_string.split(/\s+/);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              item = ref[i];
              results.push("." + (this.sanitizeItem(item)));
            }
            return results;
          }).call(this);
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getAttributeSelectors = function(element) {
      var attribute, blacklist, i, len, ref, ref1, result;
      result = [];
      blacklist = ['id', 'class'];
      ref = element.attributes;
      for (i = 0, len = ref.length; i < len; i++) {
        attribute = ref[i];
        if (ref1 = attribute.nodeName, indexOf.call(blacklist, ref1) < 0) {
          result.push("[" + attribute.nodeName + "=" + attribute.nodeValue + "]");
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getNthChildSelector = function(element) {
      var counter, i, len, parent_element, sibling, siblings;
      parent_element = element.parentNode;
      if (parent_element != null) {
        counter = 0;
        siblings = parent_element.childNodes;
        for (i = 0, len = siblings.length; i < len; i++) {
          sibling = siblings[i];
          if (this.isElement(sibling)) {
            counter++;
            if (sibling === element) {
              return ":nth-child(" + counter + ")";
            }
          }
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.testSelector = function(element, selector) {
      var is_unique, result;
      is_unique = false;
      if ((selector != null) && selector !== '') {
        result = element.ownerDocument.querySelectorAll(selector);
        if (result.length === 1 && result[0] === element) {
          is_unique = true;
        }
      }
      return is_unique;
    };

    CssSelectorGenerator.prototype.getAllSelectors = function(element) {
      var result;
      result = {
        t: null,
        i: null,
        c: null,
        a: null,
        n: null
      };
      if (indexOf.call(this.options.selectors, 'tag') >= 0) {
        result.t = this.getTagSelector(element);
      }
      if (indexOf.call(this.options.selectors, 'id') >= 0) {
        result.i = this.getIdSelector(element);
      }
      if (indexOf.call(this.options.selectors, 'class') >= 0) {
        result.c = this.getClassSelectors(element);
      }
      if (indexOf.call(this.options.selectors, 'attribute') >= 0) {
        result.a = this.getAttributeSelector(element);
      }
      if (indexOf.call(this.options.selectors, 'nthchild') >= 0) {
        result.n = this.getNthChildSelector(element);
      }
      return result;
    };

    CssSelectorGenerator.prototype.testUniqueness = function(element, selector) {
      var found_elements, parent;
      parent = element.parentNode;
      found_elements = parent.querySelectorAll(selector);
      return found_elements.length === 1 && found_elements[0] === element;
    };

    CssSelectorGenerator.prototype.getUniqueSelector = function(element) {
      var all_classes, selector, selectors;
      selectors = this.getAllSelectors(element);
      if (selectors.i != null) {
        return selectors.i;
      }
      if (this.testUniqueness(element, selectors.t)) {
        return selectors.t;
      }
      if (selectors.c.length !== 0) {
        all_classes = selectors.c.join('');
        selector = all_classes;
        if (this.testUniqueness(element, selector)) {
          return selector;
        }
        selector = selectors.t + all_classes;
        if (this.testUniqueness(element, selector)) {
          return selector;
        }
      }
      return selectors.n;
    };

    CssSelectorGenerator.prototype.getSelector = function(element) {
      var all_selectors, i, item, j, len, len1, parents, result, selector, selectors;
      all_selectors = [];
      parents = this.getParents(element);
      for (i = 0, len = parents.length; i < len; i++) {
        item = parents[i];
        selector = this.getUniqueSelector(item);
        if (selector != null) {
          all_selectors.push(selector);
        }
      }
      selectors = [];
      for (j = 0, len1 = all_selectors.length; j < len1; j++) {
        item = all_selectors[j];
        selectors.unshift(item);
        result = selectors.join(' > ');
        if (this.testSelector(element, result)) {
          return result;
        }
      }
      return null;
    };

    return CssSelectorGenerator;

  })();

  if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
    define([], function() {
      return CssSelectorGenerator;
    });
  } else {
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.CssSelectorGenerator = CssSelectorGenerator;
  }

}).call(this);
