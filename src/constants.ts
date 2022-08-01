import {CssSelectorType, OPERATOR, OperatorValue} from './types.js'

export const NONE_OPERATOR = '' as OperatorValue
export const DESCENDANT_OPERATOR = ' > ' as OperatorValue
export const CHILD_OPERATOR = ' ' as OperatorValue

export const OPERATOR_DATA = {
  [OPERATOR.NONE]: {
    type: OPERATOR.NONE,
    value: NONE_OPERATOR
  },
  [OPERATOR.DESCENDANT]: {
    type: OPERATOR.DESCENDANT,
    value: DESCENDANT_OPERATOR
  },
  [OPERATOR.CHILD]: {
    type: OPERATOR.CHILD,
    value: CHILD_OPERATOR
  }
}

export const SELECTOR_SEPARATOR = ', '

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
].join('|'))

// RegExp that will match invalid patterns that can be used in class attribute.
export const INVALID_CLASS_RE = new RegExp([
  '^$', // empty or not set
].join('|'))

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = [
  CssSelectorType.nthoftype,
  CssSelectorType.tag,
  CssSelectorType.id,
  CssSelectorType.class,
  CssSelectorType.attribute,
  CssSelectorType.nthchild
]
