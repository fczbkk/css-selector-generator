import { SELECTOR_PATTERN } from "./constants.js";
import {
  getAttributeSelectors,
  getElementAttributeSelectors,
} from "./selector-attribute.js";
import {
  getClassSelectors,
  getElementClassSelectors,
} from "./selector-class.js";
import { getElementIdSelectors, getIdSelector } from "./selector-id.js";
import {
  getElementNthChildSelector,
  getNthChildSelector,
} from "./selector-nth-child.js";
import {
  getElementNthOfTypeSelector,
  getNthOfTypeSelector,
} from "./selector-nth-of-type.js";
import { getElementTagSelectors, getTagSelector } from "./selector-tag.js";
import { createPatternMatcher, flattenArray } from "./utilities-data.js";
import { getParents, testSelector } from "./utilities-dom.js";
import {
  CSS_SELECTOR_TYPE,
  CssSelector,
  CssSelectorData,
  CssSelectorGenerated,
  CssSelectorGeneratorOptions,
  CssSelectorType,
  CssSelectorTypes,
  IdentifiableParent,
  OPERATOR,
  PatternMatcher,
} from "./types.js";
import { isElement } from "./utilities-iselement.js";
import { getPowerSet } from "./utilities-powerset.js";
import { getCartesianProduct } from "./utilities-cartesian.js";

export const ESCAPED_COLON = ":".charCodeAt(0).toString(16).toUpperCase();

// Square brackets need to be escaped, but eslint has a problem with that.
/* eslint-disable-next-line no-useless-escape */
export const SPECIAL_CHARACTERS_RE = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;

/**
 * Escapes special characters used by CSS selector items.
 */
export function sanitizeSelectorItem(input = ""): string {
  // This should not be necessary, but just to be sure, let's keep the legacy sanitizer in place, for backwards compatibility.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return CSS ? CSS.escape(input) : legacySanitizeSelectorItem(input);
}

/**
 * Legacy version of escaping utility, originally used for IE11-. Should
 * probably be replaced by a polyfill:
 * https://github.com/mathiasbynens/CSS.escape
 */
export function legacySanitizeSelectorItem(input = ""): string {
  return input
    .split("")
    .map((character) => {
      if (character === ":") {
        return `\\${ESCAPED_COLON} `;
      }
      if (SPECIAL_CHARACTERS_RE.test(character)) {
        return `\\${character}`;
      }

      // needed for backwards compatibility
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      return escape(character).replace(/%/g, "\\");
    })
    .join("");
}

export const SELECTOR_TYPE_GETTERS: Record<
  CssSelectorType,
  (elements: Element[]) => CssSelector[]
> = {
  tag: getTagSelector,
  id: getIdSelector,
  class: getClassSelectors,
  attribute: getAttributeSelectors,
  nthchild: getNthChildSelector,
  nthoftype: getNthOfTypeSelector,
} as const;

export const ELEMENT_SELECTOR_TYPE_GETTERS: Record<
  CssSelectorType,
  (element: Element) => CssSelectorGenerated[]
> = {
  tag: getElementTagSelectors,
  id: getElementIdSelectors,
  class: getElementClassSelectors,
  attribute: getElementAttributeSelectors,
  nthchild: getElementNthChildSelector,
  nthoftype: getElementNthOfTypeSelector,
} as const;

/**
 * Creates selector of given type for single element.
 */
export function getElementSelectorsByType(
  element: Element,
  selectorType: CssSelectorType,
): CssSelectorGenerated[] {
  return ELEMENT_SELECTOR_TYPE_GETTERS[selectorType](element);
}

/**
 * Returns list of selectors of given type for the element.
 */
export function getSelectorsByType(
  elements: Element[],
  selector_type: CssSelectorType,
): CssSelector[] {
  const getter = SELECTOR_TYPE_GETTERS[selector_type];
  return getter(elements);
}

/**
 * Remove blacklisted selectors from list.
 */
