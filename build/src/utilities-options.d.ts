import { CssSelectorGeneratorOptions, CssSelectorMatch, CssSelectorType } from './types';
export declare const DEFAULT_OPTIONS: {
    selectors: ("id" | "class" | "tag" | "attribute" | "nthchild" | "nthoftype")[];
    includeTag: boolean;
    whitelist: CssSelectorMatch[];
    blacklist: CssSelectorMatch[];
    combineWithinSelector: boolean;
    combineBetweenSelectors: boolean;
    root: Document;
    maxCombinations: number;
    maxCandidates: number;
};
/**
 * Makes sure returned value is a list containing only valid selector types.
 * @param input
 */
export declare function sanitizeSelectorTypes(input: unknown): Array<CssSelectorType>;
/**
 * Checks whether provided value is of type RegExp.
 */
export declare function isRegExp(input: unknown): input is RegExp;
/**
 * Checks whether provided value is usable in whitelist or blacklist.
 * @param input
 */
export declare function isCssSelectorMatch(input: unknown): input is CssSelectorMatch;
/**
 * Converts input to a list of valid values for whitelist or blacklist.
 */
export declare function sanitizeCssSelectorMatchList(input: unknown): Array<CssSelectorMatch>;
/**
 * Checks whether provided value is valid Node.
 */
export declare function isNode(input: unknown): input is Node;
/**
 * Checks whether provided value is valid ParentNode.
 */
export declare function isParentNode(input: unknown): input is ParentNode;
/**
 * Makes sure that the root node in options is valid.
 */
export declare function sanitizeRoot(input: unknown, element: Element): ParentNode;
/**
 * Makes sure that the output is a number, usable as `maxResults` option in powerset generator.
 */
export declare function sanitizeMaxNumber(input?: unknown): number;
/**
 * Makes sure the options object contains all required keys.
 */
export declare function sanitizeOptions(element: Element, custom_options?: {}): CssSelectorGeneratorOptions;
