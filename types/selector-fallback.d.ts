import { CssSelector } from "./types.js";
/**
 * Creates fallback selector for single element.
 */
export declare function getElementFallbackSelector(element: Element): CssSelector;
/**
 * Creates chain of :nth-child selectors from root to the elements.
 */
export declare function getFallbackSelector(elements: Element[]): CssSelector;
