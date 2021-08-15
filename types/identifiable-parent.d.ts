import { CssSelectorTypes, IdentifiableParent } from './types';
import { MemoizedSelectorGetter } from './memo';
/**
 * Tries to find identifiable parent using provided selector types. Prefers simpler selectors by order in which they are provided, instead of closeness to the element.
 */
export declare function getIdentifiableParent(element: Element, selectorTypes?: CssSelectorTypes, root?: ParentNode, getSelectorData?: MemoizedSelectorGetter): IdentifiableParent;
