import { CssSelectors, CssSelectorsByType, CssSelectorType, CssSelectorTypes } from './types';
export declare type MemoSelectorData = Map<CssSelectorType, CssSelectors>;
export declare type MemoElementData = Map<Element[], MemoSelectorData>;
export declare type MemoizedSelectorGetter = (elements: Element[], selectorTypes: CssSelectorTypes) => CssSelectorsByType;
/**
 * Creates interface for getting CSS selectors by type for an element. Results are remembered for use in later calls.
 */
export declare function createMemo(memo?: MemoElementData): MemoizedSelectorGetter;
