/**
 * Constructs default options with proper root node for given element.
 * @see {@link getRootNode} for further info
 * @param {Element} element
 * @returns {Object}
 */
export function constructDefaultOptions(element: Element): any;
export const DESCENDANT_OPERATOR: " > ";
export const CHILD_OPERATOR: " ";
export namespace DEFAULT_OPTIONS {
    const selectors: string[];
    const includeTag: boolean;
    const whitelist: any[];
    const blacklist: any[];
    const combineWithinSelector: boolean;
    const combineBetweenSelectors: boolean;
}
export const INVALID_ID_RE: RegExp;
export const INVALID_CLASS_RE: RegExp;
export const SELECTOR_PATTERN: string[];
