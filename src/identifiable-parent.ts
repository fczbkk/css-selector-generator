import {CssSelectorTypes, IdentifiableParent} from './types'
import {createMemo, MemoizedSelectorGetter} from './memo'
import {
  getParents,
  getRootNode,
  testSelector
} from './utilities-dom'
import {constructSelector} from './utilities-selectors'
import {getPowerSet} from './utilities-powerset'

/**
 * Tries to find identifiable parent using provided selector types. Prefers simpler selectors by order in which they are provided, instead of closeness to the element.
 */
export function getIdentifiableParent (
  element: Element,
  selectorTypes: CssSelectorTypes = [] as CssSelectorTypes,
  root: ParentNode = getRootNode(element),
  getSelectorData: MemoizedSelectorGetter = createMemo()
): IdentifiableParent {
  for (const currentSelectorTypes of getPowerSet(selectorTypes)) {
    for (const currentElement of getParents(element, root)) {
      const selectorData = getSelectorData(currentElement, currentSelectorTypes)
      const selector = constructSelector(selectorData)
      if (selector !== '') {
        if (testSelector(currentElement, selector, root)) {
          return {
            foundElements: [currentElement],
            selector
          }
        }
      }
    }
  }
  return null
}
