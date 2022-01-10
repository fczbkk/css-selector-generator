import {sanitizeSelectorItem} from './utilities-selectors'
import {INVALID_ID_RE} from './constants'
import {testSelector} from './utilities-dom'
import {CssSelector} from './types'

/**
 * Get ID selector for an element.
 */
export function getIdSelector (elements: Element[]): Array<CssSelector> {
  if (elements.length === 0 || elements.length > 1) {
    return []
  }
  const element = elements[0]
  const id = element.getAttribute('id') || ''
  const selector = `#${sanitizeSelectorItem(id)}`
  const rootNode = element.getRootNode({composed: false})
  return (
    !INVALID_ID_RE.test(id)
    && testSelector([element], selector, rootNode)
  )
    ? [selector]
    : []
}
