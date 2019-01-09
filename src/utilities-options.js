import {DEFAULT_OPTIONS} from './constants';

/**
 * Makes sure the options object contains all required keys.
 * @param {Object} [custom_options]
 * @return {css_selector_generator_options}
 */
export function sanitizeOptions (custom_options = {}) {
  return Object.assign({}, DEFAULT_OPTIONS, custom_options);
}
