import isElement from 'iselement';
import {sanitizeSelectorItem, testSelector} from './utilities';
import {ATTRIBUTE_BLACKLIST, INVALID_ID_RE} from './constants';

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

/**
 * Checks whether attribute should be used as a selector.
 * @param {attribute_node} attribute_node
 * @return {boolean}
 */
function isValidAttributeNode ({nodeName}) {
  return !ATTRIBUTE_BLACKLIST.includes(nodeName);
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
