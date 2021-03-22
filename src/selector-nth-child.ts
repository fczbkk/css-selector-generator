import isElement from 'iselement'
import {CssSelector} from './types'

/**
 * Get nth-child selector for an element.
 */
export function getNthChildSelector (element: Element): Array<CssSelector> {
  const parent = element.parentNode

  if (parent) {
    let counter = 0
    const siblings = parent.childNodes
    for (let i = 0; i < siblings.length; i++) {
      if (isElement(siblings[i])) {
        counter += 1
        if (siblings[i] === element) {
          return [`:nth-child(${counter})`]
        }
      }
    }
  }

  return []
}
