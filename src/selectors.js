import isElement from 'iselement';
import {
  convertMatchListToRegExp,
  getParents,
  sanitizeSelectorItem,
  testSelector,
} from './utilities';
import {DESCENDANT_OPERATOR, INVALID_ID_RE, ROOT_SELECTOR} from './constants';

/**
 * @typedef {Array<string>} selectors_list
 */

/**
 * @typedef {Object} attribute_node
 * @param {string} attribute_node.nodeName
 * @param {string} attribute_node.nodeValue
 */

/**
 * Get tag selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getTagSelector (element) {
  return [sanitizeSelectorItem(element.tagName.toLowerCase())];
}

/**
 * Get ID selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getIdSelector (element) {
  const id = element.getAttribute('id') || '';
  const selector = `#${sanitizeSelectorItem(id)}`;
  return (
    !INVALID_ID_RE.test(id)
    && testSelector(element, selector, element.ownerDocument)
  )
    ? [selector]
    : [];
}

/**
 * Get class selectors for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getClassSelectors (element) {
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => item !== '')
    .map((item) => `.${sanitizeSelectorItem(item)}`);
}

/**
 * Get attribute selectors for an element.
 * @param {attribute_node} attribute_node
 * @return {string}
 */
function attributeNodeToSelector ({nodeName, nodeValue}) {
  return `[${nodeName}='${sanitizeSelectorItem(nodeValue)}']`;
}

// List of attributes to be ignored. These are handled by different selector types.
export const ATTRIBUTE_BLACKLIST = convertMatchListToRegExp([
  'class',
  'id',
  // Angular attributes
  'ng-*'
]);


/**
 * Checks whether attribute should be used as a selector.
 * @param {attribute_node} attribute_node
 * @return {boolean}
 */
function isValidAttributeNode ({nodeName}) {
  // TODO add default attributes blacklist (e.g. "ng-*")
  return !ATTRIBUTE_BLACKLIST.test(nodeName);
}

/**
 * Get attribute selectors for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getAttributeSelectors (element) {
  return [...element.attributes]
    .filter(isValidAttributeNode)
    .map(attributeNodeToSelector);
}

/**
 * Get nth-child selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getNthChildSelector (element) {
  const parent = element.parentNode;

  if (parent) {
    let counter = 0;
    const siblings = parent.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      if (isElement(siblings[i])) {
        counter += 1;
        if (siblings[i] === element) {
          return [`:nth-child(${counter})`];
        }
      }
    }
  }

  return [];
}

export function getFallbackSelector (element, root) {
  return getParents(element, root)
    .map((element) => getNthChildSelector(element)[0])
    .reverse()
    .join(DESCENDANT_OPERATOR);
}
