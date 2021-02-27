/**
 * Generates unique CSS selector for an element.
 * @param {Element} element
 * @param {css_selector_generator_options} [custom_options]
 * @return {string}
 */
export function getCssSelector(element: Element, custom_options?: css_selector_generator_options): string;
export default getCssSelector;
export type css_selector_generator_options = {
    /**
     * - List of selector types to use. They will be prioritised by their order.
     */
    selectors?: Array<css_selector_type>;
    /**
     * - List of selectors that should be prioritised.
     */
    whitelist?: Array<RegExp | string>;
    /**
     * - List of selectors that should be ignored.
     */
    blacklist?: Array<RegExp | string>;
    /**
     * - Root element inside which the selector will be generated. If not set, the document root will be used.
     */
    root?: Element;
    /**
     * - If set to `true`, the generator will test combinations of selectors of single type (e.g. multiple class selectors).
     */
    combineWithinSelector?: boolean;
    /**
     * - If set to `true`, the generator will try to test combinations of selectors of different types (e.g. tag + class name).
     */
    combineBetweenSelectors?: boolean;
    /**
     * - If set to `true`, all generated selectors will include the TAG part. Even if tag selector type is not included in `selectors` option.
     */
    includeTag?: boolean;
};
export type css_selector_type = "class" | "id" | "tag" | "attribute" | "nthoftype" | "nthchild";
