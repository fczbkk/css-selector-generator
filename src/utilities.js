import isElement from 'iselement';

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
    .sort((a, b) => a.length - b.length)
    // collapse combinations
    .map((item) => item.join(''));
}

/**
 * Check whether element is matched uniquely by selector.
 * @param element
 * @param selector
 * @param root
 * @return {boolean}
 */
export function testSelector (element, selector, root = document.body) {
  const result = root.querySelectorAll(selector);
  return (result.length === 1 && result[0] === element);
}

/**
 * Find all parent elements of the element.
 * @param {Element} element
 * @param {Element} root
 * @return {Array.<Element>}
 */
export function getParents (element, root = document.body) {
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

/**
 * Checks whether item is blacklisted.
 * @param {string} item
 * @param {Array.<string|RegExp>} blacklist
 * @return {boolean}
 */
export function isBlacklisted (item, blacklist = []) {
  for (let i = 0; i < blacklist.length; i++) {
    const blacklist_re = sanitizeBlacklistItem(blacklist[i]);
    if (blacklist_re.test(item)) {
      return true;
    }
  }
  return false;
}

/**
 * Makes sure blacklist item is RegExp.
 * @param {string|RegExp} item
 * @return {RegExp}
 */
function sanitizeBlacklistItem (item) {
  return (typeof item === 'string') ? new RegExp(item) : item;
}
