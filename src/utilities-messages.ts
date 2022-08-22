const libraryName = "CssSelectorGenerator";

/**
 * Convenient wrapper for `console.warn` using consistent formatting.
 */
export function showWarning(id = "unknown problem", ...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.warn(`${libraryName}: ${id}`, ...args);
}
