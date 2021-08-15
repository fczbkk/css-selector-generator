import isElement from 'iselement'
import {CssSelector, SelectorNeedle} from './types';
import {sanitizeSelectorNeedle} from './utilities-selectors';
import {getIntersection} from './utilities-data';

/**
 * Get nth-child selector for an element.
 */
export function getElementNthChildSelector (element: Element): Array<CssSelector> {
  const parent = element.parentNode

  if (parent) {
    const siblings = [...parent.childNodes].filter(isElement)
    const elementIndex = siblings.indexOf(element)
    if (elementIndex > -1) {
      return [`:nth-child(${elementIndex + 1})`]
    }
  }

  return []
}

/**
 * Get nth-child selector matching all elements.
 */
export function getNthChildSelector(needle: SelectorNeedle): Array<CssSelector> {
  const elements = sanitizeSelectorNeedle(needle)
  return getIntersection(elements.map(getElementNthChildSelector))
}
