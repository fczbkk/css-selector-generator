import { CssSelector, CssSelectorGenerated } from './types';
/**
 * Get tag selector for an element.
 */
export declare function getElementTagSelectors(element: Element): CssSelectorGenerated[];
/**
 * Get tag selector for list of elements.
 */
export declare function getTagSelector(elements: Element[]): Array<CssSelector>;
