import isElement from 'iselement'
import {CssSelector, SelectorNeedle} from './types';
import {getIntersection} from './utilities-data';
import {sanitizeSelectorNeedle} from './utilities-selectors';

/**
 * Check whether element is matched uniquely by selector.
 */
export function testSelector (
  elements: Element[],
  selector: CssSelector,
  root: ParentNode = document
): boolean {
  const result = [...root.querySelectorAll(selector)]
  return (
    result.length === elements.length
    && elements.every((element) => result.includes(element))
  )
}

export function testMultiSelector (
  element: Element,
  selector: CssSelector,
  root: ParentNode = document
): boolean {
  const result = [...root.querySelectorAll(selector)]
  return result.includes(element)
}

export function getElementParents (
  element: Element,
  root: ParentNode
): Element[] {
  const result = []
  let parent = element
  while (isElement(parent) && parent !== root) {
    result.push(parent)
    parent = parent.parentElement
  }
  return result
}

/**
 * Find all parent elements of the element.
 */
export function getParents (
  elements: Element[],
  root?: ParentNode
): Element[] {
  root = root ?? getRootNode(elements[0])
  return getIntersection(elements.map((element) => getElementParents(element, root)))
}

/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export function getRootNode (element: Element): ParentNode {
  return element.ownerDocument.querySelector(':root')
}
