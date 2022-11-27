import { getRootNode, testSelector } from "./utilities-dom";

export function getCommonParent(needle: Element[]) {
  if (needle.length > 0) {
    let parent = needle[0].parentElement;

    // optimization for single element
    if (needle.length === 1) {
      return parent;
    }

    // find common parent for multiple elements
    while (parent) {
      if (needle.every((element) => parent.contains(element))) {
        return parent;
      }
      parent = parent.parentElement;
    }
  }
  return null;
}

/**
 * Yields all common parents of the needle, starting with the one closest to the needle.
 */
export function* parentsGenerator(needle: Element[], root?: ParentNode) {
  root = root ?? getRootNode(needle[0]);
  let parent = getCommonParent(needle);
  while (parent && root.contains(parent)) {
    yield parent;
    parent = parent.parentElement;
  }
}

/**
 * Yields all parents of the needle that when used as a root for selector, will only match the needle.
 */
export function* viableParentsGenerator(
  needle: Element[],
  needleSelector: string,
  root?: ParentNode
) {
  for (const parentCandidate of parentsGenerator(needle, root)) {
    if (testSelector(needle, needleSelector, parentCandidate)) {
      yield parentCandidate;
    }
  }
}

/**
 * Check whether needle selector within this parent will match only the needle.
 */
export function testParentCandidate(
  needle: Element,
  needleSelector: string,
  parent: ParentNode
): boolean {
  const matchingElements = Array.from(parent.querySelectorAll(needleSelector));
  return (
    matchingElements.length > 0 &&
    matchingElements.every((element) => needle.contains(element))
  );
}
