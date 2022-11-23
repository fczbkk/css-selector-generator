export function getCommonParent (needle: Element[]) {
  if (needle.length > 0) {
    let parent = needle[0].parentElement

    // optimization for single element
    if (needle.length === 1) {
      return parent
    }

    // find common parent for multiple elements
    while (parent) {
      if (needle.every(element => parent.contains(element))) {
        return parent
      }
      parent = parent.parentElement
    }
  }
  return null
}

export function  * parentsGenerator (needle: Element[]) {
  // TODO
}

export function * viableParentsGenerator () {
  // TODO
}
