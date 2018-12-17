import {sanitizeSelectorItem} from './utilities-selectors';
import {INVALID_ID_RE} from './constants';
import {testSelector} from './utilities-dom';

/**
 * Get ID selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getIdSelector (element) {
  const id = element.getAttribute('id') || '';
  const selector = `#${sanitizeSelectorItem(id)}`;
  return (
    !INVALID_ID_RE.test(id)
    && testSelector(element, selector, element.ownerDocument)
  )
    ? [selector]
    : [];
}
