/**
 * Generates cartesian product out of input object.
 */
export function* cartesianProductGenerator<T>(
  input: Record<string, T[]> = {},
): Generator<Record<string, T>> {
  const entries = Object.entries(input);
  if (entries.length === 0) return;

  function* helper(
    index: number,
    partial: Record<string, T>,
  ): Generator<Record<string, T>> {
    if (index < 0) {
      yield partial;
      return;
    }
    const [key, values] = entries[index];
    for (const value of values) {
      yield* helper(index - 1, { ...partial, [key]: value });
    }
  }

  // Start recursion from the last key, so leftmost key changes slowest
  yield* helper(entries.length - 1, {});
}
