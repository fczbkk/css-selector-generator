export type CssSelector = string
export type CssSelectors = Array<CssSelector>

export type CssSelectorMatch = RegExp | string

export enum CssSelectorType {
  id = 'id',
  class = 'class',
  tag = 'tag',
  attribute = 'attribute',
  nthchild = 'nthchild',
  nthoftype = 'nthoftype'
}
export type CssSelectorTypes = Array<CssSelectorType>

export type CssSelectorsByType = Record<CssSelectorType, CssSelectors>

export type CssSelectorData = {
  [key in CssSelectorType]?: Array<string> | Array<Array<string>>
}

export type CssSelectorGeneratorOptions = {
  // List of selector types to use. They will be prioritised by their order.
  selectors: CssSelectorTypes,
  // List of selectors that should be prioritised.
  whitelist: Array<CssSelectorMatch>,
  // List of selectors that should be ignored.
  blacklist: Array<CssSelectorMatch>,
  // Root element inside which the selector will be generated. If not set, the document root will be used.
  root: ParentNode,
  // If set to `true`, the generator will test combinations of selectors of single type (e.g. multiple class selectors).
  combineWithinSelector: boolean,
  // If set to `true`, the generator will try to test combinations of selectors of different types (e.g. tag + class name).
  combineBetweenSelectors: boolean,
  // If set to `true`, all generated selectors will include the TAG part. Even if tag selector type is not included in `selectors` option.
  includeTag: boolean,
  // Maximum number of combinations of a selector type. This is handy for performance reasons, e.g. when elements have too many classnames.
  maxCombinations: number,
  // Maximum number of selector candidates to be tested for each element. This is handy for performance reasons, e.g. when elements can produce large number of combinations of various types of selectors.
  maxCandidates: number
}

export type IdentifiableParent =
  null
  | { foundElements: Element[], selector: CssSelector }

export type SelectorNeedle = Element | Element[]
