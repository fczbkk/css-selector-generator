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

export function* parentsGenerator(needle: Element[], root?: ParentNode) {
  root = root ?? getRootNode(needle[0]);
  let parent = getCommonParent(needle);
  while (parent && root.contains(parent)) {
    yield parent;
    parent = parent.parentElement;
  }
}

export function* viableParentsGenerator(
  needle: Element[],
  needleSelector: string,
  root?: ParentNode
) {
  for (const parentCandidate of parentsGenerator(needle, root)) {
    if (testParentSelector(parentCandidate, needleSelector, root)) {
      yield parentCandidate;
    }
  }
}

export function testParentSelector(
  needle: Element,
  selector: string,
  root: ParentNode
): boolean {
  const matchingElements = Array.from(root.querySelectorAll(selector));
  return matchingElements.every((element) => needle.contains(element));
}
