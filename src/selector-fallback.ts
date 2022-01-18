import {getElementParents} from './utilities-dom'
import {getNthChildSelector} from './selector-nth-child'
import {DESCENDANT_OPERATOR, SELECTOR_SEPARATOR} from './constants'
import {CssSelector} from './types'

/**
 * Creates fallback selector for single element.
 */
export function getElementFallbackSelector (element: Element): CssSelector {
  const selectors = getElementParents(element)
    .map((element) => getNthChildSelector([element])[0])
    .reverse()
  return [':root', ...selectors].join(DESCENDANT_OPERATOR)
}

/**
 * Creates chain of :nth-child selectors from root to the elements.
 */
export function getFallbackSelector (elements: Element[]): CssSelector {
  return elements.map(getElementFallbackSelector).join(SELECTOR_SEPARATOR)
}
