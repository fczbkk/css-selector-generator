import { VALID_SELECTOR_TYPES } from './constants';
export declare type CssSelector = string;
export declare type CssSelectors = Array<CssSelector>;
export declare type CssSelectorMatch = RegExp | string;
export declare type CssSelectorType = typeof VALID_SELECTOR_TYPES[number];
export declare type CssSelectorTypes = Array<CssSelectorType>;
export declare type CssSelectorsByType = Record<CssSelectorType, CssSelectors>;
export declare type CssSelectorData = {
    [key in CssSelectorType]?: Array<string> | Array<Array<string>>;
};
export declare type CssSelectorGeneratorOptions = {
    selectors: Array<CssSelectorType>;
    whitelist: Array<CssSelectorMatch>;
    blacklist: Array<CssSelectorMatch>;
    root: ParentNode;
    combineWithinSelector: boolean;
    combineBetweenSelectors: boolean;
    includeTag: boolean;
};
export declare type IdentifiableParent = null | {
    foundElement: Element;
    selector: CssSelector;
};
