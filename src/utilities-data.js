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
 * Converts array of arrays into a flat array.
 * @param {Array.<Array>} input
 * @return {Array}
 */
export function flattenArray (input) {
  return [].concat(...input);
}

/**
 * Convert string that can contain wildcards (asterisks) to RegExp source.
 * @param {string} input
 * @return {string}
 */
export function wildcardToRegExp (input) {
  return input
  // convert all special characters used by RegExp, except an asterisk
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    // convert asterisk to pattern that matches anything
    .replace(/\*/g, '.+');
}

/**
 * Converts list of white/blacklist items to a single RegExp.
 * @param {Array.<string|RegExp>} [list]
 * @return {RegExp}
 */
export function convertMatchListToRegExp (list = []) {
  if (list.length === 0) {
    return new RegExp('.^');
  }
  const combined_re = list
    .map((item) => {
      return (typeof item === 'string')
        ? wildcardToRegExp(item)
        : item.source;
    })
    .join('|');
  return new RegExp(combined_re);
}
