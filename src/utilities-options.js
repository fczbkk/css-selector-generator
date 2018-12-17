import {DEFAULT_OPTIONS} from './constants';

/**
 * Makes sure the options object contains all required keys.
 * @param {Object} [custom_options]
 * @return {css_selector_generator_options}
 */
export function sanitizeOptions (custom_options = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, custom_options);

  // add never-matching item to blacklist so that it will always fail if empty
  if (options.blacklist.length === 0) {
    options.blacklist.push('.^');
  }

  return options;
}
