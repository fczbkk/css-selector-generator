import {CssSelectorMatch} from './types'

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
        ? '^' + wildcardToRegExp(item) + '$'
        : item.source
    })
    .join('|')
  return new RegExp(combined_re)
}
