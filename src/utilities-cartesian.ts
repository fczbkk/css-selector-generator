/**
 * Generates cartesian product out of input object.
 */
export function getCartesianProduct<T>(
  input: Record<string, T[]> = {},
): Record<string, T>[] {
  let result: Record<string, T>[] = [];
  Object.entries(input).forEach(([key, values]) => {
    result = values.flatMap((value) => {
      if (result.length === 0) {
        return [{ [key]: value }];
      } else {
        return result.map((memo) => ({
          ...memo,
          [key]: value,
        }));
      }
    });
  });
  return result;
}

export function* cartesianProductGenerator<T>(
  arrays: T[][],
): IterableIterator<T[]> {
  if (arrays.length === 0) {
    yield [];
    return;
  }

  const [first, ...rest] = arrays;
  for (const value of first) {
    for (const combination of cartesianProductGenerator(rest)) {
      yield [value, ...combination];
    }
  }
}
