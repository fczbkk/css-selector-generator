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
    const siblings = parentElement.querySelectorAll(tag);
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) {
        return [`${tag}:nth-of-type(${i + 1})`];
      }
    }
  }

  return [];
}
