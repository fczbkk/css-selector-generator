import { getAttributeSelectors } from './selector-attribute';
import { getClassSelectors } from './selector-class';
import { getIdSelector } from './selector-id';
import { getNthChildSelector } from './selector-nth-child';
import { getNthOfTypeSelector } from './selector-nth-of-type';
import { getTagSelector } from './selector-tag';
import { CssSelector, CssSelectorData, CssSelectorGeneratorOptions, CssSelectorType, CssSelectorTypes, IdentifiableParent } from './types';
export declare const ESCAPED_COLON: string;
export declare const SPECIAL_CHARACTERS_RE: RegExp;
/**
 * Escapes special characters used by CSS selector items.
 */
export declare function sanitizeSelectorItem(input?: string): string;
/**
 * Legacy version of escaping utility, originally used for IE11-. Should
 * probably be replaced by a polyfill:
 * https://github.com/mathiasbynens/CSS.escape
 */
export declare function legacySanitizeSelectorItem(input?: string): string;
export declare const SELECTOR_TYPE_GETTERS: {
    tag: typeof getTagSelector;
    id: typeof getIdSelector;
    class: typeof getClassSelectors;
    attribute: typeof getAttributeSelectors;
    nthchild: typeof getNthChildSelector;
    nthoftype: typeof getNthOfTypeSelector;
};
/**
 * Returns list of selectors of given type for the element.
 */
export declare function getSelectorsByType(elements: Element[], selector_type: CssSelectorType): Array<CssSelector>;
/**
 * Remove blacklisted selectors from list.
 */
export declare function filterSelectors(list: Array<CssSelector>, blacklist_re: RegExp, whitelist_re: RegExp): Array<CssSelector>;
/**
 * Prioritise whitelisted selectors in list.
 */
export declare function orderSelectors(list: Array<CssSelector>, whitelist_re: RegExp): Array<CssSelector>;
/**
 * Returns list of unique selectors applicable to given element.
 */
export declare function getAllSelectors(elements: Element[], root: ParentNode, options: CssSelectorGeneratorOptions): Array<CssSelector>;
/**
 * Creates object containing all selector types and their potential values.
 */
export declare function getSelectorsList(elements: Element[], options: CssSelectorGeneratorOptions): CssSelectorData;
/**
 * Creates list of selector types that we will need to generate the selector.
 */
export declare function getSelectorsToGet(options: CssSelectorGeneratorOptions): CssSelectorTypes;
/**
 * Generates list of possible selector type combinations.
 */
export declare function combineSelectorTypes(options: CssSelectorGeneratorOptions): Array<CssSelectorTypes>;
/**
 * Generates list of combined CSS selectors.
 */
export declare function getTypeCombinations(selectors_list: CssSelectorData, options: CssSelectorGeneratorOptions): Array<Array<CssSelector>>;
/**
 * Generates all variations of possible selectors from provided data.
 */
export declare function constructSelectors(selector_types: CssSelectorTypes, selectors_by_type: CssSelectorData): Array<CssSelector>;
/**
 * Creates selector for given selector type. Combines several parts if needed.
 */
export declare function constructSelectorType(selector_type: CssSelectorType, selectors_data: CssSelectorData): CssSelector;
/**
 * Converts selector data object to a selector.
 */
export declare function constructSelector(selectorData?: CssSelectorData): CssSelector;
/**
 * Tries to find an unique CSS selector for element within given parent.
 */
export declare function getSelectorWithinRoot(elements: Element[], root: ParentNode, rootSelector: CssSelector, options: CssSelectorGeneratorOptions): (null | CssSelector);
/**
 * Climbs through parents of the element and tries to find the one that is
 * identifiable by unique CSS selector.
 */
export declare function getClosestIdentifiableParent(elements: Element[], root: ParentNode, rootSelector: CssSelector, options: CssSelectorGeneratorOptions): IdentifiableParent;
/**
 * Converts input into list of elements, removing duplicates and non-elements.
 */
export declare function sanitizeSelectorNeedle(needle: unknown): Element[];
