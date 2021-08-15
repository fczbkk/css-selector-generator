import {sanitizeSelectorItem} from './utilities-selectors'
import {INVALID_ID_RE} from './constants'
import {testSelector} from './utilities-dom'
import {CssSelector} from './types'

/**
 * Get ID selector for an element.
 */
export function getIdSelector (element: Element): Array<CssSelector> {
  const id = element.getAttribute('id') || ''
  const selector = `#${sanitizeSelectorItem(id)}`
  return (
    !INVALID_ID_RE.test(id)
    && testSelector(element, selector, element.ownerDocument)
  )
    ? [selector]
    : []
}
