import {getTagSelector} from './selector-tag'
import {CssSelector} from './types'

/**
 * Get nth-of-type selector for an element.
 */
export function getNthOfTypeSelector (element: Element): Array<CssSelector> {
  const tag = getTagSelector(element)[0]
  const parentElement = element.parentElement

  if (parentElement) {
    const siblings = [...parentElement.querySelectorAll(tag)]
    const elementIndex = siblings.indexOf(element)
    if (elementIndex > -1) {
      return [`${tag}:nth-of-type(${elementIndex + 1})`]
    }
  }

  return []
}
