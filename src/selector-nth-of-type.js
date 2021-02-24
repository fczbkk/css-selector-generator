import {getTagSelector} from './selector-tag';

/**
 * Get nth-of-type selector for an element.
 * @param {Element} element
 * @return {selectors_list}
 */
export function getNthOfTypeSelector (element) {
  const tag = getTagSelector(element)[0];
  const index = [...element.parentElement.children].filter(node => node.tagName.toLowerCase() === tag).indexOf(element) + 1;
  return [`${tag}:nth-of-type(${index})`];
}
