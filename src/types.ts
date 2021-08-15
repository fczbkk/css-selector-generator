import {VALID_SELECTOR_TYPES} from './constants'

export type CssSelector = string
export type CssSelectors = Array<CssSelector>

export type CssSelectorMatch = RegExp | string

export type CssSelectorType = typeof VALID_SELECTOR_TYPES[number]
export type CssSelectorTypes = Array<CssSelectorType>

export type CssSelectorsByType = Record<CssSelectorType, CssSelectors>

export type CssSelectorData = {
  [key in CssSelectorType]?: Array<string> | Array<Array<string>>
}

export type CssSelectorGeneratorOptions = {
  // List of selector types to use. They will be prioritised by their order.
  selectors: Array<CssSelectorType>,
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
  includeTag: boolean
}

export type IdentifiableParent =
  null
  | { foundElements: Element[], selector: CssSelector }

export type SelectorNeedle = Element | Element[]
