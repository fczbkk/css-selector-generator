class CssSelectorGenerator

  default_options:
    # choose from 'tag', 'id', 'class', 'nthchild', 'nthtype', 'attribute'
    selectors: ['id', 'class', 'tag', 'nthchild'],
    prefix_tag: false,
    attribute_blacklist: [],
    attribute_whitelist: [],
    quote_attribute_when_needed: false,
    id_blacklist: [],
    id_whitelist: [],
    class_blacklist: [],
    class_whitelist: [],
    root_node: null,
    get_options: null

  nthSelectors:
    child: 0
    type: 1

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
    @sanitizeItem element.tagName.toLowerCase()

  # escapes special characters in class and ID selectors
  sanitizeItem: (item) ->
    characters = (item.split '').map (character) ->
      # colon is valid character in an attribute, but has to be escaped before
      # being used in a selector, because it would clash with the CSS syntax
      if character is ':'
        "\\#{':'.charCodeAt(0).toString(16).toUpperCase()} "
      else if /[ !"#$%&'()*+,./;<=>?@\[\\\]^`{|}~]/.test character
        "\\#{character}"
      else
        escape character
          .replace /\%/g, '\\'

    return characters.join ''


  # escapes special characters in attributes
  sanitizeAttribute: (item) ->
    if @options.quote_attribute_when_needed
      return @quoteAttribute item

    characters = (item.split '').map (character) ->
      # colon is valid character in an attribute, but has to be escaped before
      # being used in a selector, because it would clash with the CSS syntax
      if character is ':'
        "\\#{':'.charCodeAt(0).toString(16).toUpperCase()} "
      else if /[ !"#$%&'()*+,./;<=>?@\[\\\]^`{|}~]/.test character
        "\\#{character}"
      else
        escape character
          .replace /\%/g, '\\'

    return characters.join ''

  quoteAttribute: (item) ->

    quotesNeeded = false
    characters = (item.split '').map (character) ->
      # colon is valid character in an attribute, but has to be escaped before
      # being used in a selector, because it would clash with the CSS syntax
      if character is ':'
        quotesNeeded = true
        character
      else if character is "'"
        quotesNeeded = true
        "\\#{character}"
      else
        quotesNeeded = quotesNeeded or ( escape character is not character )
        character

    if quotesNeeded
      return "'" + ( characters.join '' ) + "'"

    return characters.join ''

  getIdSelector: (element) ->
    prefix = if @options.prefix_tag then @getTagSelector element else ''
    id = element.getAttribute 'id'

    id_blacklist = @options.id_blacklist.concat( [ '', /\s/, /^\d/ ] )

    # ID must... exist, not to be empty and not to contain whitespace
    if (
      id and
      # ...exist
      id? and
      # ...not be empty
      (id isnt '') and
      (
        @inList(id, @options.id_whitelist) or
        (not @inList id, id_blacklist)
      )
      # ...not contain whitespace
      # not (/\s/.exec id) and
      # ...not start with a number
      # not (/^\d/.exec id)
    )
      sanitized_id = prefix + "##{@sanitizeItem id}"
      # ID must match single element
      document = @options.root_node || element.ownerDocument
      if document.querySelectorAll(sanitized_id).length is 1
        return sanitized_id

    null

  inList: (item, list) ->
    return list.some (x) ->
      return x == item if typeof(x) == 'string'
      return x.test item

  itemMatches: (searchedItem, list) ->
    for item in list
      if typeof searchedItem == 'string'
        return item if searchedItem == item
      else
        return item if searchedItem.test item
    return null

  getClassSelectors: (element) ->
    result = []
    class_string = element.getAttribute 'class'
    if class_string?
      # remove multiple whitespaces
      class_string = class_string.replace /\s+/g, ' '
      # trim whitespace
      class_string = class_string.replace /^\s|\s$/g, ''
      if class_string isnt ''
        classes = class_string.split /\s+/
        for item in @options.class_whitelist
          found = @itemMatches item, classes
          if found
            result.push ".#{@sanitizeItem found}"
        for item in classes
          if not @inList item, @options.class_blacklist
            if not @inList item, @options.class_whitelist
              result.push ".#{@sanitizeItem item}"
    result

  getAttributeSelectors: (element) ->
    result = []
    attributes = element.attributes

    append_attr = (attr_node) =>
      result.push "[#{attr_node.nodeName}=\
          #{@sanitizeAttribute attr_node.nodeValue}]"

    whitelist = @options.attribute_whitelist
    for a in attributes
      if @inList(a.nodeName, whitelist)
        append_attr a


    blacklist = @options.attribute_blacklist.concat(['id', 'class'])
    for a in attributes
      if not @inList(a.nodeName, blacklist) and
          not @inList(a.nodeName, whitelist)
        append_attr a

    result

  getNthChildSelector: (element) ->
    return @getNthSelector element, @nthSelectors.child

  getNthTypeSelector: (element) ->
    return @getNthSelector element, @nthSelectors.type

  getNthSelector: (element, selector) ->
    parent_element = element.parentNode
    prefix = ''
    if selector == @nthSelectors.type or @options.prefix_tag
      prefix = @getTagSelector element
    suffix = if selector == @nthSelectors.child then "child" else "of-type"
    if parent_element?
      counter = 0
      siblings = parent_element.childNodes
      for sibling in siblings
        if (
          @isElement(sibling) and
          (
            selector == @nthSelectors.child or
            @getTagSelector(sibling) == prefix
          )
        )
          counter++
          return "#{prefix}:nth-#{suffix}(#{counter})" if sibling is element
    null

  testSelector: (element, selector) ->
    is_unique = false
    if selector? and selector isnt ''
      document = @options.root_node || element.ownerDocument
      result = document.querySelectorAll selector
      is_unique = true if result.length is 1 and result[0] is element
    is_unique


  testUniqueness: (element, selector) ->
    parent = element.parentNode
    found_elements = parent.querySelectorAll selector
    found_elements.length is 1 and found_elements[0] is element


  # helper function that tests all combinations for uniqueness
  testCombinations: (element, items, tag) ->
    if not tag?
      tag = @getTagSelector element

    if not @options.prefix_tag
      for item in @getCombinations items
        return item if @testSelector element, item
      for item in @getCombinations items
        return item if @testUniqueness element, item

    # if tag selector is enabled, try attaching it
    for item in (@getCombinations(items).map (item) -> tag + item)
      return item if @testSelector element, item
    for item in (@getCombinations(items).map (item) -> tag + item)
      return item if @testUniqueness element, item

    return null


  getUniqueSelector: (element) ->
    tag_selector = @getTagSelector element

    for selector_type in @options.selectors
      switch selector_type

        # ID selector (no need to check for uniqueness)
        when 'id'
          selector = @getIdSelector element

        # tag selector (should return unique for BODY)
        when 'tag'
          if tag_selector && @testUniqueness element, tag_selector
            selector = tag_selector

        # class selector
        when 'class'
          selectors = @getClassSelectors element
          if selectors? and selectors.length isnt 0
            selector = @testCombinations element, selectors, tag_selector

        # attribute selector
        when 'attribute'
          selectors = @getAttributeSelectors element
          if selectors? and selectors.length isnt 0
            selector = @testCombinations element, selectors, tag_selector

        # nthchild selector
        when 'nthchild'
          selector = @getNthChildSelector element

        # nthtype selector
        when 'nthtype'
          selector = @getNthTypeSelector element

      return selector if selector

    return '*'


  getSelector: (element) ->
    selectors = []

    parents = @getParents element
    for item in parents
      @setOptions(@options.get_options item) if @options.get_options
      selector = @getUniqueSelector item
      if selector?
        selectors.unshift selector
        result = selectors.join ' > '
        return result if @testSelector element, result

    return null


  getCombinations: (items = []) ->
    # first item must be empty (seed), it will be removed later
    result = [[]]

    for i in [0..items.length - 1]
      for j in [0..result.length - 1]
        result.push result[j].concat items[i]

    # remove first empty item (seed)
    result.shift()

    # sort results by length, we want the shortest selectors to win
    result = result.sort (a, b) -> a.length - b.length

    # collapse combinations and add prefix
    result = result.map (item) -> item.join ''

    result


if define?.amd
  define [], -> CssSelectorGenerator
else
  root = if exports? then exports else this
  root.CssSelectorGenerator = CssSelectorGenerator
