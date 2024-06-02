/**
 * Guard function that checks if provided `input` is an Element.
 */
export function isElement(input: unknown): input is Element {
  return (
    typeof input === "object" &&
    input !== null &&
    (input as Element).nodeType === Node.ELEMENT_NODE
  );
}
