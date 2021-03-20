# CSS Selector Generator

JavaScript object that creates a unique CSS selector for a given DOM element.

It also generates shorter selectors and is faster and/or more robust than many other libraries - see this [comparison](https://github.com/fczbkk/css-selector-generator-benchmark) and select the best alternative for your use case.

## Install

Add the library to your project via NPM or Yarn.

```shell
npm install css-selector-generator
yarn add css-selector-generator
```

Then include it in your source code:

```javascript
import getCssSelector from 'css-selector-generator';
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
document.body.addEventListener('click', function (event) {
  // get reference to the element user clicked on
  const element = event.target;
  // get unique CSS selector for that element
  const selector = getCssSelector(element);
  // do whatever you need to do with that selector
  console.log('selector', selector);
});
```

### Usage without NPM

If you don't want to use this library with NPM, you can download it directly from the "build" folder and insert it to your HTML document directly. In this case, the library is wrapped in namespace `CssSelectorGenerator`. So the usage would look something like this:

```html
<!-- link the library -->
<script src="build/index.js"></script>
<script>
	CssSelectorGenerator.getCssSelector(targtElement)
</script
```

### Fallback

`getCssSelector` determines the shortest CSS selector for parent -> child relationship, from the input Element until the Root Element.

If there is no _unique_ selector available for any of these relationships (parent -> child), a fallback of `*` will be used for this relationship.

    #wrapper > * > div > .text

In some cases, this selector may not be unique (e.g. `#wrapper > * > div > *`). In this case, it will fall back to an entire chain of `:nth-child` selectors like:

    ":nth-child(2) > :nth-child(4) > :nth-child(1) > :nth-child(12)"

### Selector types

You can choose which types of selectors do you want to use:

```html
<body>
	<!-- targetElement -->
	<div class="myElement"></div>
</body>
```

```javascript
getCssSelector(targetElement, {selectors: ['class']});
// ".myElement"
getCssSelector(targetElement, {selectors: ['tag']});
// "div"
```

Order of selector types defines their priority:

```javascript
getCssSelector(targetElement, {selectors: ['class', 'tag']});
// ".myElement"
getCssSelector(targetElement, {selectors: ['tag', 'class']});
// "div"
```

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
getCssSelector(targetElement)
// ".myRootElement > .myElement"
getCssSelector(targetElement, {root: document.querySelector('.myRootElement')});
// ".myElement"
```

### Blacklist

If you want to ignore some selectors, you can put them on the blacklist. Blacklist is an array that can contain either regular expressions, or strings. In strings, you can use an asterisk (`*`) as a wildcard that will match any number of any characters.

```html
<body>
	<!-- targetElement -->
	<div class="firstClass secondClass"></div>
</body>
```

```javascript
getCssSelector(targetElement, {blacklist: ['.firstClass']});
// ".secondClass"
getCssSelector(targetElement, {blacklist: ['.first*']});
// ".secondClass"
getCssSelector(targetElement, {blacklist: [/first/]});
// ".secondClass"
```

You can target selectors of any types using the blacklist.

```javascript
getCssSelector(
  targetElement,
  { blacklist:
      [
        // ID selector
        '#forbiddenId',
        // class selector
        '.forbiddenClass',
        // attribute selector
        '[forbidden-attribute]',
        // tag selector
        'div'
      ]
  }
)
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
getCssSelector(targetElement, {whitelist: ['.secondClass']});
// ".secondClass"
getCssSelector(targetElement, {whitelist: ['.second*']});
// ".secondClass"
getCssSelector(targetElement, {whitelist: [/second/]});
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
getCssSelector(targetElement, {combineWithinSelector: false});
// "body > :nth-child(1)" - in this case no single class name is unique
getCssSelector(targetElement, {combineWithinSelector: true});
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
getCssSelector(targetElement, {combineBetweenSelectors: false});
// "body > :nth-child(1)" - in this case no single class name or tag name is unique
getCssSelector(targetElement, {combineBetweenSelectors: true});
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
getCssSelector(targetElement, {includeTag: true});
// "div.myElement"
```

## Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [getCssSelector](#getcssselector)
    -   [Parameters](#parameters)
-   [updateIdentifiableParent](#updateidentifiableparent)
-   [css_selector_generator_options](#css_selector_generator_options)
    -   [Properties](#properties)
-   [css_selector_type](#css_selector_type)

### getCssSelector

Generates unique CSS selector for an element.

#### Parameters

-   `element` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** 
-   `custom_options` **[css_selector_generator_options](#css_selector_generator_options)?**  (optional, default `{}`)

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### updateIdentifiableParent

Utility function to make subsequent calls shorter.

Returns **{foundElement: [Element](https://developer.mozilla.org/docs/Web/API/Element), selector: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)}** 

### css_selector_generator_options

Type: [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### Properties

-   `selectors` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[css_selector_type](#css_selector_type)>?** List of selector types to use. They will be prioritised by their order.
-   `whitelist` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([RegExp](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))>?** List of selectors that should be prioritised.
-   `blacklist` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([RegExp](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) \| [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))>?** List of selectors that should be ignored.
-   `root` **[Element](https://developer.mozilla.org/docs/Web/API/Element)?** Root element inside which the selector will be generated. If not set, the document root will be used.
-   `combineWithinSelector` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** If set to `true`, the generator will test combinations of selectors of single type (e.g. multiple class selectors).
-   `combineBetweenSelectors` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** If set to `true`, the generator will try to test combinations of selectors of different types (e.g. tag + class name).
-   `includeTag` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** If set to `true`, all generated selectors will include the TAG part. Even if tag selector type is not included in `selectors` option.

### css_selector_type

Type: (`"id"` \| `"class"` \| `"tag"` \| `"attribute"` \| `"nthchild"` \| `"nthoftype"`)

## Migrate from v1 to v2

Instead of creating a class and then calling the `getSelector()` method, now you just call a function `getCssSelector()` and provide it with element reference and options:

```javascript
// v1
const mySelectorGenerator = new CssSelectorGenerator({/* custom options */});
mySelectorGenerator.getSelector(elementReference);

// v2
getCssSelector(elementReference, {/* custom options */});
```

-   Options `id_blacklist`, `class_blacklist` and `attribute_blacklist` are replaced with single `blacklist` option, which is now applied to all selector types.
-   Option `attribute_whitelist` is replaced with `whitelist` option, which is now applied to all selector types.
-   Option `prefix_tag` is renamed to `includeTag`.
-   Option `quote_attribute_when_needed` is removed. The attribute selectors are quoted automatically.

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue on GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

CSS Selector Generator is published under the [MIT license][3].

[1]: https://github.com/fczbkk/css-selector-generator/issues

[2]: mailto:riki@fczbkk.com?subject=CSSSelectorGenerator

[3]: https://github.com/fczbkk/css-selector-generator/blob/master/LICENSE
