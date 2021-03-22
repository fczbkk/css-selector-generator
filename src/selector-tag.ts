import {sanitizeSelectorItem} from './utilities-selectors'
import {CssSelector} from './types'

/**
 * Get tag selector for an element.
 */
export function getTagSelector (element: Element): Array<CssSelector> {
  return [sanitizeSelectorItem(element.tagName.toLowerCase())]
}
