import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {getFallbackSelector} from './selector-fallback';
import {sanitizeOptions} from './utilities-options';
import {getClosestIdentifiableParent} from './utilities-selectors';

/**
 * Generates unique CSS selector for an element.
 * @param {Element} element
 * @param {css_selector_generator_options} [custom_options]
 * @return {string}
 */
export function getCssSelector (element, custom_options = {}) {
  const options = sanitizeOptions(element, custom_options);
  let partialSelector = '';
  let currentRoot = options.root;

  /**
   * Utility function to make subsequent calls shorter.
   * @returns {{foundElement: Element, selector: string}}
   */
  function updateIdentifiableParent () {
    return getClosestIdentifiableParent(
      element,
      currentRoot,
      partialSelector,
      options
    );
  }

  let closestIdentifiableParent = updateIdentifiableParent();
  while (closestIdentifiableParent) {
    const {foundElement, selector} = closestIdentifiableParent;
    if (foundElement === element) {
      return selector;
    }
    currentRoot = foundElement;
    partialSelector = selector;
    closestIdentifiableParent = updateIdentifiableParent();
  }

  return getFallbackSelector(element);
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
