import {
  sanitizeSelectorItem,
  sanitizeSelectorNeedle
} from './utilities-selectors';
import {INVALID_ID_RE} from './constants'
import {testSelector} from './utilities-dom'
import {CssSelector, SelectorNeedle} from './types';

/**
 * Get ID selector for an element.
 */
export function getIdSelector (needle: SelectorNeedle): Array<CssSelector> {
  const elements = sanitizeSelectorNeedle(needle)
  if (elements.length === 0 || elements.length > 1) {
    return []
  }
  const element = elements[0]
  const id = element.getAttribute('id') || ''
  const selector = `#${sanitizeSelectorItem(id)}`
  return (
    !INVALID_ID_RE.test(id)
    && testSelector(element, selector, element.ownerDocument)
  )
    ? [selector]
    : []
}
