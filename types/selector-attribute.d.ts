import { CssSelector } from './types';
export declare const ATTRIBUTE_BLACKLIST: RegExp;
/**
 * Get attribute selectors for an element.
 */
export declare function attributeNodeToSelector({ nodeName, nodeValue }: Node): CssSelector;
/**
 * Checks whether attribute should be used as a selector.
 */
export declare function isValidAttributeNode({ nodeName }: Node): boolean;
/**
 * Get attribute selectors for an element.
 */
export declare function getElementAttributeSelectors(element: Element): CssSelector[];
/**
 * Get attribute selectors matching all elements.
 */
export declare function getAttributeSelectors(elements: Element[]): CssSelector[];
