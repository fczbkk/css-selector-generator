import {sanitizeSelectorItem} from './utilities-selectors'
import {CssSelector, CssSelectorGenerated} from './types'
import {flattenArray} from './utilities-data'

/**
 * Get tag selector for an element.
 */
export function getElementTagSelectors (
  element: Element,
): CssSelectorGenerated[] {
  return [
    sanitizeSelectorItem(element.tagName.toLowerCase()) as CssSelectorGenerated,
  ]
}

/**
 * Get tag selector for list of elements.
 */
export function getTagSelector (elements: Element[]): Array<CssSelector> {
  const selectors = [
    ...new Set(flattenArray(elements.map(getElementTagSelectors))),
  ]
  return (selectors.length === 0 || selectors.length > 1) ? [] : [selectors[0]]
}
