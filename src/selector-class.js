import {sanitizeSelectorItem} from './utilities-selectors';

/**
 * Get class selectors for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getClassSelectors (element) {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => item !== '')
    .map((item) => `.${sanitizeSelectorItem(item)}`);
}
