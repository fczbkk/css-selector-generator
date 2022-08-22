# CSS Selector Generator

JavaScript object that creates a unique CSS selector for a given DOM element or multiple DOM elements.

It also generates shorter selectors and is faster and/or more robust than many other libraries - see this [comparison](https://github.com/fczbkk/css-selector-generator-benchmark) and select the best alternative for your use case.

## Install

Add the library to your project via NPM or Yarn.

```shell
npm install css-selector-generator
yarn add css-selector-generator
```

Then include it in your source code:

```javascript
import { getCssSelector } from "css-selector-generator";
```

## How to use

Simplest way to use it is to provide an element reference, without any options.

```html
<body>
  <!-- targetElement -->
  <div class="myElement"></div>
</body>
```

```javascript
getCssSelector(targetElement);
// ".myElement"
```

Typical example is to create a selector for any element that the user clicks on:

```javascript
// track every click
document.body.addEventListener("click", function (event) {
  // get reference to the element user clicked on
  const element = event.target;
  // get unique CSS selector for that element
  const selector = getCssSelector(element);
  // do whatever you need to do with that selector
  console.log("selector", selector);
});
```

### Usage without NPM

If you don't want to use this library with NPM, you can download it directly from the "build" folder and insert it to your HTML document directly. In this case, the library is wrapped in namespace `CssSelectorGenerator`. So the usage would look something like this:

```html
<!-- link the library -->
<script src="build/index.js"></script>
<script>
	CssSelectorGenerator.getCssSelector(targetElement)
</script
```

### Usage with virtual DOM (e.g. JSDOM)

If you want to use this library with Node, usually for testing, don't require it directly into the Node process. It will not work, because there's no `window` object and there are no elements to select. Instead, you have to add the library to the virtual `window` object. Here are instructions how to do it in JSDOM, other libraries will work in a similar way:
https://github.com/jsdom/jsdom/wiki/Don't-stuff-jsdom-globals-onto-the-Node-global

### Multi-element selector

This library also allows you to create selector targeting multiple elements at once. You do that by calling the same function, but you provide an array of elements instead of single element:

```html
<body>
  <!-- firstElement -->
  <div class="aaa bbb"></div>
  <!-- secondElement -->
  <span class="bbb ccc"></span>
</body>
```

```javascript
getCssSelector([firstElement, secondElement]);
// ".bbb"
```

If it is not possible to construct single selector for all elements a standalone selector for each element will be generated:

```html
<body>
  <!-- firstElement -->
  <div></div>
  <!-- secondElement -->
  <span></span>
</body>
```

```javascript
getCssSelector([firstElement, secondElement]);
// "div, span"
```

### Fallback

`getCssSelector` determines the shortest CSS selector for parent -> child relationship, from the input Element until the Root Element.

If there is no _unique_ selector available for any of these relationships (parent -> child), a fallback of `*` will be used for this relationship.

    #wrapper > * > div > .text

In some cases, this selector may not be unique (e.g. `#wrapper > * > div > *`). In this case, it will fall back to an entire chain of `:nth-child` selectors like:

    ":nth-child(2) > :nth-child(4) > :nth-child(1) > :nth-child(12)"

## Options

- [`selectors`](#selector-types)
- [`root`](#root-element)
- [`blacklist`](#blacklist)
- [`combineWithinSelector`](#combine-within-selector)
- [`combineBetweenSelectors`](#combine-between-selectors)
- [`includeTag`](#include-tag)
- [`maxCombinations`](#max-combinations)
- [`maxCandidates`](#max-candidates)

### Selector types

You can choose which types of selectors do you want to use:

```html
<body>
  <!-- targetElement -->
  <div class="myElement"></div>
</body>
```

```javascript
getCssSelector(targetElement, { selectors: ["class"] });
// ".myElement"
getCssSelector(targetElement, { selectors: ["tag"] });
// "div"
```

Order of selector types defines their priority:

```javascript
getCssSelector(targetElement, { selectors: ["class", "tag"] });
// ".myElement"
getCssSelector(targetElement, { selectors: ["tag", "class"] });
// "div"
```

Valid selector types are:

- `id`
- `class`
- `tag`
- `attribute`
- `nthchild`
- `nthoftype`

### Root element

You can define root element, from which the selector will be created. If root element is not defined, document root will be used:

```html
<body>
  <div class="myRootElement">
    <!-- targetElement -->
    <div class="myElement"></div>
  </div>
</body>
```

```javascript
getCssSelector(targetElement);
// ".myRootElement > .myElement"
getCssSelector(targetElement, {
  root: document.querySelector(".myRootElement"),
});
// ".myElement"
```

### Blacklist

If you want to ignore some selectors, you can put them on the blacklist. Blacklist is an array that can contain either regular expressions, strings and/or functions.

In **strings**, you can use an asterisk (`*`) as a wildcard that will match any number of any characters.

**Functions** will receive a selector as a parameter. They should always return boolean, `true` if it is a match, `false` if it is not. Any other type of return value will be ignored.

```html
<body>
  <!-- targetElement -->
  <div class="firstClass secondClass"></div>
</body>
```

```javascript
getCssSelector(targetElement, { blacklist: [".firstClass"] });
// ".secondClass"
getCssSelector(targetElement, { blacklist: [".first*"] });
// ".secondClass"
getCssSelector(targetElement, { blacklist: [/first/] });
// ".secondClass"
getCssSelector(targetElement, {
  blacklist: [(input) => input.startsWith(".second")],
});
// ".secondClass"
```

You can target selectors of any types using the blacklist.

```javascript
getCssSelector(targetElement, {
  blacklist: [
    // ID selector
    "#forbiddenId",
    // class selector
    ".forbiddenClass",
    // attribute selector
    "[forbidden-attribute]",
    // tag selector
    "div",
  ],
});
```

### Whitelist

Same as `blacklist` option, but instead of ignoring matching selectors, they will be prioritised.

```html
<body>
  <!-- targetElement -->
  <div class="firstClass secondClass"></div>
</body>
```

```javascript
getCssSelector(targetElement, { whitelist: [".secondClass"] });
// ".secondClass"
getCssSelector(targetElement, { whitelist: [".second*"] });
// ".secondClass"
getCssSelector(targetElement, { whitelist: [/second/] });
// ".secondClass"
```

### Combine within selector

If set to `true`, the generator will try to look for combinations of selectors within a single type (usually class names) to get better overall selector.

```html
<body>
  <!-- targetElement -->
  <div class="aaa bbb"></div>
  <div class="aaa ccc"></div>
  <div class="bbb ccc"></div>
</body>
```

```javascript
getCssSelector(targetElement, { combineWithinSelector: false });
// "body > :nth-child(1)" - in this case no single class name is unique
getCssSelector(targetElement, { combineWithinSelector: true });
// ".aaa.bbb"
```

This option is set to `true` by default. It can be set to `false` for performance reasons.

### Combine between selectors

If set to `true`, the generator will try to look for combinations of selectors between various types (e.g. tag name + class name) to get better overall selector.

```html
<body>
	<!-- targetElement -->
	<div class="aaa"></div>
	<div class="bbb"></div>
	<p class="aaa"></div>
</body>
```

```javascript
getCssSelector(targetElement, { combineBetweenSelectors: false });
// "body > :nth-child(1)" - in this case no single class name or tag name is unique
getCssSelector(targetElement, { combineBetweenSelectors: true });
// "div.aaa"
```

This option is set to `true` by default. It can be set to `false` for performance reasons.

### Include tag

This option will add tag selector type to every selector:

```html
<body>
  <!-- targetElement -->
  <div class="myElement"></div>
</body>
```

```javascript
getCssSelector(targetElement, { includeTag: true });
// "div.myElement"
```

### Max combinations

This is a performance optimization option that can help when trying to find a CSS selector within elements that contain large numbers of class names (e.g. because of frameworks that create atomic styles) or other attributes.

In such case, the number of possible combinations between class names can be too large (it grows exponentially) and can significantly slow down selector generation. In reality, if the selector is not found within first few combinations, it usually won't be found within the rest of combinations.

```javascript
getCssSelector(targetElement, { maxCombinations: 100 });
```

### Max candidates

Performance optimization option, similar to `maxCombinations`. This does limit a total number of selector candidates for each element.

You should use it in cases, when there are not too many class names and attributes, but they are numerous enough to produce large number of combinations between them.

```javascript
getCssSelector(targetElement, { maxCandidates: 100 });
```

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue on GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

CSS Selector Generator is published under the [MIT license][3].

[1]: https://github.com/fczbkk/css-selector-generator/issues
[2]: mailto:riki@fczbkk.com?subject=CSSSelectorGenerator
[3]: https://github.com/fczbkk/css-selector-generator/blob/master/LICENSE
