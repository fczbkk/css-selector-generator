import { CssSelector } from "./types.js";
/**
 * Check whether element is matched uniquely by selector.
 */
export declare function testSelector(elements: Element[], selector: CssSelector, root?: Node): boolean;
/**
 * Test whether selector targets element. It does not have to be a unique match.
 */
export declare function testMultiSelector(element: Element, selector: CssSelector, root: ParentNode): boolean;
/**
 * Find all parents of a single element.
 */
export declare function getElementParents(element: Element, root?: ParentNode): Element[];
/**
 * Find all common parents of elements.
 */
export declare function getParents(elements: Element[], root?: ParentNode): Element[];
/**
 * Returns root node for given element. This needs to be used because of document-less environments, e.g. jsdom.
 */
export declare function getRootNode(element: Element): ParentNode;
