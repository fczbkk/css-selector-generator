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
        return null;
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
      return null;
    };

    CssSelectorGenerator.prototype.testSelector = function(element, selector, root) {
      var result;
      if ((selector != null) && selector !== '') {
        result = root.querySelectorAll(selector);
        return result.length === 1 && result[0] === element;
      }
      return false;
    };

    CssSelectorGenerator.prototype.getAllSelectors = function(element) {
      return {
        t: this.getTagSelector(element),
        i: this.getIdSelector(element),
        c: this.getClassSelectors(element),
        a: this.getAttributeSelectors(element),
        n: this.getNthChildSelector(element)
      };
    };

    CssSelectorGenerator.prototype.getSelectorVariants = function(element) {
      var s, variants;
      variants = [];
      s = this.getAllSelectors(element);
      if (s.i != null) {
        variants.push(s.i);
      } else {
        variants.push('');
        variants.push(s.c.join(''));
        variants.push(s.t + s.c.join(''));
        variants.push(s.t + s.n);
      }
      return variants;
    };

    CssSelectorGenerator.prototype.getOptimisedSelector = function(element) {
      var elm, elm_variant, elm_variants, new_variant, old_variant, old_variants, parents, root, selector, variants, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      parents = this.getParents(element);
      root = parents[parents.length - 1];
      if (root.parentNode != null) {
        root = root.parentNode;
      }
      variants = null;
      for (_i = 0, _len = parents.length; _i < _len; _i++) {
        elm = parents[_i];
        if (elm !== root) {
          elm_variants = this.getSelectorVariants(elm);
          if (variants != null) {
            old_variants = variants.slice();
            for (_j = 0, _len1 = elm_variants.length; _j < _len1; _j++) {
              elm_variant = elm_variants[_j];
              for (_k = 0, _len2 = old_variants.length; _k < _len2; _k++) {
                old_variant = old_variants[_k];
                new_variant = "" + elm_variant + " " + old_variant;
                new_variant = new_variant.replace(/(^\s*)|(\s*$)/g, '');
                if (variants.indexOf(new_variant === -1)) {
                  variants.push(new_variant);
                }
              }
            }
          } else {
            variants = elm_variants;
          }
        }
      }
      for (_l = 0, _len3 = variants.length; _l < _len3; _l++) {
        selector = variants[_l];
        if (this.testSelector(element, selector, root)) {
          return selector;
        }
      }
      return null;
    };

    CssSelectorGenerator.prototype.getSelector = function(element) {
      var elm, parents, root, s, selectors, _i, _len;
      parents = this.getParents(element);
      root = parents[parents.length - 1];
      if (root.parentNode != null) {
        root = root.parentNode;
      }
      selectors = [];
      for (_i = 0, _len = parents.length; _i < _len; _i++) {
        elm = parents[_i];
        if (elm !== root) {
          s = this.getAllSelectors(elm);
          selectors.unshift('' + s.t + (s.i != null ? s.i : '') + s.c.join('') + s.a.join('') + s.n);
        }
      }
      return selectors.join(' ');
    };

    return CssSelectorGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.CssSelectorGenerator = CssSelectorGenerator;

}).call(this);
