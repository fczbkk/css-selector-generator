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
