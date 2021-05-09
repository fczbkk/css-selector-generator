import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { CssSelector } from './types';
/**
 * Generates unique CSS selector for an element.
 */
export declare function getCssSelector(element: Element, custom_options?: {}): CssSelector;
export default getCssSelector;
