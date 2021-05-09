import { CssSelector } from './types';
export declare const ATTRIBUTE_BLACKLIST: RegExp;
/**
 * Get attribute selectors for an element.
 */
export declare function getAttributeSelectors(element: Element): Array<CssSelector>;
