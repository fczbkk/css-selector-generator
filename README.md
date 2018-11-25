# CSS Selector Generator

JavaScript object that creates a unique CSS selector for a given DOM element.

It should work fine in any modern browser. It has no external dependencies.

It also generates shorter selectors and is faster and/or more robust than many other libraries - see this [comparison](https://github.com/fczbkk/css-selector-generator-benchmark) and select the best alternative for your use case.

## How to use

```javascript
// first, create instance of the object with default options
my_selector_generator = new CssSelectorGenerator;

// create (or find reference to) any element
my_element = document.createElement('div');
document.body.appendChild(my_element);

// then you can get unique CSS selector for any referenced element
my_element_selector = my_selector_generator.getSelector(my_element);
```

The most common use case is finding a unique CSS selector for any referenced element. This is handy if you, for example, let your users select any element on the page by clicking on it:

```javascript
// track every click
document.body.addEventListener('click', function (event) {
  // get reference to the element user clicked on
  var element = event.target;
  // get unique CSS selector for that element
  var selector = my_selector_generator.getSelector(element);
  // do whatever you need to do with that selector
  console.log('selector', selector);
});
```

## Options

You can set the options either when creating an instance, or via the `setOptions()` method:

```javascript
custom_options = {selectors: ['tag', 'id', 'class']};

// set options when creating an instance
my_selector_generator = new CssSelectorGenerator(custom_options);

// or set options later
my_selector_generator.setOptions(custom_options);
```

### selectors

default: `['id', 'class', 'tag', 'nthchild']`

So far the only option available is the list of types of selectors that will be used when constructing the unique CSS selector. You may want to adjust this list for browser compatibility.

NOTE: The generator keeps the order of selectors when testing for their uniqueness. So if you will set `['class', 'id']` and the element will have unique classname and ID, the resulting selector will contain classname, even if ID is stronger. Also, keep the `nthchild` selector in last place, because it always generates unique selector and it will prevent using any other selector type behind it.

Available values:

- `'tag'` - Tag selector. E.g. `p`, `div`.
- `'id'` - ID selector. E.g. `#myElement`.
- `'class'` - Class selector. It will get all class names of the element. E.g. `.myClass`, `.firstClass.secondClass`.
- `'nthchild'` - N-th child selector. It is supported by IE9 and higher, but either of `nthchild` or `nthtype` is necessary to create a unique CSS selector for every possible element. You can remove them from the list for backwards browser compatibility, but then make sure to use IDs or class names on each element you want to target. E.g. `:nth-child(1)`
- `'nthtype'` - N-th type selector (always prefixed with the tag name). It is supported by IE9 and higher, but either of `nthchild` or `nthtype` is necessary to create a unique CSS selector for every possible element. You can remove them from the list for backwards browser compatibility, but then make sure to use IDs or class names on each element you want to target. E.g. `a:nth-of-type(1)`
- `'attribute'` - Attribute selector. Compatible wth IE7 and higher. It will not create matching pairs for element's ID and class name attributes. This type of selector is disabled by default. E.g. `[rel=someRel]`

### root_node

default: element.ownerDocument

The document root relative to which the CSS selector is generated.

### id_whitelist

default: `[]`

List of ID values as strings or regular expressions, which will be processed first. These override the `id_blacklist` values.

### id_blacklist

default: `[]`

List of ID values as strings or regular expressions, which will be ignored when creating ID selectors.

### class_whitelist

default: `[]`

List of class names as strings or regular expressions, which will be processed before `class_blacklist`.

### class_blacklist

default: `[]`

List of class names as strings or regular expressions, which will be ignored when creating class selectors.


### prefix_tag

default: `false`

If set to true, ID selectors will be prefixed with the tag name.

For example selector for this element

```html
<div id="myElement">...</div>
```

will look like this: `div#myElement`.

### attribute_blacklist

default: `[]`

List of attribute names, which will be ignored when creating attribute selectors. Attributes "id" and "class" are always be ignored.

### attribute_whitelist

default: `[]`

List of attribute names, which will be prioritised when creating attribute selectors.

### quote_attribute_when_needed

default: `false`

If set to `true`, attribute selector values will be quoted and escaped when needed.

### get_options

default: `null`

If set to a function that takes an element as a parameter, calls the function to get options specific to element which are
merged into existing options.

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue on GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

CSS Selector Generator is published under the [UNLICENSE license][3]. Feel free to use it in any way.


  [1]: https://github.com/fczbkk/css-selector-generator/issues
  [2]: mailto:riki@fczbkk.com?subject=CSSSelectorGenerator
  [3]: https://github.com/fczbkk/css-selector-generator/blob/master/UNLICENSE
