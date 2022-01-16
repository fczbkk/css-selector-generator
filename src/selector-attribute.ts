import {sanitizeSelectorItem} from './utilities-selectors'
import {
  createPatternMatcher,
  getIntersection
} from './utilities-data'
import {CssSelectorGenerated} from './types'

// List of attributes to be ignored. These are handled by different selector types.
export const attributeBlacklistMatch = createPatternMatcher([
  'class',
  'id',
  // Angular attributes
  'ng-*',
])

/**
 * Get simplified attribute selector for an element.
 */
export function attributeNodeToSimplifiedSelector ({
  nodeName,
}: Node): CssSelectorGenerated {
  return `[${nodeName}]` as CssSelectorGenerated
}

/**
 * Get attribute selector for an element.
 */
export function attributeNodeToSelector ({
  nodeName,
  nodeValue,
}: Node): CssSelectorGenerated {
  const selector = `[${nodeName}='${sanitizeSelectorItem(nodeValue)}']`
  return selector as CssSelectorGenerated
}

/**
 * Checks whether attribute should be used as a selector.
 */
export function isValidAttributeNode ({nodeName}: Node): boolean {
  return !attributeBlacklistMatch(nodeName)
}

/**
 * Get attribute selectors for an element.
 */
export function getElementAttributeSelectors (
  element: Element,
): CssSelectorGenerated[] {
  const validAttributes = Array.from(element.attributes)
    .filter(isValidAttributeNode)
  return [
    ...validAttributes.map(attributeNodeToSimplifiedSelector),
    ...validAttributes.map(attributeNodeToSelector),
  ]

}

/**
 * Get attribute selectors matching all elements.
 */
export function getAttributeSelectors (
  elements: Element[],
): CssSelectorGenerated[] {
  const elementSelectors = elements.map(getElementAttributeSelectors)
  return getIntersection(elementSelectors)
}
