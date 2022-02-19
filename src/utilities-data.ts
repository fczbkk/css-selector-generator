import {CssSelectorMatch, PatternMatcher} from './types'

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
 * Creates function that will test list of provided matchers against input.
 * Used for white/blacklist functionality.
 */
export function createPatternMatcher (
  list: CssSelectorMatch[]
): PatternMatcher {
  const patterns = list.map(
    (item) =>
      (typeof item === 'string'
        ? new RegExp('^' + wildcardToRegExp(item) + '$')
        : item)
  )
  return (input: string) =>
    patterns.some((pattern) =>
      (typeof pattern === 'function' ? pattern(input) : pattern.test(input)))
}
