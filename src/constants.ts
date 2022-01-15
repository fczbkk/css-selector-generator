import {CssSelectorType} from './types'

export const NONE_OPERATOR = ''
export const DESCENDANT_OPERATOR = ' > '
export const CHILD_OPERATOR = ' '

export enum OPERATOR {
  NONE = 'none',
  DESCENDANT = 'descendant',
  CHILD = 'child'
}

export const SELECTOR_SEPARATOR = ', '

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
  '^\\d' // begins with a number
].join('|'))

// RegExp that will match invalid patterns that can be used in class attribute.
export const INVALID_CLASS_RE = new RegExp([
  '^$', // empty or not set
  '^\\d' // begins with a number
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
