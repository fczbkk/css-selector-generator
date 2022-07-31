import cartesian from 'cartesian'
import {
  CHILD_OPERATOR,
  DESCENDANT_OPERATOR,
  SELECTOR_PATTERN,
} from './constants.js'
import {
  getAttributeSelectors,
  getElementAttributeSelectors,
} from './selector-attribute.js'
import {getClassSelectors, getElementClassSelectors} from './selector-class.js'
import {getElementIdSelectors, getIdSelector} from './selector-id.js'
import {
  getElementNthChildSelector,
  getNthChildSelector,
} from './selector-nth-child.js'
import {
  getElementNthOfTypeSelector,
  getNthOfTypeSelector,
} from './selector-nth-of-type.js'
import {getElementTagSelectors, getTagSelector} from './selector-tag.js'
import {
  createPatternMatcher,
  flattenArray
} from './utilities-data.js'
import {getParents, testSelector} from './utilities-dom.js'
import {
  CssSelector,
  CssSelectorData,
  CssSelectorGenerated,
  CssSelectorGeneratorOptions,
  CssSelectorType,
  CssSelectorTypes,
  IdentifiableParent, PatternMatcher,
} from './types.js'
import isElement from 'iselement'
import {getPowerSet} from './utilities-powerset.js'

export const ESCAPED_COLON = ':'
  .charCodeAt(0)
  .toString(16)
  .toUpperCase()

// Square brackets need to be escaped, but eslint has a problem with that.
/* eslint-disable-next-line no-useless-escape */
export const SPECIAL_CHARACTERS_RE = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/

/**
 * Escapes special characters used by CSS selector items.
 */
export function sanitizeSelectorItem (input = ''): string {
  return CSS?.escape?.(input) ?? legacySanitizeSelectorItem(input)
}

/**
 * Legacy version of escaping utility, originally used for IE11-. Should
 * probably be replaced by a polyfill:
 * https://github.com/mathiasbynens/CSS.escape
 */
export function legacySanitizeSelectorItem (input = ''): string {
  return input.split('')
    .map((character) => {
      if (character === ':') {
        return `\\${ESCAPED_COLON} `
      }
      if (SPECIAL_CHARACTERS_RE.test(character)) {
        return `\\${character}`
      }
      return escape(character)
        .replace(/%/g, '\\')
    })
    .join('')
}

export const SELECTOR_TYPE_GETTERS = {
  tag: getTagSelector,
  id: getIdSelector,
  class: getClassSelectors,
  attribute: getAttributeSelectors,
  nthchild: getNthChildSelector,
  nthoftype: getNthOfTypeSelector,
}

export const ELEMENT_SELECTOR_TYPE_GETTERS = {
  tag: getElementTagSelectors,
  id: getElementIdSelectors,
  class: getElementClassSelectors,
  attribute: getElementAttributeSelectors,
  nthchild: getElementNthChildSelector,
  nthoftype: getElementNthOfTypeSelector,
}

/**
 * Creates selector of given type for single element.
 */
export function getElementSelectorsByType (
  element: Element,
  selectorType: CssSelectorType
): CssSelectorGenerated[] {
  return ELEMENT_SELECTOR_TYPE_GETTERS[selectorType](element)
}

/**
 * Returns list of selectors of given type for the element.
 */
export function getSelectorsByType (
  elements: Element[],
  selector_type: CssSelectorType,
): Array<CssSelector> {
  const getter = (
    SELECTOR_TYPE_GETTERS[selector_type]
    ?? ((): Array<CssSelector> => [])
  )
  return getter(elements)
}

/**
 * Remove blacklisted selectors from list.
 */
export function filterSelectors (
  list: Array<CssSelector> = [],
  matchBlacklist: PatternMatcher,
  matchWhitelist: PatternMatcher,
): Array<CssSelector> {
  return list.filter((item) => (
    matchWhitelist(item)
    || !matchBlacklist(item)
  ))
}

/**
 * Prioritise whitelisted selectors in list.
 */
export function orderSelectors (
  list: Array<CssSelector> = [],
  matchWhitelist: PatternMatcher,
): Array<CssSelector> {
  return list.sort((a, b) => {
    const a_is_whitelisted = matchWhitelist(a)
    const b_is_whitelisted = matchWhitelist(b)
    if (a_is_whitelisted && !b_is_whitelisted) {
      return -1
    }
    if (!a_is_whitelisted && b_is_whitelisted) {
      return 1
    }
    return 0
  })
}

/**
 * Returns list of unique selectors applicable to given element.
 */
export function getAllSelectors (
  elements: Element[],
  root: ParentNode,
  options: CssSelectorGeneratorOptions,
): Array<CssSelector> {
  const selectors_list = getSelectorsList(elements, options)
  const type_combinations = getTypeCombinations(selectors_list, options)
  const all_selectors = flattenArray(type_combinations)
  return [...new Set(all_selectors)]
}

/**
 * Creates object containing all selector types and their potential values.
 */
export function getSelectorsList (
  elements: Element[],
  options: CssSelectorGeneratorOptions,
): CssSelectorData {
  const {
    blacklist,
    whitelist,
    combineWithinSelector,
    maxCombinations,
  } = options

  const matchBlacklist = createPatternMatcher(blacklist)
  const matchWhitelist = createPatternMatcher(whitelist)

  const reducer = (data: CssSelectorData, selector_type: CssSelectorType) => {
    const selectors_by_type = getSelectorsByType(elements, selector_type)
    const filtered_selectors =
      filterSelectors(selectors_by_type, matchBlacklist, matchWhitelist)
    const found_selectors = orderSelectors(filtered_selectors, matchWhitelist)

    data[selector_type] = combineWithinSelector
      ? getPowerSet(found_selectors, {maxResults: maxCombinations})
      : found_selectors.map((item) => [item])

    return data
  }

  return getSelectorsToGet(options)
    .reduce(reducer, {})
}

