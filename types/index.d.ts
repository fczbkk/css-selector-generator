import { CssSelector, CssSelectorGeneratorOptions } from './types';
/**
 * Generates unique CSS selector for an element.
 */
export declare function getCssSelector(needle: unknown, custom_options?: Partial<CssSelectorGeneratorOptions>): CssSelector;
export default getCssSelector;
