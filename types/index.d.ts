import { CssSelector, CssSelectorGeneratorOptionsInput } from './types';
import 'core-js';
/**
 * Generates unique CSS selector for an element.
 */
export declare function getCssSelector(needle: unknown, custom_options?: CssSelectorGeneratorOptionsInput): CssSelector;
export default getCssSelector;
