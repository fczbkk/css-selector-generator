interface powerSetGeneratorOptions {
  maxResults?: number;
}

export function* powerSetGenerator<T>(
  input: T[] = [],
  { maxResults = Number.POSITIVE_INFINITY }: powerSetGeneratorOptions = {},
): IterableIterator<T[]> {
  let resultCounter = 0;
  let offsets = generateOffsets(1);

  while (offsets.length <= input.length && resultCounter < maxResults) {
    resultCounter += 1;
    const result = offsets.map((offset) => input[offset]);
    yield result;
    offsets = bumpOffsets(offsets, input.length - 1);
  }
}

/**
 * Generates power set of input items.
 */
export function getPowerSet<T>(
  input: T[] = [],
  { maxResults = Number.POSITIVE_INFINITY }: powerSetGeneratorOptions = {},
): T[][] {
  return Array.from(powerSetGenerator(input, { maxResults }));
}

/**
 * Helper function used by `getPowerSet`. Updates internal pointers.
 */
function bumpOffsets(offsets: number[] = [], maxValue = 0): number[] {
  const size = offsets.length;
  if (size === 0) {
    return [];
  }
  const result = [...offsets];
  result[size - 1] += 1;
  for (let index = size - 1; index >= 0; index--) {
    if (result[index] > maxValue) {
      if (index === 0) {
        return generateOffsets(size + 1);
      } else {
        result[index - 1]++;
        result[index] = result[index - 1] + 1;
      }
    }
  }

  if (result[size - 1] > maxValue) {
    return generateOffsets(size + 1);
  }

  return result;
}

/**
 * Generates array of size N, filled with numbers sequence starting from 0.
 */
function generateOffsets(size = 1): number[] {
  return Array.from(Array(size).keys());
}
