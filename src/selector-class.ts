import {sanitizeSelectorItem} from './utilities-selectors'
import {INVALID_CLASS_RE} from './constants'
import {CssSelectorGenerated} from './types'
import {getIntersection} from './utilities-data'

/**
 * Get class selectors for an element.
 */
export function getElementClassSelectors (
  element: Element
): CssSelectorGenerated[] {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => !INVALID_CLASS_RE.test(item))
    .map((item) => `.${sanitizeSelectorItem(item)}` as CssSelectorGenerated)
}

/**
 * Get class selectors matching all elements.
 */
export function getClassSelectors (
  elements: Element[]
): CssSelectorGenerated[] {
  const elementSelectors = elements.map(getElementClassSelectors)
  return getIntersection(elementSelectors)
}
