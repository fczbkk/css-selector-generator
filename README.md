# CSS Selector Generator

JavaScript object that creates unique CSS selector for given element.

It should work fine in any modern browser. It has no external dependencies.

## How to use

```javascript
// first, create instance of the object
my_selector_generator = new CssSelectorGenerator

// create (or find reference to) any element
my_element = document.createElement('div');
document.body.appendChild(my_element);

// then you can get unique CSS selector for any referenced element
my_element_selector = my_selector_generator.getSelector(my_element);
```

The most common use case is finding a unique CSS selector for any referenced element. This is handy if you, for example, let your users to select any element on the page by clicking on it:

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

## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue at GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

CSS Selector Generator is published under the [UNLICENSE license][3]. Feel free to use it in any way.


  [1]: https://github.com/fczbkk/css-selector-generator/issues
  [2]: mailto:riki@fczbkk.com?subject=CSSSelectorGenerator
  [3]: https://github.com/fczbkk/css-selector-generator/blob/master/UNLICENSE
