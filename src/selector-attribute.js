import {sanitizeSelectorItem} from './utilities-selectors';
import {convertMatchListToRegExp} from './utilities-data';

/**
 * @typedef {Object} attribute_node
 * @param {string} attribute_node.nodeName
 * @param {string} attribute_node.nodeValue
 */

// List of attributes to be ignored. These are handled by different selector types.
export const ATTRIBUTE_BLACKLIST = convertMatchListToRegExp([
  'class',
  'id',
  // Angular attributes
  'ng-*',
]);

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
