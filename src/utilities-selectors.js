import {getNthChildSelector} from './selector-nth-child';
import {SELECTOR_PATTERN} from './constants';
import cartesian from 'cartesian';
import {
  convertMatchListToRegExp,
  flattenArray,
  getCombinations,
} from './utilities-data';
import {testSelector} from './utilities-dom';
import {getTagSelector} from './selector-tag';
import {getIdSelector} from './selector-id';
import {getClassSelectors} from './selector-class';
import {getAttributeSelectors} from './selector-attribute';
import {getNthOfTypeSelector} from './selector-nth-of-type';

export const ESCAPED_COLON = ':'
  .charCodeAt(0)
  .toString(16)
  .toUpperCase();

// Square brackets need to be escaped, but eslint has a problem with that.
/* eslint-disable-next-line no-useless-escape */
export const SPECIAL_CHARACTERS_RE = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;

/**
 * Escapes special characters used by CSS selector items.
 * @param {string} input
 * @return {string}
 */
export function sanitizeSelectorItem (input = '') {
  return input.split('')
    .map((character) => {
      if (character === ':') {
        return `\\${ESCAPED_COLON} `;
      }
      if (SPECIAL_CHARACTERS_RE.test(character)) {
        return `\\${character}`;
      }
      return escape(character)
        .replace(/%/g, '\\');
    })
    .join('');
}

export const SELECTOR_TYPE_GETTERS = {
  tag: getTagSelector,
  id: getIdSelector,
  class: getClassSelectors,
  attribute: getAttributeSelectors,
  nthchild: getNthChildSelector,
  nthoftype: getNthOfTypeSelector,
};

/**
 * Returns list of selectors of given type for the element.
 * @param {Element} element
 * @param {string} selector_type
 * @return {Array.<string>} - Always an array, even if the selector only allows single value (e.g. tag).
 */
export function getSelectorsByType (element, selector_type) {
  return (SELECTOR_TYPE_GETTERS[selector_type] || (() => []))(element);
}

/**
 * Remove blacklisted selectors from list.
 * @param {Array.<string>} list
 * @param {RegExp} blacklist_re
 * @param {RegExp} whitelist_re
 * @return {Array.<string>}
 */
export function filterSelectors (list = [], blacklist_re, whitelist_re) {
  return list.filter((item) => (
    whitelist_re.test(item)
    || !blacklist_re.test(item)
  ));
}

/**
 * Prioritise whitelisted selectors in list.
 * @param {Array.<string>} list
 * @param {RegExp} whitelist_re
 * @return {Array.<string>}
 */
export function orderSelectors (list = [], whitelist_re) {
  return list.sort((a, b) => {
    const a_is_whitelisted = whitelist_re.test(a);
    const b_is_whitelisted = whitelist_re.test(b);
    if (a_is_whitelisted && !b_is_whitelisted) {return -1;}
    if (!a_is_whitelisted && b_is_whitelisted) {return 1;}
    return 0;
  });
}

/**
 * Tries to generate unique selector for the element within it's parent.
 * @param {Element} element
 * @param {css_selector_generator_options} options
 * @return {string} Either unique selector or "*" if not possible.
 */
export function getUniqueSelectorWithinParent (element, options) {
  if (element.parentNode) {
    const selectors_list = getSelectorsList(element, options);
    const type_combinations = getTypeCombinations(selectors_list, options);
    const all_selectors = flattenArray(type_combinations);

    for (let i = 0; i < all_selectors.length; i++) {
      const selector = all_selectors[i];
      if (testSelector(element, selector, element.parentNode)) {
        return selector;
      }
    }
  }
  return '*';
}

/**
 * Creates object containing all selector types and their potential values.
 * @param {Element} element
 * @param {css_selector_generator_options} options
 * @return {Object}
 */
export function getSelectorsList (element, options) {
  const {
    blacklist,
    whitelist,
    combineWithinSelector,
  } = options;

  const blacklist_re = convertMatchListToRegExp(blacklist);
  const whitelist_re = convertMatchListToRegExp(whitelist);

  const reducer = (data, selector_type) => {
    const selectors_by_type = getSelectorsByType(element, selector_type);
    const filtered_selectors =
      filterSelectors(selectors_by_type, blacklist_re, whitelist_re);
    const found_selectors = orderSelectors(filtered_selectors, whitelist_re);

    data[selector_type] = combineWithinSelector
      ? getCombinations(found_selectors)
      : found_selectors.map((item) => [item]);

    return data;
  };

  return getSelectorsToGet(options)
    .reduce(reducer, {});
}

/**
 * Creates list of selector types that we will need to generate the selector.
 * @param {css_selector_generator_options} options
 * @return {Array.<string>}
 */
export function getSelectorsToGet (options) {
  const {
    selectors,
    includeTag,
  } = options;

  const selectors_to_get = [].concat(selectors);
  if (includeTag && !selectors_to_get.includes('tag')) {
    selectors_to_get.push('tag');
  }
  return selectors_to_get;
}

/**
 * Adds "tag" to a list, if it does not contain it. Used to modify selectors list when includeTag option is enabled to make sure all results contain the TAG part.
 * @param {Array.<string>} list
 * @return {Array.<string>}
 */
function addTagTypeIfNeeded (list) {
  return (list.includes('tag') || list.includes('nthoftype'))
    ? [...list]
    : [...list, 'tag'];
}

/**
 *
 * @param {Object} selectors_list
 * @param {css_selector_generator_options} options
 * @return {Array.<Array.<string>>}
 */
export function combineSelectorTypes (selectors_list, options = {}) {
  const {
    selectors,
    combineBetweenSelectors,
    includeTag,
  } = options;

  const combinations = combineBetweenSelectors
    ? getCombinations(selectors)
    : selectors.map(item => [item]);

  return includeTag
    ? combinations.map(addTagTypeIfNeeded)
    : combinations;
}

/**
 *
 * @param {Object} selectors_list
 * @param {css_selector_generator_options} options
 * @return {Array.<Array.<string>>}
 */
export function getTypeCombinations (selectors_list, options) {
  return combineSelectorTypes(selectors_list, options)
    .map((item) => constructSelectors(item, selectors_list))
    .filter((item) => item !== '');
}

/**
 * Generates all variations of possible selectors from provided data.
 * @param {Array.<string>} selector_types
 * @param {Object} selectors_by_type
 * @return {Array.<string>}
 */
export function constructSelectors (selector_types, selectors_by_type) {
  const data = {};
  selector_types.forEach((selector_type) => {
    const selector_variants = selectors_by_type[selector_type];
    if (selector_variants.length > 0) {
      data[selector_type] = selector_variants;
    }
  });

  const combinations = cartesian(data);
  return combinations.map(constructSelector);
}

/**
 * Creates selector for given selector type. Combines several parts if needed.
 * @param {string} selector_type
 * @param {Object} selectors_data
 * @return {string}
 */
export function constructSelectorType (selector_type, selectors_data) {
  return (selectors_data[selector_type])
    ? selectors_data[selector_type].join('')
    : '';
}

/**
 * Converts selector data object to a selector.
 * @param {Object} selector_data
 * @return {string}
 */
export function constructSelector (selector_data = {}) {
  return SELECTOR_PATTERN
    .map((type) => constructSelectorType(type, selector_data))
    .join('');
}

