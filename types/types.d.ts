declare const opaqueId: unique symbol;
declare type Tagged<Token> = {
    readonly [opaqueId]: Token;
};
export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;
export type ObjectValues<T> = T[keyof T];
export type CssSelectorGenerated = Opaque<string, "CssSelector">;
export declare const OPERATOR: {
    readonly NONE: "";
    readonly DESCENDANT: " ";
    readonly CHILD: " > ";
};
export type OperatorValue = ObjectValues<typeof OPERATOR>;
export interface ElementSelectorData {
    value: CssSelectorGenerated;
    include: boolean;
}
export interface ElementData {
    element: Element;
    operator: OperatorValue;
    selectors: Partial<Record<CssSelectorType, ElementSelectorData[]>>;
}
export type CssSelector = string;
export type CssSelectors = Array<CssSelector>;
type CssSelectorMatchFn = (input: string) => boolean;
export type CssSelectorMatch = RegExp | string | CssSelectorMatchFn;
export declare const CSS_SELECTOR_TYPE: {
    readonly id: "id";
    readonly class: "class";
    readonly tag: "tag";
    readonly attribute: "attribute";
    readonly nthchild: "nthchild";
    readonly nthoftype: "nthoftype";
};
export type CssSelectorType = ObjectValues<typeof CSS_SELECTOR_TYPE>;
export type CssSelectorTypes = Array<CssSelectorType>;
export type CssSelectorsByType = Partial<Record<CssSelectorType, CssSelectors>>;
export type CssSelectorData = {
    [key in CssSelectorType]?: Array<string> | Array<Array<string>>;
};
export type CssSelectorGeneratorOptionsInput = Partial<{
    selectors: CssSelectorType[];
    whitelist: Array<CssSelectorMatch>;
    blacklist: Array<CssSelectorMatch>;
    root: ParentNode | null;
    combineWithinSelector: boolean;
    combineBetweenSelectors: boolean;
    includeTag: boolean;
    maxCombinations: number;
    maxCandidates: number;
}>;
export type CssSelectorGeneratorOptions = Required<Omit<CssSelectorGeneratorOptionsInput, "selectors"> & {
    selectors: CssSelectorTypes;
}>;
export type IdentifiableParent = null | {
    foundElements: Element[];
    selector: CssSelector;
};
export type PatternMatcher = (input: string) => boolean;
export {};
