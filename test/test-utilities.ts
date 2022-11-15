export const TARGET_ELEMENT_SELECTOR = "[data-target]";

/**
 * Creates blank element used in tests.
 */
export function createRoot() {
  return document.body.appendChild(document.createElement("div"));
}

/**
 * Simple way to retrieve multiple target elements for test.
 */
export function getTargetElements(root: Element) {
  return [...root.querySelectorAll(TARGET_ELEMENT_SELECTOR)];
}

/**
 * Simple way to retrieve target element for test.
 */
export function getTargetElement(root: ParentNode) {
  return root.querySelector(TARGET_ELEMENT_SELECTOR);
}
