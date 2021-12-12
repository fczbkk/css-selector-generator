/**
 * Checks whether value is one of the enum's values.
 */
export declare function isEnumValue<T>(haystack: T, needle: unknown): needle is T[keyof T];
