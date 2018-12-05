export const DESCENDANT_OPERATOR = ' > ';

export const DEFAULT_OPTIONS = {
  selectors: ['id', 'class', 'tag', 'attribute', 'nthchild'],
  // if set to true, always include tag name
  include_tag: false,
  // TODO whitelist
  whitelist: [],
  // TODO blacklist
  blacklist: [],
  root: document.querySelector(':root'),
  combineWithinSelector: true,
  // TODO optimization - enable/disable combinations between types
  combineBetweenSelectors: false,
};

export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
  '^\\d', // begins with a number
].join('|'));

export const ATTRIBUTE_BLACKLIST = [
  'class',
  'id',
];
