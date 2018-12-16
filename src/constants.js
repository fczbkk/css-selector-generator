export const DESCENDANT_OPERATOR = ' > ';

export const DEFAULT_OPTIONS = {
  selectors: ['id', 'class', 'tag', 'attribute', 'nthchild'],
  // if set to true, always include tag name
  include_tag: false,
  whitelist: [],
  blacklist: [],
  root: document.querySelector(':root'),
  combineWithinSelector: true,
  combineBetweenSelectors: false,
};

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
  '^\\d', // begins with a number
].join('|'));

// List of attributes to be ignored. These are handled by different selector types.
export const ATTRIBUTE_BLACKLIST = [
  'class',
  'id',
];

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = ['tag', 'id', 'class', 'attribute', 'nthchild'];
