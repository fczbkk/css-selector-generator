import {
  CssSelectorGeneratorOptions,
  CssSelectorMatch,
  CssSelectorType
} from './types';
import {VALID_SELECTOR_TYPES} from './constants';

export const DEFAULT_OPTIONS = {
  selectors: ['id', 'class', 'tag', 'attribute'] as Array<CssSelectorType>,
  // if set to true, always include tag name
  includeTag: false,
  whitelist: [] as Array<CssSelectorMatch>,
  blacklist: [] as Array<CssSelectorMatch>,
  combineWithinSelector: true,
  combineBetweenSelectors: true
};

/**
 * Constructs default options with proper root node for given element.
 * @see {@link getRootNode} for further info
 */
export function constructDefaultOptions (element: Element) {
  return {
    ...DEFAULT_OPTIONS,
    root: element.ownerDocument.querySelector(':root')
  };
}

export function sanitizeSelectorTypes (input: unknown): Array<CssSelectorType> {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.filter((item) => VALID_SELECTOR_TYPES.includes(item));
}

/**
 * Makes sure the options object contains all required keys.
 * @param {Element} element
 * @param {Object} [custom_options]
 * @return {css_selector_generator_options}
 */
export function sanitizeOptions (element: Element, custom_options = {}): CssSelectorGeneratorOptions {
  const options = Object.assign(
    constructDefaultOptions(element),
    custom_options
  );

  options.selectors = sanitizeSelectorTypes(options.selectors);

  return options;
}
