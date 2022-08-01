import { CssSelectorMatch, PatternMatcher } from './types.js';
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
 * Creates function that will test list of provided matchers against input.
 * Used for white/blacklist functionality.
 */
export declare function createPatternMatcher(list: CssSelectorMatch[]): PatternMatcher;
