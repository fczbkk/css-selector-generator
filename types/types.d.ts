declare const tag: unique symbol;
declare type Tagged<Token> = {
    readonly [tag]: Token;
};
export declare type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
export declare type CssSelectorGenerated = Opaque<string, 'CssSelector'>;
export declare enum OPERATOR {
    NONE = "none",
    DESCENDANT = "descendant",
    CHILD = "child"
}
export declare type OperatorValue = '' | ' ' | ' > ';
export interface OperatorData {
    type: OPERATOR;
    value: OperatorValue;
}
export interface ElementSelectorData {
    value: CssSelectorGenerated;
    include: boolean;
}
export interface ElementData {
    element: Element;
    operator: OperatorData;
    selectors: Partial<Record<CssSelectorType, ElementSelectorData[]>>;
}
export interface SelectorData {
    isFallback: boolean;
    elements: ElementData[];
}
export interface ResultData {
    selectorData: SelectorData[];
    getByElement: (element: Element) => ElementData | null;
    getByCssSelector: (selector: string) => ElementData | null;
}
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
export declare type CssSelectorGeneratorOptionsInput = Partial<{
    selectors: (keyof typeof CssSelectorType)[];
    whitelist: Array<CssSelectorMatch>;
    blacklist: Array<CssSelectorMatch>;
    root: ParentNode | null;
    combineWithinSelector: boolean;
    combineBetweenSelectors: boolean;
    includeTag: boolean;
    maxCombinations: number;
    maxCandidates: number;
}>;
export declare type CssSelectorGeneratorOptions = Required<Omit<CssSelectorGeneratorOptionsInput, 'selectors'> & {
    selectors: CssSelectorTypes;
}>;
export declare type IdentifiableParent = null | {
    foundElements: Element[];
    selector: CssSelector;
};
export {};
