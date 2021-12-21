export declare type CssSelector = string;
export declare type CssSelectors = Array<CssSelector>;
export declare type CssSelectorMatch = RegExp | string;
export declare enum CssSelectorType {
    id = "id",
    class = "class",
    tag = "tag",
    attribute = "attribute",
    nthchild = "nthchild",
    nthoftype = "nthoftype"
}
export declare type CssSelectorTypes = Array<CssSelectorType>;
export declare type CssSelectorsByType = Record<CssSelectorType, CssSelectors>;
export declare type CssSelectorData = {
    [key in CssSelectorType]?: Array<string> | Array<Array<string>>;
};
export declare type CssSelectorGeneratorOptions = {
    selectors: CssSelectorTypes;
    whitelist: Array<CssSelectorMatch>;
    blacklist: Array<CssSelectorMatch>;
    root: ParentNode | null;
    combineWithinSelector: boolean;
    combineBetweenSelectors: boolean;
    includeTag: boolean;
    maxCombinations: number;
    maxCandidates: number;
};
export declare type IdentifiableParent = null | {
    foundElements: Element[];
    selector: CssSelector;
};
