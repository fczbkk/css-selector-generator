import {getParents} from './utilities-dom';
import {getNthChildSelector} from './selector-nth-child';
import {DESCENDANT_OPERATOR} from './constants';

/**
 * Creates chain if :nth-child selectors from root to the element.
 */
export function getFallbackSelector (element: Element) {
  const selectors = getParents(element)
    .map((element) => getNthChildSelector(element)[0])
    .reverse();
  return [':root', ...selectors].join(DESCENDANT_OPERATOR);
}
