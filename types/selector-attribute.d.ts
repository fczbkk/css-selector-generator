import { CssSelectorGenerated } from './types.js';
export declare const attributeBlacklistMatch: import("./types.js").PatternMatcher;
/**
 * Get simplified attribute selector for an element.
 */
export declare function attributeNodeToSimplifiedSelector({ nodeName, }: Node): CssSelectorGenerated;
/**
 * Get attribute selector for an element.
 */
export declare function attributeNodeToSelector({ nodeName, nodeValue, }: Node): CssSelectorGenerated;
/**
 * Checks whether attribute should be used as a selector.
 */
export declare function isValidAttributeNode({ nodeName }: Node, element: Element): boolean;
/**
 * Get attribute selectors for an element.
 */
export declare function getElementAttributeSelectors(element: Element): CssSelectorGenerated[];
/**
 * Get attribute selectors matching all elements.
 */
export declare function getAttributeSelectors(elements: Element[]): CssSelectorGenerated[];
