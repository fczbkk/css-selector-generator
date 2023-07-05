import { CssSelectorType } from "./types.js";

export const SELECTOR_SEPARATOR = ", ";

// RegExp that will match invalid patterns that can be used in ID attribute.
export const INVALID_ID_RE = new RegExp(
  [
    "^$", // empty or not set
    "\\s", // contains whitespace
  ].join("|")
);

// RegExp that will match invalid patterns that can be used in class attribute.
export const INVALID_CLASS_RE = new RegExp(
  [
    "^$", // empty or not set
  ].join("|")
);

// Order in which a combined selector is constructed.
export const SELECTOR_PATTERN = [
  CssSelectorType.nthoftype,
  CssSelectorType.tag,
  CssSelectorType.id,
  CssSelectorType.class,
  CssSelectorType.attribute,
  CssSelectorType.nthchild,
];
