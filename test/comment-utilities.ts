type ElementIdentifier = string;

interface SelectorExpectation {
  name: ElementIdentifier,
  selector: string
}

interface CommentData {
  name: ElementIdentifier[],
  expect: SelectorExpectation[],
}

const CHUNK_DELIMITER = /[;\n]/
const KEY_VAL_DELIMITER = ':'
// TODO convert to regexp, so that escaping works
const VALUES_DELIMITER = '/'

function parseNameChunk (content: string): ElementIdentifier[] {
  return content.split(VALUES_DELIMITER)
    .map(s => s.trim())
    // remove empty values
    .filter(Boolean)
}

function parseExpectChunk (content: string): SelectorExpectation[] {
  const parts = content.split(VALUES_DELIMITER, 2).map(s => s.trim())
  if (parts.length === 1) {
    // TODO this needs to happend after the parsing for all comments in the element is done, because names can be defined later or in standalone comment
    // TODO return value of this function should make the "name" property optional
    const name = crypto.randomUUID()
    const selector = parts[0]
    return [{name, selector }]
  }
  if (parts.length === 2) {
    const [name, selector] = parts
    return [{name, selector}]
  }
  return []
}

const chunkParsers = {
  name: parseNameChunk,
  expect: parseExpectChunk,
} as const

export function parseComment (content: string = ''): CommentData {
  const result: CommentData = {
    name: [],
    expect: [],
  }

  const chunks = content.split(CHUNK_DELIMITER)
  chunks.forEach(chunk => {
    const [key, val] = chunk.split(KEY_VAL_DELIMITER, 2).map(s => s.trim())
    if (chunkParsers[key]) {
      const data = chunkParsers[key](val)
      result[key].push(...data)
      // if parsing 'expect', add names to the result (may contain generated ones)
      if (key === 'expect') {
        result.name.push(data[0].name)
      }
    }
  })

  result.name = [...new Set(result.name)]

  return result
}
