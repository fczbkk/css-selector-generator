import {sanitizeSelectorItem} from './utilities-selectors';

/**
 * Get tag selector for an element.
 */
export function getTagSelector (element: Element) {
  return [sanitizeSelectorItem(element.tagName.toLowerCase())];
}
