import {CssSelectorMatch} from './types'

/**
 * Creates all possible combinations of items in the list.
 */
export function getCombinations<T> (
  items: Array<T> = []
): Array<Array<T>> {
  // see the empty first result, will be removed later
  const result: Array<Array<T>> = [[]]

  items.forEach((items_item) => {
    result.forEach((result_item) => {
      result.push(result_item.concat(items_item))
    })
  })

  // remove seed
  result.shift()

  return result
    // sort results by length, we want the shortest selectors to win
    .sort((a, b) => a.length - b.length)
}

/**
 * Creates array containing only items included in all input arrays.
 */
export function getIntersection<T> (items: Array<Array<T>> = []): Array<T> {
  const [firstItem = [], ...otherItems] = items
  if (otherItems.length === 0) {
    return firstItem
  }
  return (otherItems).reduce((accumulator, currentValue) => {
    return accumulator.filter((item) => currentValue.includes(item))
  }, firstItem)
}

/**
 * Converts array of arrays into a flat array.
 */
export function flattenArray<T> (input: Array<Array<T>>): Array<T> {
  return ([] as Array<T>).concat(...input)
}

/**
 * Convert string that can contain wildcards (asterisks) to RegExp source.
 */
export function wildcardToRegExp (input: string): string {
  return input
    // convert all special characters used by RegExp, except an asterisk
    .replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    // convert asterisk to pattern that matches anything
    .replace(/\*/g, '.+')
}

/**
 * Converts list of white/blacklist items to a single RegExp.
 */
export function convertMatchListToRegExp (
  list: Array<CssSelectorMatch> = []
): RegExp {
  if (list.length === 0) {
    return new RegExp('.^')
  }
  const combined_re = list
    .map((item) => {
      return (typeof item === 'string')
        ? wildcardToRegExp(item)
        : item.source
    })
    .join('|')
  return new RegExp(combined_re)
}
