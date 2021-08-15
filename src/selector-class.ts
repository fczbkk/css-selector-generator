import {sanitizeSelectorItem} from './utilities-selectors';
import {INVALID_CLASS_RE} from './constants'
import {CssSelector} from './types';
import {getIntersection} from './utilities-data';

/**
 * Get class selectors for an element.
 */
export function getElementClassSelectors (element: Element): Array<CssSelector> {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => !INVALID_CLASS_RE.test(item))
    .map((item) => `.${sanitizeSelectorItem(item)}`)
}

/**
 * Get class selectors matching all elements.
 */
export function getClassSelectors (elements: Element[]): Array<CssSelector> {
  const elementSelectors = elements.map(getElementClassSelectors)
  return getIntersection(elementSelectors)
}
