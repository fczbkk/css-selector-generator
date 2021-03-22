import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {getFallbackSelector} from './selector-fallback';
import {sanitizeOptions} from './utilities-options';
import {getClosestIdentifiableParent} from './utilities-selectors';
import {CssSelector} from './types';

/**
 * Generates unique CSS selector for an element.
 */
export function getCssSelector (
  element: Element,
  custom_options = {}
): CssSelector {
  const options = sanitizeOptions(element, custom_options);
  let partialSelector = '';
  let currentRoot = options.root;

  /**
   * Utility function to make subsequent calls shorter.
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
    const {
      foundElement,
      selector
    } = closestIdentifiableParent;
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
