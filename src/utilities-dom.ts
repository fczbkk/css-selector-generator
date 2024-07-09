import { isElement } from "./utilities-iselement.js";
import { CssSelector } from "./types.js";
import { getIntersection } from "./utilities-data.js";
import { sanitizeRoot } from "./utilities-options.js";

/**
 * Check whether element is matched uniquely by selector.
 */
export function testSelector(
  elements: Element[],
  selector: CssSelector,
  root?: Node,
): boolean {
  const result = Array.from(
    sanitizeRoot(root, elements[0]).querySelectorAll(selector),
  );
  return (
    result.length === elements.length &&
    elements.every((element) => result.includes(element))
  );
}

/**
 * Test whether selector targets element. It does not have to be a unique match.
 */
export function testMultiSelector(
  element: Element,
  selector: CssSelector,
  root: ParentNode,
): boolean {
  const result = Array.from(
    sanitizeRoot(root, element).querySelectorAll(selector),
  );
  return result.includes(element);
}

/**
 * Find all parents of a single element.
 */
export function getElementParents(
  element: Element,
  root?: ParentNode,
): Element[] {
  root = root ?? getRootNode(element);
  const result = [];
  let parent: Element | null = element;
  while (isElement(parent) && parent !== root) {
    result.push(parent);
    parent = parent.parentElement;
  }
  return result;
}

/**
 * Find all common parents of elements.
 */
export function getParents(elements: Element[], root?: ParentNode): Element[] {
  return getIntersection(
    elements.map((element) => getElementParents(element, root)),
  );
}

/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export function getRootNode(element: Element): ParentNode {
  // The `:root` selector always returns a parent node. The `null` return value is not applicable here.
  return element.ownerDocument.querySelector(":root");
}
