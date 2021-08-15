import {
  sanitizeSelectorItem,
  sanitizeSelectorNeedle
} from './utilities-selectors';
import {CssSelector, SelectorNeedle} from './types';

/**
 * Get tag selector for an element.
 */
export function getTagSelector (needle: SelectorNeedle): Array<CssSelector> {
  const elements = sanitizeSelectorNeedle(needle)
  const selectors = [...new Set(elements.map((element) => {
    return sanitizeSelectorItem(element.tagName.toLowerCase())
  }))]
  return (selectors.length === 0 || selectors.length > 1) ? [] : [selectors[0]]
}
