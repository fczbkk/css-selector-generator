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

A handy way of using the tool for development is to create a Chrome bookmark. You can pass any arbitrary Javascript to a Chrome (and Firefox) bookmark with the URL format `javascript:console.log('foobar');`
Using this principle, you can create a bookmark that 
1. Defines the CssSelectorGenerator class. (load `min.js`)
2. Instantiates it. (`my_selector_generator = new CssSelectorGenerator`)
3. Creates a click event listenener to log the clicked element unique selector. (code from example above used)

Which gives us the URL you use for the bookmark: (step 1,2,3 + minify)
```javascript
javascript:(function(){var a,b,c=[].indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};a=function(){function a(a){null==a&&(a={}),this.options={},this.setOptions(this.default_options),this.setOptions(a)}return a.prototype.default_options={selectors:["id","class","tag","nthchild"]},a.prototype.setOptions=function(a){var b,c,d;null==a&&(a={}),c=[];for(b in a)d=a[b],this.default_options.hasOwnProperty(b)?c.push(this.options[b]=d):c.push(void 0);return c},a.prototype.isElement=function(a){return!(1!==(null!=a?a.nodeType:void 0))},a.prototype.getParents=function(a){var b,c;if(c=[],this.isElement(a))for(b=a;this.isElement(b);)c.push(b),b=b.parentNode;return c},a.prototype.getTagSelector=function(a){return this.sanitizeItem(a.tagName.toLowerCase())},a.prototype.sanitizeItem=function(a){var b;return b=a.split("").map(function(a){return":"===a?"\\"+":".charCodeAt(0).toString(16).toUpperCase()+" ":/[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/.test(a)?"\\"+a:escape(a).replace(/\%/g,"\\")}),b.join("")},a.prototype.getIdSelector=function(a){var b,c;return b=a.getAttribute("id"),null==b||""===b||/\s/.exec(b)||/^\d/.exec(b)||(c="#"+this.sanitizeItem(b),1!==a.ownerDocument.querySelectorAll(c).length)?null:c},a.prototype.getClassSelectors=function(a){var b,c,d;return d=[],b=a.getAttribute("class"),null!=b&&(b=b.replace(/\s+/g," "),b=b.replace(/^\s|\s$/g,""),""!==b&&(d=function(){var a,d,e,f;for(e=b.split(/\s+/),f=[],a=0,d=e.length;a<d;a++)c=e[a],f.push("."+this.sanitizeItem(c));return f}.call(this))),d},a.prototype.getAttributeSelectors=function(a){var b,d,e,f,g,h,i;for(i=[],d=["id","class"],g=a.attributes,e=0,f=g.length;e<f;e++)b=g[e],h=b.nodeName,c.call(d,h)<0&&i.push("["+b.nodeName+"="+b.nodeValue+"]");return i},a.prototype.getNthChildSelector=function(a){var b,c,d,e,f,g;if(e=a.parentNode,null!=e)for(b=0,g=e.childNodes,c=0,d=g.length;c<d;c++)if(f=g[c],this.isElement(f)&&(b++,f===a))return":nth-child("+b+")";return null},a.prototype.testSelector=function(a,b){var c,d;return c=!1,null!=b&&""!==b&&(d=a.ownerDocument.querySelectorAll(b),1===d.length&&d[0]===a&&(c=!0)),c},a.prototype.testUniqueness=function(a,b){var c,d;return d=a.parentNode,c=d.querySelectorAll(b),1===c.length&&c[0]===a},a.prototype.testCombinations=function(a,b,c){var d,e,f,g,h,i,j;for(i=this.getCombinations(b),e=0,g=i.length;e<g;e++)if(d=i[e],this.testUniqueness(a,d))return d;if(null!=c)for(j=b.map(function(a){return c+a}),f=0,h=j.length;f<h;f++)if(d=j[f],this.testUniqueness(a,d))return d;return null},a.prototype.getUniqueSelector=function(a){var b,c,d,e,f,g,h;for(h=this.getTagSelector(a),d=this.options.selectors,b=0,c=d.length;b<c;b++){switch(f=d[b]){case"id":e=this.getIdSelector(a);break;case"tag":h&&this.testUniqueness(a,h)&&(e=h);break;case"class":g=this.getClassSelectors(a),null!=g&&0!==g.length&&(e=this.testCombinations(a,g,h));break;case"attribute":g=this.getAttributeSelectors(a),null!=g&&0!==g.length&&(e=this.testCombinations(a,g,h));break;case"nthchild":e=this.getNthChildSelector(a)}if(e)return e}return"*"},a.prototype.getSelector=function(a){var b,c,d,e,f,g,h;for(h=[],e=this.getParents(a),c=0,d=e.length;c<d;c++)if(b=e[c],g=this.getUniqueSelector(b),null!=g&&(h.unshift(g),f=h.join(" > "),this.testSelector(a,f)))return f;return null},a.prototype.getCombinations=function(a){var b,c,d,e,f,g,h;for(null==a&&(a=[]),h=[[]],b=d=0,f=a.length-1;0<=f?d<=f:d>=f;b=0<=f?++d:--d)for(c=e=0,g=h.length-1;0<=g?e<=g:e>=g;c=0<=g?++e:--e)h.push(h[c].concat(a[b]));return h.shift(),h=h.sort(function(a,b){return a.length-b.length}),h=h.map(function(a){return a.join("")})},a}(),("undefined"!=typeof define&&null!==define?define.amd:void 0)?define([],function(){return a}):(b="undefined"!=typeof exports&&null!==exports?exports:this,b.CssSelectorGenerator=a)}).call(this); selector_generator = new CssSelectorGenerator; document.body.addEventListener('click', function (event) { var element = event.target; var selector = selector_generator.getSelector(element); console.log(selector); });
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
- `'nthchild'` - N-th child selector. It is supported by IE9 and higher, but it is necessary to create a unique CSS selector for every possible element. You can remove it from the list for backwards browser compatibility, but then make sure to use IDs or class names on each element you want to target. E.g. `:nth-child(0)`
- `'attribute'` - Attribute selector. Compatible wth IE7 and higher. It will not create matching pairs for element's ID and class name attributes. This type of selector is disabled by default. E.g. `[rel=someRel]`


## Bug reports, feature requests and contact

If you found any bugs, if you have feature requests or any questions, please, either [file an issue on GitHub][1] or send me an e-mail at [riki@fczbkk.com][2]

## License

CSS Selector Generator is published under the [UNLICENSE license][3]. Feel free to use it in any way.


  [1]: https://github.com/fczbkk/css-selector-generator/issues
  [2]: mailto:riki@fczbkk.com?subject=CSSSelectorGenerator
  [3]: https://github.com/fczbkk/css-selector-generator/blob/master/UNLICENSE
