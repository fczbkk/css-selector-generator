/**
 * Escapes special characters used by CSS selector items.
 * @param {string} input
 * @return {string}
 */
export function sanitizeSelectorItem(input?: string): string;
/**
 * Returns list of selectors of given type for the element.
 * @param {Element} element
 * @param {string} selector_type
 * @return {Array.<string>} - Always an array, even if the selector only allows single value (e.g. tag).
 */
export function getSelectorsByType(element: Element, selector_type: string): Array<string>;
/**
 * Remove blacklisted selectors from list.
 * @param {Array.<string>} list
 * @param {RegExp} blacklist_re
 * @param {RegExp} whitelist_re
 * @return {Array.<string>}
 */
export function filterSelectors(list: Array<string>, blacklist_re: RegExp, whitelist_re: RegExp): Array<string>;
/**
 * Prioritise whitelisted selectors in list.
 * @param {Array.<string>} list
 * @param {RegExp} whitelist_re
 * @return {Array.<string>}
 */
export function orderSelectors(list: Array<string>, whitelist_re: RegExp): Array<string>;
/**
 * Tries to generate unique selector for the element within it's parent.
 * @param {Element} element
 * @param {css_selector_generator_options} options
 * @return {string} Either unique selector or "*" if not possible.
 */
export function getUniqueSelectorWithinParent(element: Element, options: any): string;
/**
 * Creates object containing all selector types and their potential values.
 * @param {Element} element
 * @param {css_selector_generator_options} options
 * @return {Object}
 */
export function getSelectorsList(element: Element, options: any): any;
/**
 * Creates list of selector types that we will need to generate the selector.
 * @param {css_selector_generator_options} options
 * @return {Array.<string>}
 */
export function getSelectorsToGet(options: any): Array<string>;
/**
 *
 * @param {Object} selectors_list
 * @param {css_selector_generator_options} options
 * @return {Array.<Array.<string>>}
 */
export function combineSelectorTypes(selectors_list: any, options?: any): Array<Array<string>>;
/**
 *
 * @param {Object} selectors_list
 * @param {css_selector_generator_options} options
 * @return {Array.<Array.<string>>}
 */
export function getTypeCombinations(selectors_list: any, options: any): Array<Array<string>>;
/**
 * Generates all variations of possible selectors from provided data.
 * @param {Array.<string>} selector_types
 * @param {Object} selectors_by_type
 * @return {Array.<string>}
 */
export function constructSelectors(selector_types: Array<string>, selectors_by_type: any): Array<string>;
/**
 * Creates selector for given selector type. Combines several parts if needed.
 * @param {string} selector_type
 * @param {Object} selectors_data
 * @return {string}
 */
export function constructSelectorType(selector_type: string, selectors_data: any): string;
/**
 * Converts selector data object to a selector.
 * @param {Object} selector_data
 * @return {string}
 */
export function constructSelector(selector_data?: any): string;
export const ESCAPED_COLON: string;
export const SPECIAL_CHARACTERS_RE: RegExp;
export namespace SELECTOR_TYPE_GETTERS {
    export { getTagSelector as tag };
    export { getIdSelector as id };
    export { getClassSelectors as class };
    export { getAttributeSelectors as attribute };
    export { getNthChildSelector as nthchild };
    export { getNthOfTypeSelector as nthoftype };
}
import { getTagSelector } from "./selector-tag";
import { getIdSelector } from "./selector-id";
import { getClassSelectors } from "./selector-class";
import { getAttributeSelectors } from "./selector-attribute";
import { getNthChildSelector } from "./selector-nth-child";
import { getNthOfTypeSelector } from "./selector-nth-of-type";
