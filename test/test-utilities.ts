export function createRoot() {
  return document.body.appendChild(document.createElement("div"));
}

/**
 * Simple way to retrieve target element for test.
 * @returns {Element}
 */
export function getTargetElement(root: Element): Element {
  return root.querySelector("[data-target]");
}

/**
 * Simple way to retrieve multiple target elements for test.
 * @returns {Element[]}
 */
export function getTargetElements(root: Element): Element[] {
  return [...root.querySelectorAll("[data-target]")];
}
