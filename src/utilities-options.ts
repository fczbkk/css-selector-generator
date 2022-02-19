import {
  CssSelectorGeneratorOptions,
  CssSelectorMatch,
  CssSelectorType,
  CssSelectorTypes,
} from './types'
import {isEnumValue} from './utilities-typescript'
import {showWarning} from './utilities-messages'

export const DEFAULT_OPTIONS = {
  selectors: [
    CssSelectorType.id,
    CssSelectorType.class,
    CssSelectorType.tag,
    CssSelectorType.attribute,
  ] as CssSelectorTypes,
  // if set to true, always include tag name
  includeTag: false,
  whitelist: [] as Array<CssSelectorMatch>,
  blacklist: [] as Array<CssSelectorMatch>,
  combineWithinSelector: true,
  combineBetweenSelectors: true,
  root: null,
  maxCombinations: Number.POSITIVE_INFINITY,
  maxCandidates: Number.POSITIVE_INFINITY,
} as CssSelectorGeneratorOptions

/**
 * Makes sure returned value is a list containing only valid selector types.
 * @param input
 */
export function sanitizeSelectorTypes (input: unknown): CssSelectorTypes {
  if (!Array.isArray(input)) {
    return []
  }
  return input.filter((item) => isEnumValue(CssSelectorType, item))
}

/**
 * Checks whether provided value is of type RegExp.
 */
export function isRegExp (input: unknown): input is RegExp {
  return input instanceof RegExp
}

/**
 * Checks whether provided value is usable in whitelist or blacklist.
 * @param input
 */
export function isCssSelectorMatch (input: unknown): input is CssSelectorMatch {
  return (
    typeof input === 'string' || typeof input === 'function' || isRegExp(input)
  )
}

/**
 * Converts input to a list of valid values for whitelist or blacklist.
 */
export function sanitizeCssSelectorMatchList (
  input: unknown,
): Array<CssSelectorMatch> {
  if (!Array.isArray(input)) {
    return []
  }
  return input.filter(isCssSelectorMatch)
}

/**
 * Checks whether provided value is valid Node.
 */
export function isNode (input: unknown): input is Node {
  return input instanceof Node
}

/**
 * Checks whether provided value is valid ParentNode.
 */
export function isParentNode (input: unknown): input is ParentNode {
  const validNodeTypes = [
    Node.DOCUMENT_NODE,
    Node.DOCUMENT_FRAGMENT_NODE, // this includes Shadow DOM root
    Node.ELEMENT_NODE,
  ]
  return isNode(input) && validNodeTypes.includes(input.nodeType)
}

/**
 * Makes sure that the root node in options is valid.
 */
export function sanitizeRoot (
  input: unknown,
  element: Element,
): ParentNode {
  if (isParentNode(input)) {
    if (!input.contains(element)) {
      // eslint-disable-next-line max-len
      showWarning('element root mismatch', 'Provided root does not contain the element. This will most likely result in producing a fallback selector using element\'s real root node. If you plan to use the selector using provided root (e.g. `root.querySelector`), it will nto work as intended.')
    }
    return input
  }

  const rootNode = element.getRootNode({composed: false})
  if (isParentNode(rootNode)) {
    if (rootNode !== document) {
      // eslint-disable-next-line max-len
      showWarning('shadow root inferred', 'You did not provide a root and the element is a child of Shadow DOM. This will produce a selector using ShadowRoot as a root. If you plan to use the selector using document as a root (e.g. `document.querySelector`), it will not work as intended.')
    }
    return rootNode
  }

  return element.ownerDocument.querySelector(':root')
}

/**
 * Makes sure that the output is a number, usable as `maxResults` option in
 * powerset generator.
 */
export function sanitizeMaxNumber (input?: unknown): number {
  return typeof input === 'number' ? input : Number.POSITIVE_INFINITY
}

/**
 * Makes sure the options object contains all required keys.
 */
export function sanitizeOptions (
  element: Element,
  custom_options = {},
): CssSelectorGeneratorOptions {
  const options = {
    ...DEFAULT_OPTIONS,
    ...custom_options,
  }

  return {
    selectors: sanitizeSelectorTypes(options.selectors),
    whitelist: sanitizeCssSelectorMatchList(options.whitelist),
    blacklist: sanitizeCssSelectorMatchList(options.blacklist),
    root: sanitizeRoot(options.root, element),
    combineWithinSelector: !!options.combineWithinSelector,
    combineBetweenSelectors: !!options.combineBetweenSelectors,
    includeTag: !!options.includeTag,
    maxCombinations: sanitizeMaxNumber(options.maxCombinations),
    maxCandidates: sanitizeMaxNumber(options.maxCandidates),
  }
}
