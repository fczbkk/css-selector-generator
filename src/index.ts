import { getFallbackSelector } from "./selector-fallback.js";
import { sanitizeOptions } from "./utilities-options.js";
import {
  sanitizeSelectorNeedle,
  selectorGenerator,
} from "./utilities-selectors.js";
import { CssSelector, CssSelectorGeneratorOptionsInput } from "./types.js";
import { getRootNode } from "./utilities-dom.js";
import { SELECTOR_SEPARATOR } from "./constants.js";

/**
 * Generates unique CSS selector for an element.
 */
export function getCssSelector(
  needle: Element | Element[],
  custom_options: Omit<CssSelectorGeneratorOptionsInput, "maxResults"> = {},
): CssSelector {
  const options = { ...custom_options, maxResults: 1 };
  const generator = cssSelectorGenerator(needle, options);
  const firstResult = generator.next();
  return firstResult.value as CssSelector;
}

/**
 * Generates unique CSS selector for an element.
 */
export function* cssSelectorGenerator(
  needle: Element | Element[],
  custom_options: CssSelectorGeneratorOptionsInput = {},
): IterableIterator<CssSelector> {
  const elements = sanitizeSelectorNeedle(needle as unknown);
  const options = sanitizeOptions(elements[0], custom_options);
  const root = options.root ?? getRootNode(elements[0]);
  let foundResults = 0;

  for (const selector of selectorGenerator({
    elements,
    options,
    root,
    rootSelector: "",
  })) {
    yield selector;
    foundResults++;
    if (foundResults >= options.maxResults) {
      return;
    }
  }

  // if failed to find single selector matching all elements, try to find
  // selector for each standalone element and join them together
  if (elements.length > 1) {
    yield elements
      .map((element) => getCssSelector(element, options))
      .join(SELECTOR_SEPARATOR);
    foundResults++;
    if (foundResults >= options.maxResults) {
      return;
    }
  }

  yield getFallbackSelector(elements, options.useScope ? root : undefined);
}

export default getCssSelector;
