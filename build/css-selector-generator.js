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
        class_string = class_string.replace(/\s+/g, ' ');
        class_string = class_string.replace(/^\s|\s$/g, '');
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

    CssSelectorGenerator.prototype.getRoot = function(element, parents) {
      var root;
      if (parents == null) {
        parents = this.getParents(element);
      }
      root = parents[parents.length - 1];
      if (root.parentNode != null) {
        root = root.parentNode;
      }
      return root;
    };

    CssSelectorGenerator.prototype.sanitizeVariant = function(variant) {
      var sanitized_variant;
      if (variant == null) {
        variant = '';
      }
      sanitized_variant = variant.replace(/^\s+|\s+$/g, '');
      sanitized_variant = sanitized_variant.replace(/\s\s+/, ' ');
      return sanitized_variant;
    };

    CssSelectorGenerator.prototype.sanitizeVariantsList = function(variants) {
      var is_empty, is_unique, sanitized_variants, variant, _i, _len;
      if (variants == null) {
        variants = [];
      }
      sanitized_variants = [];
      for (_i = 0, _len = variants.length; _i < _len; _i++) {
        variant = variants[_i];
        variant = this.sanitizeVariant(variant);
        is_empty = variant === '';
        is_unique = sanitized_variants.indexOf(variant) === -1;
        if (is_unique && !is_empty) {
          sanitized_variants.push(variant);
        }
      }
      return sanitized_variants;
    };

    CssSelectorGenerator.prototype.getVariantCombinations = function(list1, list2) {
      var item1, item2, result, _i, _j, _len, _len1;
      if (list1 == null) {
        list1 = [];
      }
      if (list2 == null) {
        list2 = [];
      }
      result = [];
      if (((list1 != null) && list1.length !== 0) && ((list2 == null) || list2.length === 0)) {
        result = list1;
      }
      if (((list2 != null) && list2.length !== 0) && ((list1 == null) || list1.length === 0)) {
        result = list2;
      }
      for (_i = 0, _len = list1.length; _i < _len; _i++) {
        item1 = list1[_i];
        for (_j = 0, _len1 = list2.length; _j < _len1; _j++) {
          item2 = list2[_j];
          result.push("" + item1 + " " + item2);
        }
      }
      return result;
    };

    CssSelectorGenerator.prototype.getSelectorVariantsList = function(element, parents, root) {
      var elm, elm_variants, variants, _i, _len;
      if (parents == null) {
        parents = this.getParents(element);
      }
      if (root == null) {
        root = this.getRoot(element, parents);
      }
      variants = [];
      for (_i = 0, _len = parents.length; _i < _len; _i++) {
        elm = parents[_i];
        if (elm !== root) {
          elm_variants = this.getSelectorVariants(elm);
          variants = this.getVariantCombinations(elm_variants, variants);
        }
      }
      return this.sanitizeVariantsList(variants);
    };

    CssSelectorGenerator.prototype.getSelector = function(element) {
      var parents, root, selector, variants, _i, _len;
      parents = this.getParents(element);
      root = this.getRoot(element, parents);
      variants = this.getSelectorVariantsList(element, parents, root);
      for (_i = 0, _len = variants.length; _i < _len; _i++) {
        selector = variants[_i];
        if (this.testSelector(element, selector, root)) {
          return selector;
        }
      }
      return null;
    };

    return CssSelectorGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.CssSelectorGenerator = CssSelectorGenerator;

}).call(this);