export function filterSelectors(
  list: CssSelector[] = [],
  matchBlacklist: PatternMatcher,
  matchWhitelist: PatternMatcher,
): CssSelector[] {
  return list.filter((item) => matchWhitelist(item) || !matchBlacklist(item));
}

/**
 * Prioritise whitelisted selectors in list.
 */
export function orderSelectors(
  list: CssSelector[] = [],
  matchWhitelist: PatternMatcher,
): CssSelector[] {
  return list.sort((a, b) => {
    const a_is_whitelisted = matchWhitelist(a);
    const b_is_whitelisted = matchWhitelist(b);
    if (a_is_whitelisted && !b_is_whitelisted) {
      return -1;
    }
    if (!a_is_whitelisted && b_is_whitelisted) {
      return 1;
    }
    return 0;
  });
}

/**
 * Returns list of unique selectors applicable to given element.
 */
export function getAllSelectors(
  elements: Element[],
  root: ParentNode,
  options: CssSelectorGeneratorOptions,
): CssSelector[] {
  const selectors_list = getSelectorsList(elements, options);
  const type_combinations = getTypeCombinations(selectors_list, options);
  const all_selectors = flattenArray(type_combinations);
  return [...new Set(all_selectors)];
}

/**
 * Creates object containing all selector types and their potential values.
 */
export function getSelectorsList(
  elements: Element[],
  options: CssSelectorGeneratorOptions,
): CssSelectorData {
  const { blacklist, whitelist, combineWithinSelector, maxCombinations } =
    options;

  const matchBlacklist = createPatternMatcher(blacklist);
  const matchWhitelist = createPatternMatcher(whitelist);

  const reducer = (data: CssSelectorData, selector_type: CssSelectorType) => {
    const selectors_by_type = getSelectorsByType(elements, selector_type);
    const filtered_selectors = filterSelectors(
      selectors_by_type,
      matchBlacklist,
      matchWhitelist,
    );
    const found_selectors = orderSelectors(filtered_selectors, matchWhitelist);

    data[selector_type] = combineWithinSelector
      ? getPowerSet(found_selectors, { maxResults: maxCombinations })
      : found_selectors.map((item) => [item]);

    return data;
  };

  return getSelectorsToGet(options).reduce(reducer, {});
}

/**
 * Creates list of selector types that we will need to generate the selector.
 */
export function getSelectorsToGet(
  options: CssSelectorGeneratorOptions,
): CssSelectorTypes {
  const { selectors, includeTag } = options;

  const selectors_to_get = [...selectors];
  if (includeTag && !selectors_to_get.includes("tag")) {
    selectors_to_get.push("tag");
  }
  return selectors_to_get;
}

/**
 * Adds "tag" to a list, if it does not contain it. Used to modify selectors
 * list when includeTag option is enabled to make sure all results contain the
 * TAG part.
 */
function addTagTypeIfNeeded(list: CssSelectorTypes): CssSelectorTypes {
  return list.includes(CSS_SELECTOR_TYPE.tag) ||
    list.includes(CSS_SELECTOR_TYPE.nthoftype)
    ? [...list]
    : [...list, CSS_SELECTOR_TYPE.tag];
}

/**
 * Generates list of possible selector type combinations.
 */
export function combineSelectorTypes(
  options: CssSelectorGeneratorOptions,
): CssSelectorTypes[] {
  const { selectors, combineBetweenSelectors, includeTag, maxCandidates } =
    options;

  const combinations = combineBetweenSelectors
    ? getPowerSet(selectors, { maxResults: maxCandidates })
    : selectors.map((item) => [item]);

  return includeTag ? combinations.map(addTagTypeIfNeeded) : combinations;
}

/**
 * Generates list of combined CSS selectors.
 */
export function getTypeCombinations(
  selectors_list: CssSelectorData,
  options: CssSelectorGeneratorOptions,
): CssSelector[][] {
  return combineSelectorTypes(options)
    .map((item) => {
      return constructSelectors(item, selectors_list);
    })
    .filter((item) => item.length > 0);
}

