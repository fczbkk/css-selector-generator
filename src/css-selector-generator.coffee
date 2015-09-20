class CssSelectorGenerator

  default_options:
    # choose from 'tag', 'id', 'class', 'nthchild', 'attribute'
    selectors: ['tag', 'id', 'class', 'nthchild']

  constructor: (options = {}) ->
    @options = {}
    @setOptions @default_options
    @setOptions options

  setOptions: (options = {}) ->
    for key, val of options
      @options[key] = val if @default_options.hasOwnProperty key

  isElement: (element) ->
    !!(element?.nodeType is 1)

  getParents: (element) ->
    result = []
    if @isElement element
      current_element = element
      while @isElement current_element
        result.push current_element
        current_element = current_element.parentNode
    result

  getTagSelector: (element) ->
    element.tagName.toLowerCase()

  # escapes special characters in class and ID selectors
  sanitizeItem: (item) ->
    escape item
      .replace /\%/g, '\\'

  validateId: (id) ->
    # ID must exist
    return false unless id?

    # ID can not start with number
    return false if /^\d/.exec id

    # ID must be unique
    return document.querySelectorAll("##{id}").length is 1

  getIdSelector: (element) ->
    id = element.getAttribute 'id'

    if id?
      id = @sanitizeItem id

    id =
      if @validateId id
        id = "##{id}"
      else
        id = null

    id

  getClassSelectors: (element) ->
    result = []
    class_string = element.getAttribute 'class'
    if class_string?
      # remove multiple whitespaces
      class_string = class_string.replace /\s+/g, ' '
      # trim whitespace
      class_string = class_string.replace /^\s|\s$/g, ''
      if class_string isnt ''
        result = for item in class_string.split /\s+/
          ".#{@sanitizeItem item}"
    result

  getAttributeSelectors: (element) ->
    result = []
    blacklist = ['id', 'class']
    for attribute in element.attributes
      unless attribute.nodeName in blacklist
        result.push "[#{attribute.nodeName}=#{attribute.nodeValue}]"
    result

  getNthChildSelector: (element) ->
    parent_element = element.parentNode
    if parent_element?
      counter = 0
      siblings = parent_element.childNodes
      for sibling in siblings
        if @isElement sibling
          counter++
          return ":nth-child(#{counter})" if sibling is element
    null

  testSelector: (element, selector) ->
    is_unique = false
    if selector? and selector isnt ''
      result = element.ownerDocument.querySelectorAll selector
      is_unique = true if result.length is 1 and result[0] is element
    is_unique

  getAllSelectors: (element) ->
    result = t: null, i: null, c: null, a: null, n: null

    if 'tag' in @options.selectors
      result.t = @getTagSelector element

    if 'id' in @options.selectors
      result.i = @getIdSelector element

    if 'class' in @options.selectors
      result.c = @getClassSelectors element

    if 'attribute' in @options.selectors
      result.a = @getAttributeSelector element

    if 'nthchild' in @options.selectors
      result.n = @getNthChildSelector element

    result


  testUniqueness: (element, selector) ->
    parent = element.parentNode
    found_elements = parent.querySelectorAll selector
    found_elements.length is 1 and found_elements[0] is element

  getUniqueSelector: (element) ->
    selectors = @getAllSelectors element

    # ID selector (no need to check for uniqueness)
    return selectors.i if selectors.i?

    # tag selector (should return unique for BODY)
    return selectors.t if @testUniqueness element, selectors.t

    # TODO check each class separately
    # class selector
    if selectors.c.length isnt 0
      all_classes = selectors.c.join ''

      # class selector without tag
      selector = all_classes
      return selector if @testUniqueness element, selector

      # class selector with tag
      selector = selectors.t + all_classes
      return selector if @testUniqueness element, selector

    # if anything else fails, return n-th child selector
    return selectors.n

  getSelector: (element) ->
    all_selectors = []
    parents = @getParents element
    for item in parents
      selector = @getUniqueSelector item
      all_selectors.push selector if selector?
    selectors = []
    for item in all_selectors
      selectors.unshift item
      result = selectors.join ' > '
      return result if @testSelector element, result
    null

if define?.amd
  define [], -> CssSelectorGenerator
else
  root = if exports? then exports else this
  root.CssSelectorGenerator = CssSelectorGenerator
