class CssSelectorGenerator
  constructor: ->
  
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
  
  getIdSelector: (element) ->
    id = element.getAttribute 'id'
    if id? then "##{id}" else null
  
  getClassSelectors: (element) ->
    result = []
    class_string = element.getAttribute 'class'
    if class_string?
      # remove multiple whitespaces
      class_string = class_string.replace /\s+/g, ' '
      # trim whitespace
      class_string = class_string.replace /^\s|\s$/g, ''
      if class_string isnt ''
        result = (".#{item}" for item in class_string.split /\s+/)
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
  
  testSelector: (element, selector, root = document) ->
    is_unique = false
    if selector? and selector isnt ''
      result = root.querySelectorAll selector
      is_unique = true if result.length is 1 and result[0] is element
    is_unique
  
  getAllSelectors: (element) ->
    {
      t: @getTagSelector element         # tag
      i: @getIdSelector element          # ID
      c: @getClassSelectors element      # classes
      a: @getAttributeSelectors element  # attributes
      n: @getNthChildSelector element    # n-th child
    }
  
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
  
root = if exports? then exports else this
root.CssSelectorGenerator = CssSelectorGenerator