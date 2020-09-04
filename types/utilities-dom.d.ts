/**
 * Check whether element is matched uniquely by selector.
 * @param element
 * @param selector
 * @param [root]
 * @return {boolean}
 */
export function testSelector(element: any, selector: any, root?: Document): boolean;
/**
 * Find all parent elements of the element.
 * @param {Element} element
 * @param {Element} root
 * @return {Array.<Element>}
 */
export function getParents(element: Element, root?: Element): Array<Element>;
/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 * @param {Element} element
 * @returns {Element}
 */
export function getRootNode(element: Element): Element;
