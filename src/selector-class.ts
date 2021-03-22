import {sanitizeSelectorItem} from './utilities-selectors'
import {INVALID_CLASS_RE} from './constants'
import {CssSelector} from './types'

/**
 * Get class selectors for an element.
 */
export function getClassSelectors (element: Element): Array<CssSelector> {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => !INVALID_CLASS_RE.test(item))
    .map((item) => `.${sanitizeSelectorItem(item)}`)
}
