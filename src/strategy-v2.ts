import { CssSelectorGeneratorOptionsInput } from "./types.js";
import { sanitizeSelectorNeedle } from "./utilities-selectors.js";
import { sanitizeOptions } from "./utilities-options.js";

export function strategyV2(
  needle: unknown,
  options: CssSelectorGeneratorOptionsInput = {}
): string {
  const sanitizedNeedle = sanitizeSelectorNeedle(needle);
  const sanitizedOptions = sanitizeOptions(sanitizedNeedle[0], options);
  return "";
}