/**
 * Creates list of selector types that we will need to generate the selector.
 */
export function getSelectorsToGet (
  options: CssSelectorGeneratorOptions,
): CssSelectorTypes {
  const {
    selectors,
    includeTag,
  } = options

  const selectors_to_get = [].concat(selectors)
  if (includeTag && !selectors_to_get.includes('tag')) {
    selectors_to_get.push('tag')
  }
  return selectors_to_get
}

/**
 * Adds "tag" to a list, if it does not contain it. Used to modify selectors
 * list when includeTag option is enabled to make sure all results contain the
 * TAG part.
 */
function addTagTypeIfNeeded (
  list: CssSelectorTypes,
): CssSelectorTypes {
  return (
    list.includes(CssSelectorType.tag)
    || list.includes(CssSelectorType.nthoftype)
  )
    ? [...list]
    : [...list, CssSelectorType.tag]
}

/**
 * Generates list of possible selector type combinations.
 */
export function combineSelectorTypes (
  options: CssSelectorGeneratorOptions,
): Array<CssSelectorTypes> {
  const {
    selectors,
    combineBetweenSelectors,
    includeTag,
    maxCandidates,
  } = options

  const combinations = combineBetweenSelectors
    ? getPowerSet(selectors, {maxResults: maxCandidates})
    : selectors.map(item => [item])

  return includeTag
    ? combinations.map(addTagTypeIfNeeded)
    : combinations
}

/**
 * Generates list of combined CSS selectors.
 */
export function getTypeCombinations (
  selectors_list: CssSelectorData,
  options: CssSelectorGeneratorOptions,
): Array<Array<CssSelector>> {
  return combineSelectorTypes(options)
    .map((item) => {
      return constructSelectors(item, selectors_list)
    })
    .filter((item) => item.length > 0)
}

/**
 * Generates all variations of possible selectors from provided data.
 */
export function constructSelectors (
  selector_types: CssSelectorTypes,
  selectors_by_type: CssSelectorData,
): Array<CssSelector> {
  const data: CssSelectorData = {}
  selector_types.forEach((selector_type) => {
    const selector_variants = selectors_by_type[selector_type]
    if (selector_variants.length > 0) {
      data[selector_type] = selector_variants
    }
  })

  const combinations = cartesian(data)
  return combinations.map(constructSelector)
}

/**
 * Creates selector for given selector type. Combines several parts if needed.
 */
export function constructSelectorType (
  selector_type: CssSelectorType,
  selectors_data: CssSelectorData,
): CssSelector {
  return (selectors_data[selector_type])
    ? selectors_data[selector_type].join('')
    : ''
}

/**
 * Converts selector data object to a selector.
 */
export function constructSelector (
  selectorData: CssSelectorData = {},
): CssSelector {
  const pattern = [...SELECTOR_PATTERN]
  // selector "nthoftype" already contains "tag"
  if (
    selectorData[CssSelectorType.tag]
    && selectorData[CssSelectorType.nthoftype]
  ) {
    pattern.splice(pattern.indexOf(CssSelectorType.tag), 1)
  }

  return pattern
    .map((type) => constructSelectorType(type, selectorData))
    .join('')
}

/**
 * Generates combinations of child and descendant selectors within root
 * selector.
 */
function generateCandidateCombinations (
  selectors: CssSelector[],
  rootSelector: CssSelector,
): CssSelector[] {
  return [
    ...selectors.map(
      (selector) => rootSelector + CHILD_OPERATOR + selector,
    ),
    ...selectors.map(
      (selector) => rootSelector + DESCENDANT_OPERATOR + selector,
    ),
  ]
}

/**
 * Generates a list of selector candidates that can potentially match target
 * element.
 */
function generateCandidates (
  selectors: CssSelector[],
  rootSelector: CssSelector,
): CssSelector[] {
  return rootSelector === ''
    ? selectors
    : generateCandidateCombinations(selectors, rootSelector)
}

/**
 * Tries to find an unique CSS selector for element within given parent.
 */
export function getSelectorWithinRoot (
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = '',
  options: CssSelectorGeneratorOptions,
): (null | CssSelector) {
  const elementSelectors = getAllSelectors(elements, options.root, options)
  const selectorCandidates = generateCandidates(elementSelectors, rootSelector)
  for (const candidateSelector of selectorCandidates) {
    if (testSelector(elements, candidateSelector, options.root)) {
      return candidateSelector
    }
  }
  return null
}

/**
 * Climbs through parents of the element and tries to find the one that is
 * identifiable by unique CSS selector.
 */
export function getClosestIdentifiableParent (
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = '',
  options: CssSelectorGeneratorOptions,
): IdentifiableParent {
  if (elements.length === 0) {
    return null
  }

  const candidatesList = [
    (elements.length > 1) ? elements : [],
    ...getParents(elements, root)
      .map((element) => [element]),
  ]

  for (const currentElements of candidatesList) {
    const result =
      getSelectorWithinRoot(currentElements, root, rootSelector, options)
    if (result) {
      return {
        foundElements: currentElements,
        selector: result,
      }
    }
  }

  return null
}

/**
 * Converts input into list of elements, removing duplicates and non-elements.
 */
export function sanitizeSelectorNeedle (needle: unknown): Element[] {
  const elements = (Array.isArray(needle) ? needle : [needle]).filter(isElement)
  return [...new Set(elements)]
}
