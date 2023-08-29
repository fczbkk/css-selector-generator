type ElementIdentifier = string;

interface RawSelectorExpectation {
  name?: ElementIdentifier;
  selector: string;
}

type SelectorExpectation = Required<RawSelectorExpectation>;

interface CommentData {
  name: ElementIdentifier[];
  expect: RawSelectorExpectation[];
}

interface ElementCommentsData {
  name: ElementIdentifier[];
  expect: SelectorExpectation[];
}

const CHUNK_DELIMITER = /[;\n]/;
const KEY_VAL_DELIMITER = ":";
// TODO convert to regexp, so that escaping works
const VALUES_DELIMITER = "/";

function trimString(s: string): string {
  return s.trim();
}

function isEmptyString(s: string): boolean {
  return Boolean(s);
}

function parseNameChunk(content: string): ElementIdentifier[] {
  return content.split(VALUES_DELIMITER).map(trimString).filter(isEmptyString);
}

function parseExpectChunk(content: string): RawSelectorExpectation[] {
  const parts = content.split(VALUES_DELIMITER, 2).map(trimString);
  if (parts.length === 1) {
    const selector = parts[0];
    return [{ selector }];
  }
  if (parts.length === 2) {
    const [name, selector] = parts;
    return [{ name, selector }];
  }
  return [];
}

const chunkParsers = {
  name: parseNameChunk,
  expect: parseExpectChunk,
} as const;

export function parseComment(comment: string = ""): CommentData {
  const result: CommentData = {
    name: [],
    expect: [],
  };

  const chunks = comment.split(CHUNK_DELIMITER);
  chunks.forEach((chunk) => {
    const [key, val] = chunk.split(KEY_VAL_DELIMITER, 2).map(trimString);
    if (chunkParsers[key]) {
      const data = chunkParsers[key](val);
      result[key].push(...data);
    }
  });

  result.name = [...new Set(result.name)];

  return result;
}

export function parseElementComments(comments: string[]): ElementCommentsData {
  const names = new Set<ElementIdentifier>();
  const rawExpects: RawSelectorExpectation[] = [];

  comments.forEach((comment) => {
    const { name, expect } = parseComment(comment);
    name.forEach((n) => names.add(n));
    expect.forEach((e) => {
      rawExpects.push(e);
      // make sure all names used in expectations are added to the list
      if (e.name) {
        names.add(e.name);
      }
    });
  });

  // if there are no names defined and there are expectations, generate random one
  if (rawExpects.length > 0 && names.size === 0) {
    names.add(crypto.randomUUID());
  }

  // make sure all expectations have names
  const expect = rawExpects.map((e) => {
    const name = e.name || names.values().next().value;
    return { name, selector: e.selector };
  });

  return {
    name: [...names],
    expect,
  };
}
