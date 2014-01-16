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
  
  getOptimisedSelector: (element) ->
    parents = @getParents element
    root = parents[parents.length - 1]
    root = root.parentNode if root.parentNode?
    variants = null
    for elm in parents
      if elm isnt root
        elm_variants = @getSelectorVariants elm
        if variants?
          old_variants = variants.slice()
          for elm_variant in elm_variants
            for old_variant in old_variants
              new_variant = "#{elm_variant} #{old_variant}"
              new_variant = new_variant.replace /(^\s*)|(\s*$)/g, ''
              if variants.indexOf new_variant is -1
                variants.push new_variant
        else
          variants = elm_variants
    for selector in variants
      return selector if @testSelector element, selector, root
    null
  
  getSelector: (element) ->
    parents = @getParents element
    root = parents[parents.length - 1]
    root = root.parentNode if root.parentNode?
    selectors = []
    for elm in parents
      if elm isnt root
        s = @getAllSelectors elm
        selectors.unshift '' +
          s.t +
          (if s.i? then s.i else '') +
          s.c.join('') +
          s.a.join('') +
          s.n
    selectors.join ' '
  
root = if exports? then exports else this
root.CssSelectorGenerator = CssSelectorGenerator