import {getTagSelector} from './selector-tag'
import {CssSelector} from './types'

/**
 * Get nth-of-type selector for an element.
 */
export function getNthOfTypeSelector (element: Element): Array<CssSelector> {
  const tag = getTagSelector(element)[0]
  const parentElement = element.parentElement

  if (parentElement) {
    const siblings = parentElement.querySelectorAll(tag)
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) {
        return [`${tag}:nth-of-type(${i + 1})`]
      }
    }
  }

  return []
}
