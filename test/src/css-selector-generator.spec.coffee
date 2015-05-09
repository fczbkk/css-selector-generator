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
      expect(x.options.selectors).toEqual ['tag', 'id', 'class', 'nthchild']

    it 'should allow to customize allowed selectors', ->
      x.setOptions selectors: ['attribute']
      expect(x.options.selectors).toEqual ['attribute']


  describe 'selectors', ->

    describe 'tag', ->

      it 'should get tag selector for an element', ->
        elm = root.querySelector '#linkZero'
        expect(x.getTagSelector elm).toBe 'a'

    describe 'ID', ->

      it 'should get ID selector for an element', ->
        elm = root.querySelector '#linkZero'
        expect(x.getIdSelector elm).toBe '#linkZero'
        expect(x.getIdSelector root).toBe null

      it 'should sanitize ID selector', ->
        expect(x.sanitizeItem 'aaa:bbb').toEqual 'aaa\\3Abbb'

      it 'should ignore ID attribute begining with a number', ->
        expect(x.validateId '111aaa').toBe false

      it 'should ignore non-unique ID attribute', ->
        root.innerHTML = '<div id="aaa"></div><div id="aaa"></div>'
        expect(x.validateId 'aaa').toBe false

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
        expect(result).toContain '.aaa\\3Abbb'

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
