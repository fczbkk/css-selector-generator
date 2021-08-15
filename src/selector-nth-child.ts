import isElement from 'iselement'
import {CssSelector} from './types';
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
export function getNthChildSelector(elements: Element[]): Array<CssSelector> {
  return getIntersection(elements.map(getElementNthChildSelector))
}
