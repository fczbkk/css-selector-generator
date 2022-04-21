import {getFallbackSelector} from './selector-fallback'
import {sanitizeOptions} from './utilities-options'
import {
  getClosestIdentifiableParent,
  sanitizeSelectorNeedle,
} from './utilities-selectors'
import {
  CssSelector,
  CssSelectorGeneratorOptionsInput,
} from './types'
import {testSelector} from './utilities-dom'
import {SELECTOR_SEPARATOR} from './constants'
import 'core-js'

/**
 * Generates unique CSS selector for an element.
 */
export function getCssSelector (
  needle: unknown,
  custom_options: CssSelectorGeneratorOptionsInput = {},
): CssSelector {
  const elements = sanitizeSelectorNeedle(needle)
  const options = sanitizeOptions(elements[0], custom_options)
  let partialSelector = ''
  let currentRoot = options.root

  /**
   * Utility function to make subsequent calls shorter.
   */
  function updateIdentifiableParent () {
    return getClosestIdentifiableParent(
      elements,
      currentRoot,
      partialSelector,
      options,
    )
  }

  let closestIdentifiableParent = updateIdentifiableParent()
  while (closestIdentifiableParent) {
    const {
      foundElements,
      selector,
    } = closestIdentifiableParent
    if (testSelector(elements, selector, options.root)) {
      return selector
    }
    currentRoot = foundElements[0]
    partialSelector = selector
    closestIdentifiableParent = updateIdentifiableParent()
  }

  // if failed to find single selector matching all elements, try to find
  // selector for each standalone element and join them together
  if (elements.length > 1) {
    return elements
      .map((element) => getCssSelector(element, options))
      .join(SELECTOR_SEPARATOR)
  }

  return getFallbackSelector(elements)
}

export default getCssSelector
