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
  const result = []
  let parent = element
  while (isElement(parent) && parent !== root) {
    result.push(parent)
    parent = parent.parentElement
  }
  return result
}

/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export function getRootNode (element: Element): ParentNode {
  return element.ownerDocument.querySelector(':root')
}
