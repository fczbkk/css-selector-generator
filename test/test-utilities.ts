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

interface ParseCommentsResult {
  element: Record<string, Element>;
  group: Record<string, Element[]>;
  expectation: Record<string, string>;
}

function parseComments(comments: Comment[]): ParseCommentsResult {
  const contentRe = new RegExp("\\s*(?<key>\\S+):\\s*(?<val>\\S+)\\s*", "g");
  const result: ParseCommentsResult = {
    element: {},
    group: {},
    expectation: {},
  };
  comments.forEach((comment) => {
    const element = comment.parentElement;
    for (const { groups } of comment.textContent.matchAll(contentRe)) {
      if (!groups) {
        continue;
      }
      const { key, val } = groups;
      if (key === "name") {
        result.element[val] = element;
      }
      if (key === "group") {
        if (!(val in result.group)) {
          result.group[val] = [];
        }
        result.group[val].push(element);
      }
      if (key === "expect") {
        const [id, selector] = val.split(/;/);
        result.expectation[id] = selector;
      }
    }
  });
  return result;
}

function isCommentNode(node: Node): node is Comment {
  return node.nodeType === Node.COMMENT_NODE;
}

function getAllComments(root: Element): Comment[] {
  const result: Comment[] = [];
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  let currentNode = treeWalker.firstChild();
  while (currentNode) {
    if (isCommentNode(currentNode)) {
      result.push(currentNode);
    }
    currentNode = treeWalker.nextNode();
  }
  return result;
}

export type ScenarioData = ParseCommentsResult & {
  root: Element;
};

export function getScenarioData(root: Element): ScenarioData {
  const comments = getAllComments(root);
  return {
    root,
    ...parseComments(comments),
  };
}

// TODO Use `parseAllComments` from scenario-utilities.ts instead.
export function parseTestHtml(html: string): ScenarioData {
  const root = document.createElement("div");
  root.innerHTML = html;
  return getScenarioData(root);
}
