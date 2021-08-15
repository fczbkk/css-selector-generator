import {getParents} from './utilities-dom'
import {getNthChildSelector} from './selector-nth-child'
import {DESCENDANT_OPERATOR, SELECTOR_SEPARATOR} from './constants';
import {CssSelector, SelectorNeedle} from './types';
import {sanitizeSelectorNeedle} from './utilities-selectors';

export function constructFallbackSelector (element: Element): CssSelector {
  const selectors = getParents(element)
    .map((element) => getNthChildSelector(element)[0])
    .reverse()
  return [':root', ...selectors].join(DESCENDANT_OPERATOR)
}

/**
 * Creates chain if :nth-child selectors from root to the element.
 */
export function getFallbackSelector (needle: SelectorNeedle): CssSelector {
  const elements = sanitizeSelectorNeedle(needle)
  return elements.map(constructFallbackSelector).join(SELECTOR_SEPARATOR)
}