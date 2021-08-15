export const DESCENDANT_OPERATOR = ' > '
export const CHILD_OPERATOR = ' '

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

export const VALID_SELECTOR_TYPES = [
  'id',
  'class',
  'tag',
  'attribute',
  'nthchild',
  'nthoftype'
] as const

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = [
  'nthoftype',
  'tag',
  'id',
  'class',
  'attribute',
  'nthchild'
]
