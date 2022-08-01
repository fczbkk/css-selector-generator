import { CssSelectorType, OPERATOR, OperatorValue } from './types.js';
export declare const NONE_OPERATOR: OperatorValue;
export declare const DESCENDANT_OPERATOR: OperatorValue;
export declare const CHILD_OPERATOR: OperatorValue;
export declare const OPERATOR_DATA: {
    none: {
        type: OPERATOR;
        value: OperatorValue;
    };
    descendant: {
        type: OPERATOR;
        value: OperatorValue;
    };
    child: {
        type: OPERATOR;
        value: OperatorValue;
    };
};
export declare const SELECTOR_SEPARATOR = ", ";
export declare const INVALID_ID_RE: RegExp;
export declare const INVALID_CLASS_RE: RegExp;
export declare const SELECTOR_PATTERN: CssSelectorType[];
