import {constructDefaultOptions} from './constants';

/**
 * Makes sure the options object contains all required keys.
 * @param {Element} element
 * @param {Object} [custom_options]
 * @return {css_selector_generator_options}
 */
export function sanitizeOptions (element, custom_options = {}) {
  return Object.assign({}, constructDefaultOptions(element), custom_options);
}
