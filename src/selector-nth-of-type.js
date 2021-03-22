import {getTagSelector} from './selector-tag';

/**
 * Get nth-of-type selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getNthOfTypeSelector (element) {
  const tag = getTagSelector(element)[0];
  const parentElement = element.parentElement;
  if (parentElement) {
    const siblings = [...parentElement.children].filter(node => {
      return node.tagName.toLowerCase() === tag
    });
    const index = siblings.indexOf(element) + 1;
    return [`${tag}:nth-of-type(${index})`];
  }

  return [];
}
