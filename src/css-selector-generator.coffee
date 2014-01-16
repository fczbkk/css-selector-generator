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
    if id? then "##{id}" else ''
  
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
    ''
  
  testSelector: (element, selector, root) ->
    result = root.querySelectorAll selector
    result.length is 1 and result[0] is element
  
  getSelector: (element) ->
    parents = @getParents element
    root = parents[parents.length - 1]
    root = root.parentNode if root.parentNode?
    selectors = []
    for elm in parents
      if elm isnt root
        selectors.unshift '' +
          (@getTagSelector elm) +
          (@getIdSelector elm) +
          (@getClassSelectors elm).join('') +
          (@getAttributeSelectors elm).join('') +
          (@getNthChildSelector elm)
    selectors.join ' '
  
root = if exports? then exports else this
root.CssSelectorGenerator = CssSelectorGenerator