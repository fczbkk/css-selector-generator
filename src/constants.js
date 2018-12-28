export const DESCENDANT_OPERATOR = ' > ';

export const DEFAULT_OPTIONS = {
  selectors: ['id', 'class', 'tag', 'attribute'],
  // if set to true, always include tag name
  includeTag: false,
  whitelist: [],
  blacklist: [],
  root: document.querySelector(':root'),
  combineWithinSelector: true,
  combineBetweenSelectors: true,
};

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
  '^\\d', // begins with a number
].join('|'));

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = [
  'nthoftype',
  'tag',
  'id',
  'class',
  'attribute',
  'nthchild'
];
