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
      result = (".#{item}" for item in class_string.split /\s+/)
    result
  
  getAttributeSelectors: (element) ->
    result = []
    blacklist = ['id', 'class']
    for attribute in element.attributes
      if blacklist.indexOf(attribute.nodeName) is -1
        result.push "[#{attribute.nodeName}=#{attribute.nodeValue}]"
    result
  
  getNthChildSelector: (element) ->
    parent_element = element.parentNode
    if parent_element?
      siblings = parent_element.querySelectorAll element.tagName.toLowerCase()
      for sibling, i in siblings
        if sibling is element
          return ":nth-child(#{i + 1})"
    null
  
  testSelector: (element, selector, root) ->
    if selector? and selector isnt ''
      result = root.querySelectorAll selector
      return result.length is 1 and result[0] is element
    false
  
  getAllSelectors: (element) ->
    {
      t: @getTagSelector element         # tag
      i: @getIdSelector element          # ID
      c: @getClassSelectors element      # classes
      a: @getAttributeSelectors element  # attributes
      n: @getNthChildSelector element    # n-th child
    }
  
  getSelectorVariants: (element) ->
    variants = []
    s = @getAllSelectors element
    if s.i?
      # if ID selector exists, no other selector is necessary
      variants.push s.i
    else
      # nothing, in case we can skip this element completly
      variants.push ''
      # class selectors
      variants.push s.c.join ''
      # class selectors with tagname
      variants.push s.t + s.c.join ''
      # n-th child selector with tagname
      variants.push s.t + s.n
    variants
  
  getRoot: (element, parents = @getParents element) ->
    # Get the top-most parent of the element. This is the root for elements
    # that are not appended to the document.
    root = parents[parents.length - 1]
    # If the element is appended to the document, us the document as root.
    root = root.parentNode if root.parentNode?
    root
  
  sanitizeVariant: (variant = '') ->
    # trim whitespace
    sanitized_variant = variant.replace /^\s+|\s+$/g, ''
    # replace multiple spaces with single space
    sanitized_variant = sanitized_variant.replace /\s\s+/, ' '
    sanitized_variant
  
  sanitizeVariantsList: (variants = []) ->
    sanitized_variants = []
    for variant in variants
      # Remove unnecessary whitespace.
      variant = @sanitizeVariant variant
      # Remove empty and non-unique selectors.
      is_empty = variant is ''
      is_unique = sanitized_variants.indexOf(variant) is -1
      sanitized_variants.push(variant) if is_unique and not is_empty
    sanitized_variants
  
  getVariantCombinations: (list1 = [], list2 = []) ->
    result = []
    
    if (list1? and list1.length isnt 0) and (not list2? or list2.length is 0)
      result = list1
    if (list2? and list2.length isnt 0) and (not list1? or list1.length is 0)
      result = list2
    
    for item1 in list1
      for item2 in list2
        result.push "#{item1} #{item2}"
    result
  
  getSelectorVariantsList: (
    element
    parents = @getParents element
    root = @getRoot element, parents
  ) ->
    variants = []
    for elm in parents
      if elm isnt root
        elm_variants = @getSelectorVariants elm
        variants = @getVariantCombinations elm_variants, variants
    @sanitizeVariantsList variants
  
  getSelector: (element) ->
    parents = @getParents element
    root = @getRoot element, parents
    variants = @getSelectorVariantsList element, parents, root
    for selector in variants
      return selector if @testSelector element, selector, root
    null
  
root = if exports? then exports else this
root.CssSelectorGenerator = CssSelectorGenerator