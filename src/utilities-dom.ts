import isElement from 'iselement'
import {CssSelector} from './types'

/**
 * Check whether element is matched uniquely by selector.
 */
export function testSelector (
  element: Element,
  selector: CssSelector,
  root: ParentNode = document
): boolean {
  const result = root.querySelectorAll(selector)
  return (result.length === 1 && result[0] === element)
}

/**
 * Find all parent elements of the element.
 */
export function getParents (
  element: Element,
  root = getRootNode(element)
): Array<Element> {
  return [...generateParents(element, root)]
}

/**
 * Generate all parent elements of the element.
 */
export function *generateParents (
  element: Element,
  root: ParentNode = getRootNode(element)
): IterableIterator<Element> {
  let parent = element
  while (isElement(parent) && parent !== root) {
    yield parent
    parent = parent.parentElement
  }
}

/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export function getRootNode (element: Element): ParentNode {
  return element.ownerDocument.querySelector(':root')
}
