export function isEnumValue <T> (haystack: T, needle: unknown): needle is T[keyof T] {
  return Object.values(haystack).includes(needle)
}
