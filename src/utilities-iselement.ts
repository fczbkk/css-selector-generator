/**
 * Guard function that checks if provided `input` is an Element.
 */
export function isElement(input: unknown): input is Element {
  return input && input instanceof Element;
}
