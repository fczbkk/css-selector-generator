import {getElementParents} from './utilities-dom'
import {SELECTOR_SEPARATOR} from './constants'
import {CssSelector, CssSelectorType, OPERATOR} from './types'
import {
  constructElementSelector,
  createElementData
} from './utilities-element-data'

/**
 * Creates fallback selector for single element.
 */
export function getElementFallbackSelector (element: Element): CssSelector {
  const parentElements = getElementParents(element).reverse()
  const elementsData = parentElements.map((element) => {
    const elementData = createElementData(
      element,
      [CssSelectorType.nthchild],
      OPERATOR.DESCENDANT
    )
    elementData.selectors.nthchild.forEach((selectorData) => {
      selectorData.include = true
    })
    return elementData
  })

  return [':root', ...elementsData.map(constructElementSelector)].join('')
}

/**
 * Creates chain of :nth-child selectors from root to the elements.
 */
export function getFallbackSelector (elements: Element[]): CssSelector {
  return elements.map(getElementFallbackSelector).join(SELECTOR_SEPARATOR)
}
