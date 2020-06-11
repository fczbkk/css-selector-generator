import {getUniqueSelectorWithinParent} from './utilities-selectors';
import {getFallbackSelector} from './selector-fallback';
import {DESCENDANT_OPERATOR} from './constants';
import {sanitizeOptions} from './utilities-options';
import {getParents, testSelector} from './utilities-dom';

/**
 * Generates unique CSS selector for an element.
 * @param {Element} element
 * @param {css_selector_generator_options} [custom_options]
 * @return {string}
 */
export function getCssSelector (element, custom_options = {}) {
  const options = sanitizeOptions(element, custom_options);
  const parents = getParents(element, options.root);
  const result = [];

  // try to find optimized selector
  for (let i = 0; i < parents.length; i++) {
    result.unshift(getUniqueSelectorWithinParent(parents[i], options));
    const selector = result.join(DESCENDANT_OPERATOR);
    if (testSelector(element, selector, options.root)) {
      return selector;
    }
  }

  // use nth-child selector chain to root as fallback
  return getFallbackSelector(element, options.root);
}

export default getCssSelector;

/**
 * @typedef {Object} css_selector_generator_options
 * @property {Array.<css_selector_type>} [selectors] - List of selector types to use. They will be prioritised by their order.
 * @property {Array.<RegExp | string>} [whitelist] - List of selectors that should be prioritised.
 * @property {Array.<RegExp | string>} [blacklist] - List of selectors that should be ignored.
 * @property {Element} [root] - Root element inside which the selector will be generated. If not set, the document root will be used.
 * @property {boolean} [combineWithinSelector = true] - If set to `true`, the generator will test combinations of selectors of single type (e.g. multiple class selectors).
 * @property {boolean} [combineBetweenSelectors = true] - If set to `true`, the generator will try to test combinations of selectors of different types (e.g. tag + class name).
 * @property {boolean} [includeTag = false] - If set to `true`, all generated selectors will include the TAG part. Even if tag selector type is not included in `selectors` option.
 */

/**
 * @typedef {'id' | 'class' | 'tag' | 'attribute' | 'nthchild' | 'nthoftype'} css_selector_type
 */
