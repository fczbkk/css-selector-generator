export const DESCENDANT_OPERATOR = ' > ';

/**
 * Constructs default options with proper root node for given element.
 * @see {@link getRootNode} for further info
 * @param {Element} element
 * @returns {Object}
 */
export function constructDefaultOptions (element) {
  return Object.assign(
    {},
    DEFAULT_OPTIONS,
    {
      root: element.ownerDocument.querySelector(':root'),
    }
  );
}

export const DEFAULT_OPTIONS = {
  selectors: ['id', 'class', 'tag', 'attribute'],
  // if set to true, always include tag name
  includeTag: false,
  whitelist: [],
  blacklist: [],
  combineWithinSelector: true,
  combineBetweenSelectors: true,
};

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp([
  '^$', // empty or not set
  '\\s', // contains whitespace
  '^\\d', // begins with a number
].join('|'));

// RegExp that will match invalid patterns that can be used in class attribute.
export const INVALID_CLASS_RE = new RegExp([
  '^$', // empty or not set
  '^\\d', // begins with a number
].join('|'));

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = [
  'nthoftype',
  'tag',
  'id',
  'class',
  'attribute',
  'nthchild',
];
