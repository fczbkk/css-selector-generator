import cartesian from 'cartesian'
import {
  CHILD_OPERATOR,
  DESCENDANT_OPERATOR,
  SELECTOR_PATTERN
} from './constants'
import {getAttributeSelectors} from './selector-attribute'
import {getClassSelectors} from './selector-class'
import {getIdSelector} from './selector-id'
import {getNthChildSelector} from './selector-nth-child'
import {getNthOfTypeSelector} from './selector-nth-of-type'
import {getTagSelector} from './selector-tag'
import {
  convertMatchListToRegExp,
  flattenArray,
  getCombinations, getIntersection
} from './utilities-data';
import {getParents, testSelector} from './utilities-dom'
import {
  CssSelector,
  CssSelectorData,
  CssSelectorGeneratorOptions,
  CssSelectorType,
  IdentifiableParent, SelectorNeedle
} from './types';
import isElement from 'iselement';

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
  nthoftype: getNthOfTypeSelector
}

/**
 * Returns list of selectors of given type for the element.
 */
export function getSelectorsByType (
  elements: Element[],
  selector_type: CssSelectorType
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
  blacklist_re: RegExp,
  whitelist_re: RegExp
): Array<CssSelector> {
  return list.filter((item) => (
    whitelist_re.test(item)
    || !blacklist_re.test(item)
  ))
}

/**
 * Prioritise whitelisted selectors in list.
 */
export function orderSelectors (
  list: Array<CssSelector> = [],
  whitelist_re: RegExp
): Array<CssSelector> {
  return list.sort((a, b) => {
    const a_is_whitelisted = whitelist_re.test(a)
    const b_is_whitelisted = whitelist_re.test(b)
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
  options: CssSelectorGeneratorOptions
): Array<CssSelector> {
  const selectors_list = getSelectorsList(elements, options)
  const type_combinations = getTypeCombinations(selectors_list, options)
  const all_selectors = flattenArray(type_combinations) as Array<CssSelector>
  return [...new Set(all_selectors)]
}

/**
 * Creates object containing all selector types and their potential values.
 */
export function getSelectorsList (
  elements: Element[],
  options: CssSelectorGeneratorOptions
): CssSelectorData {
  const {
    blacklist,
    whitelist,
    combineWithinSelector
  } = options

  const blacklist_re = convertMatchListToRegExp(blacklist)
  const whitelist_re = convertMatchListToRegExp(whitelist)

  const reducer = (data: CssSelectorData, selector_type: CssSelectorType) => {
    const selectors_by_type = getSelectorsByType(elements, selector_type)
    const filtered_selectors =
      filterSelectors(selectors_by_type, blacklist_re, whitelist_re)
    const found_selectors = orderSelectors(filtered_selectors, whitelist_re)

    data[selector_type] = combineWithinSelector
      ? getCombinations(found_selectors)
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
  options: CssSelectorGeneratorOptions
): Array<CssSelectorType> {
  const {
    selectors,
    includeTag
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
  list: Array<CssSelectorType>
): Array<CssSelectorType> {
  return (list.includes('tag') || list.includes('nthoftype'))
    ? [...list]
    : [...list, 'tag']
}

/**
 * Generates list of possible selector type combinations.
 */
export function combineSelectorTypes (
  options: CssSelectorGeneratorOptions
): Array<Array<CssSelectorType>> {
  const {
    selectors,
    combineBetweenSelectors,
    includeTag
  } = options

  const combinations = combineBetweenSelectors
    ? getCombinations(selectors)
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
  options: CssSelectorGeneratorOptions
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
  selector_types: Array<CssSelectorType>,
  selectors_by_type: CssSelectorData
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
  selectors_data: CssSelectorData
): CssSelector {
  return (selectors_data[selector_type])
    ? selectors_data[selector_type].join('')
    : ''
}

/**
 * Converts selector data object to a selector.
 */
export function constructSelector (
  selectorData: CssSelectorData = {}
): CssSelector {
  const pattern = [...SELECTOR_PATTERN]
  // selector "nthoftype" already contains "tag"
  if (selectorData['tag'] && selectorData['nthoftype']) {
    pattern.splice(pattern.indexOf('tag'), 1)
  }

  return pattern
    .map((type) => constructSelectorType(type as CssSelectorType, selectorData))
    .join('')
}

/**
 * Generator of CSS selector candidates for given element, from simplest child selectors to more complex descendant selectors.
 */
export function getElementSelectorCandidates (
  elements: Element[],
  root: ParentNode,
  options: CssSelectorGeneratorOptions
): Array<CssSelector> {
  const result = []
  const selectorCandidates = getAllSelectors(elements, root, options)
  for (const selectorCandidate of selectorCandidates) {
    result.push(CHILD_OPERATOR + selectorCandidate)
  }

  if (elements.every((element) => element.parentNode === root)) {
    for (const selectorCandidate of selectorCandidates) {
      result.push(DESCENDANT_OPERATOR + selectorCandidate)
    }
  }
  return result
}

/**
 * Tries to find an unique CSS selector for element within given parent.
 */
export function getSelectorWithinRoot (
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = '',
  options: CssSelectorGeneratorOptions
): (null | CssSelector) {
  const selectorCandidates =
    getElementSelectorCandidates(elements, options.root, options)
  for (const candidateSelector of selectorCandidates) {
    const attemptSelector = (rootSelector + candidateSelector).trim()
    if (testSelector(elements, attemptSelector, options.root)) {
      return attemptSelector
    }
  }
  return null
}

/**
 * Climbs through parents of the element and tries to find the one that is identifiable by unique CSS selector.
 */
export function getClosestIdentifiableParent (
  elements: Element[],
  root: ParentNode,
  rootSelector: CssSelector = '',
  options: CssSelectorGeneratorOptions
): IdentifiableParent {
  if (elements.length === 0) {
    return null
  }

  const candidatesList = [
    (elements.length > 1) ? elements : [],
    ...getParents(elements, root).map((element) => [element])
  ]

  for (const currentElements of candidatesList) {
    const result =
      getSelectorWithinRoot(currentElements, root, rootSelector, options)
    if (result) {
      return {
        foundElements: currentElements,
        selector: result
      }
    }
  }

  return null
}

export function sanitizeSelectorNeedle (needle: unknown): Element[] {
  return [...new Set((Array.isArray(needle) ? needle : [needle]).filter(isElement))]
}
