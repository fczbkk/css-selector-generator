import {sanitizeSelectorItem} from './utilities-selectors';

/**
 * Get tag selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getTagSelector (element) {
  return [sanitizeSelectorItem(element.tagName.toLowerCase())];
}
