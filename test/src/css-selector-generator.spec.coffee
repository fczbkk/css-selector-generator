describe 'CSS Selector Generator', ->

  root = null
  x = null

  beforeEach ->
    x = new CssSelectorGenerator()
    root = document.createElement 'div'
    root.innerHTML = "
      <ul>
        <li></li>
        <li></li>
        <li>
          <a href='linkOne' class='linkOne'></a>
          <a href='linkTwo' class='linkTwo'></a>
          <a href='linkThree' class='linkThree'></a>
        </li>
      </ul>
      <ul>
        <li class='itemOne first'>
          <a href='linkOne' class='linkOne'></a>
          <a href='linkTwo' class='linkTwo'></a>
          <a href='linkThree' class='linkThree'></a>
        </li>
        <li class='itemTwo'>
          <a href='linkOne'></a>
          <a href='linkTwo'></a>
          <a href='linkThree'></a>
          <a></a>
          <a
            href='linkOne'
            class='classOne classTwo classThree'
          ></a>
          <a
            href='linkTwo'
            target='someTarget2'
            rel='someRel'
            class='classOne classTwo classThree'
          ></a>
          <a
            href='linkThree'
            target='someTarget'
            rel='someRel'
            class='classOne classTwo classThree'
            id='linkZero'
          ></a>
        </li>
        <li class='itemThree last'>
          <a
            href='linkOne'
            id='linkOne'
            class='classOne classTwo classThree'
          ></a>
          <a href='linkTwo' id='linkTwo'></a>
          <a href='linkThree' id='linkThree'></a>
        </li>
      </ul>
    "
    document.body.appendChild root

  afterEach ->
    root.parentNode.removeChild root

  it 'should exist', ->
    expect(CssSelectorGenerator).toBeDefined()

  describe 'utilities', ->

    it 'should check if provided object is HTML element', ->
      expect(x.isElement()).toBe false
      expect(x.isElement null).toBe false
      expect(x.isElement 'aaa').toBe false
      expect(x.isElement {aaa: 'bbb'}).toBe false
      expect(x.isElement root).toBe true

    it 'should return list of all parents of an element', ->
      elm = root.querySelector '#linkZero'
      result = x.getParents elm
      expect(result.length).toBe 6
      expect(result[0]).toBe elm
      expect(result[1].tagName).toBe 'LI'
      expect(result[2].tagName).toBe 'UL'
      expect(result[3].tagName).toBe 'DIV'


  describe 'options', ->

    it 'should use default set of allowed selectors', ->
      expectation = ['tag', 'id', 'class', 'nthchild']
      expect(x.options.selectors).toEqual jasmine.arrayContaining expectation

    it 'should allow to customize allowed selectors', ->
      x.setOptions selectors: ['attribute']
      expect(x.options.selectors).toEqual ['attribute']

    it 'should not use selectors that are not allowed', ->
      root.innerHTML = '<a></a><a></a>'
      x.setOptions selectors: ['tag']
      expect(x.getSelector root.firstChild).toEqual null

    it 'should keep order of preferred selector types', ->
      root.innerHTML = '<div id="aaa"></div>'

      x.setOptions selectors: ['id', 'tag', 'nthchild']
      result = (x.getSelector root.firstChild).split(' > ').pop()
      expect(result).toEqual '#aaa'

      x.setOptions selectors: ['tag', 'id', 'nthchild']
      result = (x.getSelector root.firstChild).split(' > ').pop()
      expect(result).toEqual 'div'


  describe 'selectors', ->

    describe 'tag', ->

      it 'should get tag selector for an element', ->
        elm = root.querySelector '#linkZero'
        expect(x.getTagSelector elm).toBe 'a'

      it 'should get tag selector for namespaced element', ->
        root.innerHTML = '<aaa:bbb />'
        selector = x.getTagSelector root.firstChild
        expect(root.querySelector selector).toEqual root.firstChild

    describe 'ID', ->

      it 'should get ID selector for an element', ->
        elm = root.querySelector '#linkZero'
        expect(x.getIdSelector elm).toBe '#linkZero'
        expect(x.getIdSelector root).toBe null

      it 'should escape special characters in ID selector', ->
        special_characters = '*+-./;'
        for special_character in special_characters.split ''
          root.innerHTML = "<div id='aaa#{special_character}bbb'></div>"
          selector = x.getIdSelector root.firstChild
          expect(document.querySelector selector).toEqual root.firstChild

      it 'should escape ID selector containing UTF8 characters', ->
        expect(x.sanitizeItem 'aaa✓bbb').toEqual 'aaa\\u2713bbb'

      it 'should match element with colon in its ID', ->
        root.innerHTML = '<div id="aaa:bbb"></div>'
        selector = x.getIdSelector root.firstChild
        expect(document.querySelector selector).toEqual root.firstChild

      it 'should ignore ID attribute begining with a number', ->
        root.innerHTML = '<div id="111aaa"></div>'
        selector = x.getIdSelector root.firstChild
        expect(selector).toBe null

      it 'should ignore non-unique ID attribute', ->
        root.innerHTML = '<div id="aaa"></div><div id="aaa"></div>'
        selector = x.getIdSelector root.firstChild
        expect(selector).toBe null

      it 'should ignore empty ID attribute', ->
        root.innerHTML = '<div id=""></div>'
        selector = x.getIdSelector root.firstChild
        expect(selector).toBe null

      it 'should ignore ID attribute containing only whitespace', ->
        root.innerHTML = '<div id="   "></div>'
        selector = x.getIdSelector root.firstChild
        expect(selector).toBe null

      it 'should ignore ID attribute with whitespace', ->
        root.innerHTML = '<div id="aaa bbb"></div>'
        selector = x.getIdSelector root.firstChild
        expect(selector).toBe null

    describe 'class', ->

      it 'should get class selectors for an element', ->
        elm = root.querySelector '#linkZero'
        result = x.getClassSelectors elm
        expectation = ['.classOne', '.classTwo', '.classThree']
        expect(result).toEqual expectation
        expect(x.getClassSelectors root).toEqual []

      it 'should remove unnecessary whitespace when getting class names', ->
        elm = document.createElement 'div'
        elm.setAttribute 'class', ' aaa  bbb ccc      '
        expectation = ['.aaa', '.bbb', '.ccc']
        result = x.getClassSelectors elm
        expect(result).toEqual expectation

      it 'should handle elements with empty class name', ->
        elm = document.createElement 'div'
        elm.setAttribute 'class', ''
        result = x.getClassSelectors elm
        expect(result).toEqual []

      it 'should sanitize class selector', ->
        root.innerHTML = '<div class="aaa:bbb"></div>'
        elm = root.firstChild
        result = x.getClassSelectors elm
        expect(result).toContain '.aaa\\3A bbb'

      it 'should get element by class selector', ->
        x.setOptions selectors: ['class']
        root.innerHTML = '<div class="aaa"></div>'
        expect(x.getSelector root.firstChild).toEqual '.aaa'

      it 'should combine class selector with tag selector if needed', ->
        x.setOptions selectors: ['tag', 'class']
        root.innerHTML = '
          <div class="aaa"></div>
          <div></div>
          <p class="aaa"></p>
        '
        expect(x.getSelector root.firstChild).toEqual 'div.aaa'

      it 'should use single unique class when applicable', ->
        x.setOptions selectors: ['class']
        root.innerHTML = '<p class="aaa bbb"></p><p class="aaa ccc"></p>'
        expect(x.getSelector root.firstChild).toEqual '.bbb'

      it 'should use combination of classes when applicable', ->
        x.setOptions selectors: ['class']
        root.innerHTML = '
          <div class="aaa bbb"></div>
          <div class="aaa ccc"></div>
          <div class="bbb ccc"></div>
        '
        expect(x.getSelector root.firstChild).toEqual '.aaa.bbb'

    describe 'attribute', ->

      it 'should get attribute selectors for an element', ->
        elm = root.querySelector '#linkZero'
        result = x.getAttributeSelectors elm
        expect(result).toContain '[href=linkThree]'
        expect(result).toContain '[target=someTarget]'
        expect(result).toContain '[rel=someRel]'
        expect(result).not.toContain '[id=linkZero]'
        expect(result.length).toBe 3
        expect(x.getClassSelectors root).toEqual []

      it 'should use attribute selector when enabled', ->
        x.setOptions selectors: ['tag', 'id', 'class', 'attribute', 'nthchild']
        root.innerHTML = '<a rel="aaa"></a><a rel="bbb"></a>'
        result = x.getSelector root.firstChild
        expect(result).toEqual '[rel=aaa]'

      it 'should get element by attribute selector', ->
        x.setOptions selectors: ['attribute']
        root.innerHTML = '<a href="aaa"></a>'
        expect(x.getSelector root.firstChild).toEqual '[href=aaa]'

      it 'should combine attribute selector with tag selector if needed', ->
        x.setOptions selectors: ['attribute', 'tag']
        root.innerHTML = '
          <a href="aaa"></a>
          <a href="bbb"></a>
          <link href="aaa"></link>
        '
        expect(x.getSelector root.firstChild).toEqual 'a[href=aaa]'

      it 'should use single unique attribute when applicable', ->
        x.setOptions selectors: ['attribute']
        root.innerHTML = '
          <a href="aaa" rel="bbb"></a>
          <a href="aaa" rel="ccc"></a>
        '
        expect(x.getSelector root.firstChild).toEqual '[rel=bbb]'

      it 'should use combination of classes when applicable', ->
        x.setOptions selectors: ['attribute']
        root.innerHTML = '
          <a href="aaa" rel="aaa"></a>
          <a href="aaa" rel="xxx"></a>
          <a href="xxx" rel="aaa"></a>
        '
        expect(x.getSelector root.firstChild).toEqual '[href=aaa][rel=aaa]'

    describe 'n-th child', ->

      it 'should get n-th child selector for an element', ->
        elm = root.querySelector '#linkZero'
        result = x.getNthChildSelector elm
        expect(result).toBe ':nth-child(7)'


  describe 'selector test', ->
    elm = null

    beforeEach ->
      elm = root.querySelector '#linkZero'

    it 'ID selector', ->
      selector = '#linkZero'
      expect(x.testSelector elm, selector, root).toBe true

    it 'non-unique Class selector', ->
      selector = '.classOne'
      expect(x.testSelector elm, selector, root).toBe false

    it 'non-unique attribute selector', ->
      selector = 'a[rel=someRel]'
      expect(x.testSelector elm, selector, root).toBe false

    it 'unique attribute selector', ->
      selector = 'a[target=someTarget]'
      expect(x.testSelector elm, selector, root).toBe true

    it 'multiple attribute selector', ->
      selector = 'a[target=someTarget][rel=someRel]'
      expect(x.testSelector elm, selector, root).toBe true


  describe 'unique selector', ->

    it 'should construct unique selector for any given element', ->
      all_elements = root.querySelectorAll '*'
      for element in all_elements
        selector = x.getSelector element
        expect(x.testSelector element, selector).toBe true

    it 'should pass the complex test', ->
      root = document.createElement 'div'
      root.innerHTML = complex_example
      document.body.appendChild root
      all_elements = root.querySelectorAll '*'
      for element in all_elements
        selector = x.getSelector element
        expect(x.testSelector element, selector).toBe true


  describe 'utilities', ->

    describe '`getCombinations`', ->

      it 'should return all possible combinations of items', ->
        result = x.getCombinations ['a', 'b', 'c']
        expectation = ['a', 'b', 'c', 'ab', 'ac', 'bc', 'abc']
        expect(result).toEqual jasmine.arrayContaining expectation
        expect(result).not.toEqual jasmine.arrayContaining ['', 'aa']

      it 'should sort results from shortest to longest', ->
        result = x.getCombinations ['a', 'b', 'c']
        expect(result.pop()).toEqual 'abc'
