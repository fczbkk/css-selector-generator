import { CssSelectorMatch } from './types';
/**
 * Creates all possible combinations of items in the list.
 */
export declare function getCombinations<T>(items?: Array<T>): Array<Array<T>>;
/**
 * Creates array containing only items included in all input arrays.
 */
export declare function getIntersection<T>(items?: Array<Array<T>>): Array<T>;
/**
 * Converts array of arrays into a flat array.
 */
export declare function flattenArray<T>(input: Array<Array<T>>): Array<T>;
/**
 * Convert string that can contain wildcards (asterisks) to RegExp source.
 */
export declare function wildcardToRegExp(input: string): string;
/**
 * Converts list of white/blacklist items to a single RegExp.
 */
export declare function convertMatchListToRegExp(list?: Array<CssSelectorMatch>): RegExp;
