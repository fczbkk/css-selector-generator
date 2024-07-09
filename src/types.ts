declare const opaqueId: unique symbol;

declare interface Tagged<Token> {
  readonly [opaqueId]: Token;
}

export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

export type ObjectValues<T> = T[keyof T];

// TODO rename to "CssSelector"
export type CssSelectorGenerated = Opaque<string, "CssSelector">;

export const OPERATOR = {
  NONE: "",
  DESCENDANT: " ",
  CHILD: " > ",
} as const;

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
export type CssSelectors = CssSelector[];

type CssSelectorMatchFn = (input: string) => boolean;
export type CssSelectorMatch = RegExp | string | CssSelectorMatchFn;

export const CSS_SELECTOR_TYPE = {
  id: "id",
  class: "class",
  tag: "tag",
  attribute: "attribute",
  nthchild: "nthchild",
  nthoftype: "nthoftype",
} as const;

export type CssSelectorType = ObjectValues<typeof CSS_SELECTOR_TYPE>;
export type CssSelectorTypes = CssSelectorType[];

export type CssSelectorsByType = Partial<Record<CssSelectorType, CssSelectors>>;

export type CssSelectorData = {
  [key in CssSelectorType]?: string[] | string[][];
};

export type CssSelectorGeneratorOptionsInput = Partial<{
  // List of selector types to use. They will be prioritised by their order.
  selectors: CssSelectorTypes;
  // List of selectors that should be prioritised.
  whitelist: CssSelectorMatch[];
  // List of selectors that should be ignored.
  blacklist: CssSelectorMatch[];
  // Root element inside which the selector will be generated. If not set, the document root will be used.
  root: ParentNode | null;
  // If set to `true`, the generator will test combinations of selectors of single type (e.g. multiple class selectors).
  combineWithinSelector: boolean;
  // If set to `true`, the generator will try to test combinations of selectors of different types (e.g. tag + class name).
  combineBetweenSelectors: boolean;
  // If set to `true`, all generated selectors will include the TAG part. Even if tag selector type is not included in `selectors` option.
  includeTag: boolean;
  // Maximum number of combinations of a selector type. This is handy for performance reasons, e.g. when elements have too many classnames.
  maxCombinations: number;
  // Maximum number of selector candidates to be tested for each element. This is handy for performance reasons, e.g. when elements can produce large number of combinations of various types of selectors.
  maxCandidates: number;
}>;

export type CssSelectorGeneratorOptions = Required<
  Omit<CssSelectorGeneratorOptionsInput, "selectors"> & {
    selectors: CssSelectorTypes;
  }
>;

export type IdentifiableParent = null | {
  foundElements: Element[];
  selector: CssSelector;
};

export type PatternMatcher = (input: string) => boolean;
