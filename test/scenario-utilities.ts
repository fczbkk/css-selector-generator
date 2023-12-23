const COMMENT_SPLITTER = getRegExpSplitter(":");
const EXPECTATION_SPLITTER = getRegExpSplitter(";");

type MapOfSets<keyType, valType> = Map<keyType, Set<valType>>;

/**
 * Helper function that makes it easier working with Maps of Sets. Especially the `.set()` method, which checks for existing keys and creates a new Set if needed.
 */
function createMapOfSets<keyType, valType>() {
  const data: MapOfSets<keyType, valType> = new Map();
  return {
    getData: () => data,
    get: (key: keyType) => data.get(key) || new Set(),
    set: (key: keyType, val: valType) => {
      const set = data.get(key) || new Set();
      set.add(val);
      data.set(key, set);
    },
    forEach: (
      callback: (
        val: Set<valType>,
        key: keyType,
        map: MapOfSets<keyType, valType>,
      ) => void,
    ) => data.forEach(callback),
  };
}

function getRegExpSplitter(divider: string): RegExp {
  return new RegExp(`^\\s*(?<key>.+)\\s*${divider}\\s*(?<val>.+)\\s*$`);
}

function splitContent(content: string, re: RegExp): [string, string] {
  const match = content.match(re);
  if (!match) {
    return [null, content];
  }
  const { key, val } = match.groups;
  return [key.trim(), val.trim()];
}

type ScenarioExpectationItem = {
  element?: Element;
  identifier?: string;
  expectation?: string;
};

export function parseCommentContent(
  content: string,
): ScenarioExpectationItem | null {
  const [key, val] = splitContent(content, COMMENT_SPLITTER);
  if (key === "expect") {
    const [identifier, expectation] = splitContent(val, EXPECTATION_SPLITTER);
    if (identifier && expectation) {
      return { identifier, expectation };
    } else {
      return { expectation };
    }
  }
  if (key === "identifier") {
    return { identifier: val };
  }
  return null;
}

export function parseComment(comment: Comment): ScenarioExpectationItem | null {
  const result = parseCommentContent(comment.textContent);
  if (result) {
    if (!result.expectation || !result.identifier) {
      result.element = comment.parentElement;
    }
    return result;
  }
  return null;
}

export type ScenarioExpectations = Map<string, Set<Element>>;

export function parseAllComments(rootElement: Element): ScenarioExpectations {
  const foundComments: ScenarioExpectationItem[] = [];
  const elementsByExpectation = createMapOfSets<string, Element>();
  const elementsByIdentifier = createMapOfSets<string, Element>();
  const expectationsByIdentifier = createMapOfSets<string, string>();

  const iterator = document.createNodeIterator(
    rootElement,
    NodeFilter.SHOW_COMMENT,
    { acceptNode: () => NodeFilter.FILTER_ACCEPT },
  );
  let currentNode: Comment;
  while ((currentNode = iterator.nextNode() as Comment)) {
    const comment = parseComment(currentNode);
    if (comment) {
      foundComments.push(comment);
    }
  }

  foundComments.forEach(({ element, expectation, identifier }) => {
    if (element && expectation) {
      elementsByExpectation.set(expectation, element);
    }
    if (element && identifier) {
      elementsByIdentifier.set(identifier, element);
    }
    if (expectation && identifier) {
      expectationsByIdentifier.set(identifier, expectation);
    }
  });

  expectationsByIdentifier.forEach((expectations, identifier) => {
    const elements = elementsByIdentifier.get(identifier);
    if (elements.size > 0) {
      elements.forEach((element) => {
        expectations.forEach((expectation) => {
          elementsByExpectation.set(expectation, element);
        });
      });
    }
  });
  return elementsByExpectation.getData();
}
