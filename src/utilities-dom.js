import isElement from 'iselement';

/**
 * Check whether element is matched uniquely by selector.
 * @param element
 * @param selector
 * @param [root]
 * @return {boolean}
 */
export function testSelector (element, selector, root = document) {
  const result = root.querySelectorAll(selector);
  return (result.length === 1 && result[0] === element);
}

/**
 * Check whether element is matched uniquely by selector among root's immediate children. Works similarly to :scope > *.
 * @param element
 * @param selector
 * @param [root]
 * @return {boolean}
 */
export function testSelectorOnChildren (element, selector, root = document) {
  const result = [...root.querySelectorAll(selector)];
  const children = result.filter(e => e.parentNode === root);
  return children.length === 1 && children.includes(element);
}

/**
 * Find all parent elements of the element.
 * @param {Element} element
 * @param {Element} root
 * @return {Array.<Element>}
 */
export function getParents (element, root = getRootNode(element)) {
  return [...generateParents(element, root)];
}

/**
 * Generate all parent elements of the element.
 * @param {Element} element
 * @param {Element} root
 * @return {Array.<Element>}
 */
export function *generateParents (element, root = getRootNode(element)) {
  let parent = element;
  while (isElement(parent) && parent !== root) {
    yield parent;
    parent = parent.parentElement;
  }
}

/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 * @param {Element} element
 * @returns {Element}
 */
export function getRootNode (element) {
  return element.ownerDocument.querySelector(':root');
}
