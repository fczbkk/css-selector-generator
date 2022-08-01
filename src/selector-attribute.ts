import {sanitizeSelectorItem} from './utilities-selectors.js'
import {
  createPatternMatcher,
  getIntersection
} from './utilities-data.js'
import {CssSelectorGenerated} from './types.js'

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
export function isValidAttributeNode (
  {nodeName}: Node,
  element: Element
): boolean {
  // form input value should not be used as a selector
  const tagName = element.tagName.toLowerCase()
  if (['input', 'option'].includes(tagName) && nodeName === 'value') {
    return false
  }

  return !attributeBlacklistMatch(nodeName)
}

/**
 * Get attribute selectors for an element.
 */
export function getElementAttributeSelectors (
  element: Element,
): CssSelectorGenerated[] {
  const validAttributes = Array.from(element.attributes)
    .filter((attributeNode) => isValidAttributeNode(attributeNode, element))
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
