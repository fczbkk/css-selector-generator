import isElement from 'iselement'
import {CssSelector} from './types'

/**
 * Get nth-child selector for an element.
 */
export function getNthChildSelector (element: Element): Array<CssSelector> {
  const parent = element.parentNode

  if (parent) {
    const siblings = [...parent.childNodes].filter(isElement)
    const elementIndex = siblings.indexOf(element)
    if (elementIndex > -1) {
      return [`:nth-child(${elementIndex + 1})`]
    }
  }

  return []
}
