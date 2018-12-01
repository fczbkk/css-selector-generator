import isElement from 'iselement';
import {isBlacklisted, sanitizeSelectorItem, testSelector} from './utilities';

/**
 * Get tag selector for an element.
 * @param {Element} element
 * @return {string}
 */
export function getTagSelector (element) {
  return sanitizeSelectorItem(element.tagName.toLowerCase());
}

const default_id_blacklist = [
  // empty or not set
  /^$/,
  // containing whitespace
  /\s/,
  // beginning with a number
  /^\d/,
];

export function getIdSelector (element, {
  prefix_tag = false,
  id_blacklist = [],
} = {}) {
  const blacklist = [].concat(default_id_blacklist, id_blacklist);
  const id = element.getAttribute('id') || '';

  if (!isBlacklisted(id, blacklist)) {
    const result_prefix = prefix_tag ? getTagSelector(element) : '';
    const selector = `${result_prefix}#${sanitizeSelectorItem(id)}`;
    if (testSelector(element, selector, element.ownerDocument)) {
      return selector;
    }
  }

  return null;
}

const default_class_blacklist = [
  // empty or not set
  /^$/,
];

export function getClassSelectors (element, {
  class_blacklist = [],
} = {}) {
  const blacklist = [].concat(default_class_blacklist, class_blacklist);
  return (element.getAttribute('class') || '')
    .trim()
    .split(/\s+/)
    .filter((item) => !isBlacklisted(item, blacklist))
    .map((item) => `.${sanitizeSelectorItem(item)}`);
}

const default_attribute_blacklist = [
  'class',
  'id',
];

export function getAttributeSelectors (element, {
  attribute_blacklist = [],
  attribute_whitelist = [],
} = {}) {
  const blacklist = [].concat(default_attribute_blacklist, attribute_blacklist);

  const attributes_list = new Map();

  [...element.attributes].forEach(({nodeName, nodeValue}) => {
    if (!blacklist.includes(nodeName)) {
      attributes_list.set(nodeName, nodeValue);
    }
  });

  attribute_whitelist.forEach((key) => {
    if (element.hasAttribute(key)) {
      attributes_list.set(key, element.getAttribute(key));
    }
  });

  return [...attributes_list].map(([key, value]) => `[${key}='${sanitizeSelectorItem(value)}']`);
}

export function getNthChildSelector (element) {
  const parent = element.parentNode;

  if (parent) {
    let counter = 0;
    const siblings = parent.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      if (isElement(siblings[i])) {
        counter += 1;
        if (siblings[i] === element) {
          return `:nth-child(${counter})`;
        }
      }
    }
  }

  return null;
}
