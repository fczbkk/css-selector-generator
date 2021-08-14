import { CssSelector } from './types';
/**
 * Check whether element is matched uniquely by selector.
 */
export declare function testSelector(element: Element, selector: CssSelector, root?: ParentNode): boolean;
/**
 * Find all parent elements of the element.
 */
export declare function getParents(element: Element, root?: ParentNode): Array<Element>;
/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export declare function getRootNode(element: Element): ParentNode;
