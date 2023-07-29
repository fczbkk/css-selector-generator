import { CssSelectors, CssSelectorsByType, CssSelectorType, CssSelectorTypes } from "./types";
export type MemoSelectorData = Map<CssSelectorType, CssSelectors>;
export type MemoElementData = Map<Element, MemoSelectorData>;
export type MemoizedSelectorGetter = (needle: Element | Element[], selectorTypes: CssSelectorTypes) => CssSelectorsByType;
/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export declare function createMemo(memo?: MemoElementData): MemoizedSelectorGetter;
