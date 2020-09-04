/**
 * Creates all possible combinations of items in the list.
 * @param {Array} items
 * @return {Array}
 */
export function getCombinations(items?: any[]): any[];
/**
 * Converts array of arrays into a flat array.
 * @param {Array.<Array>} input
 * @return {Array}
 */
export function flattenArray(input: Array<any[]>): any[];
/**
 * Convert string that can contain wildcards (asterisks) to RegExp source.
 * @param {string} input
 * @return {string}
 */
export function wildcardToRegExp(input: string): string;
/**
 * Converts list of white/blacklist items to a single RegExp.
 * @param {Array.<string|RegExp>} [list]
 * @return {RegExp}
 */
export function convertMatchListToRegExp(list?: Array<string | RegExp>): RegExp;
