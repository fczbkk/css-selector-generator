import { testSelector } from "./utilities-dom";
import type {
  CssSelectorGeneratorOptions,
  CssSelectorsByType,
  CssSelectorTypes,
} from "./types.js";
import { constructSelector } from "./utilities-selectors.js";
import { getPowerSet, powerSetGenerator } from "./utilities-powerset.js";
import { createMemo } from "./memo.js";
import { getCartesianProduct } from "./utilities-cartesian.js";

/**
 * Returns closest parent element that is common for all needle elements. Returns `null` if no such element exists.
 */
export function getCommonParent(needle: Element[]): Element | null {
  // optimization for empty needle
  if (needle.length === 0) {
    return null;
  }

  // optimization for single element
  if (needle.length === 1) {
    return needle[0].parentElement;
  }

  // optimization for when any element has no parent, it means there is no common parent
  if (needle.some((element) => element.parentElement === null)) {
    return null;
  }

  let parent = needle[0].parentElement;
  while (parent) {
    // find common parent for multiple elements
    if (needle.every((element) => parent?.contains(element))) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

/**
 * Yields all common parents of the needle, starting with the one closest to the needle.
 */
export function* parentsGenerator(needle: Element[], root?: ParentNode) {
  let parent = getCommonParent(needle);
  while (parent && root?.contains(parent)) {
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
  selectorTypes: CssSelectorTypes,
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
