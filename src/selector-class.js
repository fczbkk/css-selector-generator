import {sanitizeSelectorItem} from './utilities-selectors';
import {INVALID_CLASS_RE} from './constants';

/**
 * Get class selectors for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getClassSelectors (element) {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => !INVALID_CLASS_RE.test(item))
    .map((item) => `.${sanitizeSelectorItem(item)}`);
}
