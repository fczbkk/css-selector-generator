(function() {
  describe('CSS Selector Generator', function() {
    var root, x;
    x = new CssSelectorGenerator();
    root = document.createElement('div');
    root.innerHTML = "    <ul>      <li></li>      <li></li>      <li>        <a href='linkOne' class='linkOne'></a>        <a href='linkTwo' class='linkTwo'></a>        <a href='linkThree' class='linkThree'></a>      </li>    </ul>    <ul>      <li class='itemOne first'>        <a href='linkOne' class='linkOne'></a>        <a href='linkTwo' class='linkTwo'></a>        <a href='linkThree' class='linkThree'></a>      </li>      <li class='itemTwo'>        <a href='linkOne'></a>        <a href='linkTwo'></a>        <a href='linkThree'></a>        <a></a>        <a          href='linkOne'          class='classOne classTwo classThree'        ></a>        <a          href='linkTwo'          target='someTarget2'          rel='someRel'          class='classOne classTwo classThree'        ></a>        <a          href='linkThree'          target='someTarget'          rel='someRel'          class='classOne classTwo classThree'          id='linkZero'        ></a>      </li>      <li class='itemThree last'>        <a          href='linkOne'          id='linkOne'          class='classOne classTwo classThree'        ></a>        <a href='linkTwo' id='linkTwo'></a>        <a href='linkThree' id='linkThree'></a>      </li>    <ul>  ";
    it('should exist', function() {
      return expect(CssSelectorGenerator).toBeDefined();
    });
    it('should check if provided object is HTML element', function() {
      expect(x.isElement()).toBe(false);
      expect(x.isElement(null)).toBe(false);
      expect(x.isElement('aaa')).toBe(false);
      expect(x.isElement({
        aaa: 'bbb'
      })).toBe(false);
      return expect(x.isElement(root)).toBe(true);
    });
    it('should return list of all parents of an element', function() {
      var elm, result;
      elm = root.querySelector('#linkZero');
      result = x.getParents(elm);
      expect(result.length).toBe(4);
      expect(result[0]).toBe(elm);
      expect(result[1].tagName).toBe('LI');
      expect(result[2].tagName).toBe('UL');
      return expect(result[3].tagName).toBe('DIV');
    });
    it('should get tag selector for an element', function() {
      var elm;
      elm = root.querySelector('#linkZero');
      return expect(x.getTagSelector(elm)).toBe('a');
    });
    it('should get ID selector for an element', function() {
      var elm;
      elm = root.querySelector('#linkZero');
      expect(x.getIdSelector(elm)).toBe('#linkZero');
      return expect(x.getIdSelector(root)).toBe(null);
    });
    it('should get class selectors for an element', function() {
      var elm, expectation, result;
      elm = root.querySelector('#linkZero');
      result = x.getClassSelectors(elm);
      expectation = ['.classOne', '.classTwo', '.classThree'];
      expect(result).toEqual(expectation);
      return expect(x.getClassSelectors(root)).toEqual([]);
    });
    it('should get attribute selectors for an element', function() {
      var elm, result;
      elm = root.querySelector('#linkZero');
      result = x.getAttributeSelectors(elm);
      expect(result).toContain('[href=linkThree]');
      expect(result).toContain('[target=someTarget]');
      expect(result).toContain('[rel=someRel]');
      expect(result).not.toContain('[id=linkZero]');
      expect(result.length).toBe(3);
      return expect(x.getClassSelectors(root)).toEqual([]);
    });
    it('should get n-th child selector for an element', function() {
      var elm, result;
      elm = root.querySelector('#linkZero');
      result = x.getNthChildSelector(elm);
      expect(result).toBe(':nth-child(7)');
      return expect(x.getNthChildSelector(root)).toBe(null);
    });
    it('should get list of variants of CSS selectors', function() {
      var elm, result;
      elm = root.querySelector('#linkZero');
      result = x.getSelectorVariants(elm);
      expect(result).toEqual(['#linkZero']);
      elm = root.querySelector('.itemTwo a:nth-child(6)');
      result = x.getSelectorVariants(elm);
      expect(result).toContain('.classOne.classTwo.classThree');
      expect(result).toContain('a.classOne.classTwo.classThree');
      return expect(result).toContain('a:nth-child(6)');
    });
    it('should test, if selector returns only expected element', function() {
      var elm, selector;
      elm = root.querySelector('#linkZero');
      selector = '#linkZero';
      expect(x.testSelector(elm, selector, root)).toBe(true);
      selector = '.classOne';
      expect(x.testSelector(elm, selector, root)).toBe(false);
      selector = 'a[rel=someRel]';
      expect(x.testSelector(elm, selector, root)).toBe(false);
      selector = 'a[target=someTarget]';
      expect(x.testSelector(elm, selector, root)).toBe(true);
      selector = 'a[target=someTarget][rel=someRel]';
      return expect(x.testSelector(elm, selector, root)).toBe(true);
    });
    it('should sanitize the selector', function() {
      expect(x.sanitizeVariant('aaa bbb')).toBe('aaa bbb');
      expect(x.sanitizeVariant(' aaa bbb   ')).toBe('aaa bbb');
      return expect(x.sanitizeVariant('aaa  bbb')).toBe('aaa bbb');
    });
    it('should get list of variant combinations', function() {
      var list1, list2;
      list1 = ['aaa', 'bbb', 'ccc'];
      list2 = ['xxx', 'yyy', 'zzz'];
      expect(x.getVariantCombinations(null, null)).toEqual([]);
      expect(x.getVariantCombinations(list1, null)).toEqual(list1);
      expect(x.getVariantCombinations(null, list1)).toEqual(list1);
      return expect(x.getVariantCombinations(list1, list2)).toEqual(['aaa xxx', 'aaa yyy', 'aaa zzz', 'bbb xxx', 'bbb yyy', 'bbb zzz', 'ccc xxx', 'ccc yyy', 'ccc zzz']);
    });
    it('should sanitize variants list', function() {
      var list;
      list = ['aaa', ' aaa', 'aaa ', 'aaa'];
      return expect(x.sanitizeVariantsList(list)).toEqual(['aaa']);
    });
    it('should get the root object for the element', function() {
      var elm;
      elm = document.createElement('div');
      expect(x.getRoot(elm)).toBe(elm);
      document.body.appendChild(elm);
      return expect(x.getRoot(elm)).toBe(document);
    });
    it('should get optimised selector', function() {
      var elm, result;
      elm = root.querySelector('.itemOne a:nth-child(1)');
      result = x.getSelector(elm);
      return expect(result).toBe('.itemOne.first .linkOne');
    });
    return it('should construct unique selector for any given element', function() {
      var elm, links, selector, _i, _len, _results;
      links = root.querySelectorAll('ul')[1].querySelectorAll('li')[1].querySelectorAll('a');
      _results = [];
      for (_i = 0, _len = links.length; _i < _len; _i++) {
        elm = links[_i];
        selector = x.getSelector(elm);
        _results.push(expect(x.testSelector(elm, selector, root)).toBe(true));
      }
      return _results;
    });
  });

}).call(this);
