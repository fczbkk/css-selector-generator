import {CssSelectorTypes, IdentifiableParent} from './types'
import {createMemo, MemoizedSelectorGetter} from './memo'
import {generateParents, getRootNode, testSelector} from './utilities-dom'
import powerSetGenerator from '@fczbkk/power-set-generator'
import {constructSelector} from './utilities-selectors'

/**
 * Tries to find identifiable parent using provided selector types. Prefers simpler selectors by order in which they are provided, instead of closeness to the element.
 */
export function getIdentifiableParent (
  element: Element,
  selectorTypes: CssSelectorTypes = [] as CssSelectorTypes,
  root: ParentNode = getRootNode(element),
  getSelectorData: MemoizedSelectorGetter = createMemo()
): IdentifiableParent {
  for (const currentSelectorTypes of powerSetGenerator(selectorTypes)) {
    for (const currentElement of generateParents(element, root)) {
      const selectorData = getSelectorData(currentElement, currentSelectorTypes)
      const selector = constructSelector(selectorData)
      if (selector !== '') {
        if (testSelector(currentElement, selector, root)) {
          return {
            foundElement: currentElement,
            selector
          }
        }
      }
    }
  }
  return null
}
