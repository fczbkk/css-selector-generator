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
  element: { [key: string]: Element };
  group: { [key: string]: Element[] };
}

function parseComments(comments: Comment[]): ParseCommentsResult {
  const contentRe = new RegExp("\\s*(?<key>\\S+):\\s*(?<val>\\S+)\\s*", "g");
  const result: ParseCommentsResult = { element: {}, group: {} };
  comments.forEach((comment) => {
    const element = comment.parentElement;
    for (const match of comment.textContent.matchAll(contentRe)) {
      const { key, val } = match.groups;
      if (key === "name") {
        result.element[val] = element;
      }
      if (key === "group") {
        if (!result.group[val]) {
          result.group[val] = [];
        }
        result.group[val].push(element);
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

export function parseTestHtml(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  const comments = getAllComments(root);
  return {
    root,
    ...parseComments(comments),
  };
}
