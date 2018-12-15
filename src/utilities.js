import isElement from 'iselement';
import {
  getAttributeSelectors,
  getClassSelectors,
  getIdSelector,
  getNthChildSelector,
  getTagSelector,
} from './selectors';
import {DEFAULT_OPTIONS} from './constants';
import cartesian from 'cartesian';

/**
 * Creates all possible combinations of items in the list.
 * @param {Array} items
 * @return {Array}
 */
export function getCombinations (items = []) {
  // see the empty first result, will be removed later
  const result = [[]];

  items.forEach((items_item) => {
    result.forEach((result_item) => {
      result.push(result_item.concat(items_item));
    });
  });

  // remove seed
  result.shift();

  return result
  // sort results by length, we want the shortest selectors to win
    .sort((a, b) => a.length - b.length);
}

/**
 * Check whether element is matched uniquely by selector.
 * @param element
 * @param selector
 * @param [root]
 * @return {boolean}
 */
export function testSelector (element, selector, root = document) {
  const result = root.querySelectorAll(selector);
  return (result.length === 1 && result[0] === element);
}

/**
 * Find all parent elements of the element.
 * @param {Element} element
 * @param {Element} root
 * @return {Array.<Element>}
 */
export function getParents (element, root = document.querySelector(':root')) {
  const result = [];
  let parent = element;
  while (isElement(parent) && parent !== root) {
    result.push(parent);
    parent = parent.parentElement;
  }
  return result;
}

const escaped_colon = ':'
  .charCodeAt(0)
  .toString(16)
  .toUpperCase();

// Square brackets need to be escaped, but eslint has a problem with that.
/* eslint-disable-next-line no-useless-escape */
const special_characters_re = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;

/**
 * Escapes special characters used by CSS selector items.
 * @param {string} input
 * @return {string}
 */
export function sanitizeSelectorItem (input = '') {
  return input.split('')
    .map((character) => {
      if (character === ':') {
        return `\\${escaped_colon} `;
      }
      if (special_characters_re.test(character)) {
        return `\\${character}`;
      }
      return escape(character)
        .replace(/%/g, '\\');
    })
    .join('');
}

export const selectorTypeGetters = {
  tag: getTagSelector,
  id: getIdSelector,
  class: getClassSelectors,
  attribute: getAttributeSelectors,
  nthchild: getNthChildSelector,
};

/**
 * Returns list of selectors of given type for the element.
 * @param {Element} element
 * @param {string} selector_type
 * @return {Array.<string>} - Always an array, even if the selector only allows single value (e.g. tag).
 */
export function getSelectorsByType (element, selector_type) {
  return (selectorTypeGetters[selector_type] || (() => []))(element);
  // TODO whitelist
  // TODO blacklist
  // TODO combinations within selector
}

/**
 * Remove blacklisted selectors from list.
 * @param {Array.<string>} list
 * @param {RegExp} blacklist_re
 * @return {Array.<string>}
 */
export function filterSelectors (list = [], blacklist_re) {
  return list.filter((item) => !blacklist_re.test(item.selector));
}

/**
 * Prioritise whitelisted selectors in list.
 * @param {Array.<string>} list
 * @param {RegExp} whitelist_re
 * @return {Array.<string>}
 */
export function orderSelectors (list = [], whitelist_re) {
  return list.sort((a, b) => {
    const a_is_whitelisted = whitelist_re.test(a.selector);
    const b_is_whitelisted = whitelist_re.test(b.selector);
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
  const {
    selectors,
    combineWithinSelector,
    combineBetweenSelectors,
    // include_tag,
    blacklist,
    whitelist,
  } = options;

  const blacklist_re = convertMatchListToRegExp(blacklist);
  const whitelist_re = convertMatchListToRegExp(whitelist);

  const selectors_by_type = {};

  for (let i = 0; i < selectors.length; i++) {
    const selector_type = selectors[i];
    const found_selectors = orderSelectors(filterSelectors(getSelectorsByType(element, selector_type), blacklist_re), whitelist_re);

    selectors_by_type[selector_type] = combineWithinSelector
      ? getCombinations(found_selectors)
      : found_selectors;
  }

  const selector_type_combinations = combineBetweenSelectors
    ? getCombinations(selectors)
    : selectors.map(item => [item]);

  // all_selectors = all_selectors.concat(type_selectors);
  const all_selectors = flattenArraay(
    selector_type_combinations
      .map((item) => constructSelectors(item, selectors_by_type))
      .filter((item) => item !== '')
  );

  for (let i = 0; i < all_selectors.length; i++) {
    const selector = all_selectors[i];
    if (testSelector(element, selector, element.parentNode)) {
      return selector;
    }
  }

  // TODO tag prefix should be ignored if tag selector is used

  return '*';
}

function flattenArraay (input) {
  return [].concat(...input);
}

const selector_pattern = ['tag', 'id', 'class', 'attribute', 'nthchild'];

function constructSelectors (selector_types, selectors_by_type) {
  const data = {};
  selector_types.forEach((selector_type) => {
    const available_selectors_for_type = selectors_by_type[selector_type];
    if (available_selectors_for_type.length > 0) {
      data[selector_type] = available_selectors_for_type;
    }
  });

  const combinations = cartesian(data);
  return combinations.map(constructSelector);
}

export function constructSelectorType (selector_type, selectors_data) {
  return (selectors_data[selector_type])
    ? selectors_data[selector_type].join('')
    : '';
}

export function constructSelector (selectors_data = {}) {
  return selector_pattern
    .map((type) => constructSelectorType(type, selectors_data))
    .join('');
}

export function convertMatchListToRegExp (list = []) {
  const combined_re = list
    .map((item) => {return typeof item === 'string' ? item : item.source;})
    .join('|');
  return new RegExp(combined_re);
}

/**
 * Makes sure the options object contains all required keys.
 * @param {Object} [custom_options]
 * @return {css_selector_generator_options}
 */
export function sanitizeOptions (custom_options = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, custom_options);

  // add never-matching item to blacklist so that it will always fail if empty
  if (options.blacklist.length === 0) {
    options.blacklist.push('.^');
  }

  return options;
}
