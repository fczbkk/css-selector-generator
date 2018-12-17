import isElement from 'iselement';

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
