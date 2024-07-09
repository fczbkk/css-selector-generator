/**
 * Checks whether value is one of the enum's values.
 */
export function isEnumValue<T extends Record<string, unknown>>(
  haystack: T,
  needle: unknown,
): needle is T[keyof T] {
  return Object.values(haystack).includes(needle);
}
