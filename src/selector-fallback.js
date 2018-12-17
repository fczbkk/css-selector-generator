import {getParents} from './utilities-dom';
import {getNthChildSelector} from './selector-nth-child';
import {DESCENDANT_OPERATOR} from './constants';

/**
 * Creates chain if :nth-child selectors from root to the element.
 * @param {Element} element
 * @param {Element} root
 * @return {string}
 */
export function getFallbackSelector (element, root) {
  return getParents(element, root)
    .map((element) => getNthChildSelector(element)[0])
    .reverse()
    .join(DESCENDANT_OPERATOR);
}
