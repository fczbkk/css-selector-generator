import { testSelector } from "./utilities-dom";
import {
  CssSelectorGeneratorOptions,
  CssSelectorGeneratorOptionsInput,
  CssSelectorsByType,
  CssSelectorType,
} from "./types.js";
import {
  constructSelector,
  sanitizeSelectorNeedle,
} from "./utilities-selectors.js";
import { sanitizeOptions } from "./utilities-options.js";
import { getFallbackSelector } from "./selector-fallback.js";
import { getPowerSet, powerSetGenerator } from "./utilities-powerset.js";
import { createMemo } from "./memo.js";
import { getCartesianProduct } from "./utilities-cartesian.js";

/**
 * Returns closest parent element that is common for all needle elements. Returns `null` if no such element exists.
 */
export function getCommonParent(needle: Element[]) {
  if (needle.length > 0) {
    let parent = needle[0].parentElement;

    // optimization for single element
    if (needle.length === 1) {
      return parent;
    }

    // find common parent for multiple elements
    while (parent) {
      if (needle.every((element) => parent.contains(element))) {
        return parent;
      }
      parent = parent.parentElement;
    }
  }
  return null;
}

/**
 * Yields all common parents of the needle, starting with the one closest to the needle.
 */
export function* parentsGenerator(needle: Element[], root: ParentNode) {
  let parent = getCommonParent(needle);
  while (parent && root.contains(parent)) {
    yield parent;
    parent = parent.parentElement;
  }
}

/**
 * Yields all parents of the needle that when used as a root for selector, will only match the needle.
 */
export function* viableParentsGenerator(
  needle: Element[],
  needleSelector: string,
  root?: ParentNode,
) {
  for (const parentCandidate of parentsGenerator(needle, root)) {
    if (testSelector(needle, needleSelector, parentCandidate)) {
      yield parentCandidate;
    }
  }
}

/**
 * Check whether needle selector within this parent will match only the needle.
 */
export function testParentCandidate(
  needle: Element,
  needleSelector: string,
  parent: ParentNode,
): boolean {
  const matchingElements = Array.from(parent.querySelectorAll(needleSelector));
  return (
    matchingElements.length > 0 &&
    matchingElements.every((element) => needle.contains(element))
  );
}

export function getSelectorDataPowerSet(selectorData: CssSelectorsByType) {
  return Object.fromEntries(
    Object.entries(selectorData).map(([key, val]) => [key, getPowerSet(val)]),
  );
}

export function* needleCandidateGenerator(
  needle: Element[],
  selectorTypes: CssSelectorType[],
  options: CssSelectorGeneratorOptions,
  memo = createMemo(),
) {
  for (const selectorTypesCombination of powerSetGenerator(selectorTypes)) {
    const needleSelectors = memo(needle, selectorTypesCombination);
    const needleSelectorsPowerSet = getSelectorDataPowerSet(needleSelectors);
    const needleSelectorsCombinations = getCartesianProduct(
      needleSelectorsPowerSet,
    );
    for (const needleSelectorData of needleSelectorsCombinations) {
      yield constructSelector(needleSelectorData);
    }
  }
}

export function* needleSelectorGenerator(
  needle: Element[],
  selectorTypes: CssSelectorType[],
  options: CssSelectorGeneratorOptions,
  memo = createMemo(),
) {
  // TODO
}

export function* viableSelectorGenerator() {
  // TODO
}

export function* cssSelectorGenerator(
  originalNeedle: unknown,
  originalOptions: CssSelectorGeneratorOptionsInput = {},
) {
  const needle = sanitizeSelectorNeedle(originalNeedle);
  const options = sanitizeOptions(needle[0], originalOptions);
  const memo = createMemo();
  const candidateSelectorTypes = [];

  for (const nextSelectorType of options.selectors) {
    candidateSelectorTypes.push(nextSelectorType);
    for (const selectorTypes of powerSetGenerator(candidateSelectorTypes)) {
      // TODO
      // console.log("candidate selector types", candidateSelectorTypes);
    }
  }

  yield getFallbackSelector(needle);
}