/**
 * Generates all variations of possible selectors from provided data.
 */
export function constructSelectors(
  selector_types: CssSelectorTypes,
  selectors_by_type: CssSelectorData,
): CssSelector[] {
  const data: CssSelectorData = {};
  selector_types.forEach((selector_type) => {
    const selector_variants = selectors_by_type[selector_type];
    if (selector_variants && selector_variants.length > 0) {
      data[selector_type] = selector_variants;
    }
  });

  const combinations = getCartesianProduct<string | string[]>(data);
  return combinations.map(constructSelector);
}

/**
 * Creates selector for given selector type. Combines several parts if needed.
 */
export function constructSelectorType(
  selector_type: CssSelectorType,
  selectors_data: CssSelectorData,
): CssSelector {
  return selectors_data[selector_type]
    ? selectors_data[selector_type].join("")
    : "";
}

/**
 * Converts selector data object to a selector.
 */
export function constructSelector(
  selectorData: CssSelectorData = {},
): CssSelector {
  const pattern = [...SELECTOR_PATTERN];
  // selector "nthoftype" already contains "tag"
  if (
    selectorData[CSS_SELECTOR_TYPE.tag] &&
    selectorData[CSS_SELECTOR_TYPE.nthoftype]
  ) {
    pattern.splice(pattern.indexOf(CSS_SELECTOR_TYPE.tag), 1);
  }

  return pattern
    .map((type) => constructSelectorType(type, selectorData))
    .join("");
}

/**
 * Generates combinations of child and descendant selectors within root
 * selector.
 */
function generateCandidateCombinations(
  selectors: CssSelector[],
  rootSelector: CssSelector,
): CssSelector[] {
  return [
    ...selectors.map(
      (selector) => rootSelector + OPERATOR.DESCENDANT + selector,
    ),
    ...selectors.map((selector) => rootSelector + OPERATOR.CHILD + selector),
  ];
}

/**
 * Generates a list of selector candidates that can potentially match target
 * element.
 */
function generateCandidates(
  selectors: CssSelector[],
  rootSelector: CssSelector,
): CssSelector[] {
  return rootSelector === ""
    ? selectors
    : generateCandidateCombinations(selectors, rootSelector);
}

/**
 * Tries to find a unique CSS selector for element within given parent.
 */
export function getSelectorWithinRoot(
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = "",
  options: CssSelectorGeneratorOptions,
): null | CssSelector {
  const elementSelectors = getAllSelectors(elements, root, options);
  const selectorCandidates = generateCandidates(elementSelectors, rootSelector);
  for (const candidateSelector of selectorCandidates) {
    if (testSelector(elements, candidateSelector, root)) {
      return candidateSelector;
    }
  }
  return null;
}

/**
 * Climbs through parents of the element and tries to find the one that is
 * identifiable by unique CSS selector.
 */
export function getClosestIdentifiableParent(
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = "",
  options: CssSelectorGeneratorOptions,
): IdentifiableParent {
  if (elements.length === 0) {
    return null;
  }

  const candidatesList = [
    elements.length > 1 ? elements : [],
    ...getParents(elements, root).map((element) => [element]),
  ];

  for (const currentElements of candidatesList) {
    const result = getSelectorWithinRoot(
      currentElements,
      root,
      rootSelector,
      options,
    );
    if (result) {
      return {
        foundElements: currentElements,
        selector: result,
      };
    }
  }

  return null;
}

/**
 * Converts input into list of elements, removing duplicates and non-elements.
 */
export function sanitizeSelectorNeedle(needle: unknown): Element[] {
  if (needle instanceof NodeList || needle instanceof HTMLCollection) {
    needle = Array.from(needle);
  }
  const elements = (Array.isArray(needle) ? needle : [needle]).filter(
    isElement,
  );
  return [...new Set(elements)];
}
