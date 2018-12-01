const default_options = {};

/**
 * Generator of unique CSS selector for specific element.
 */
export default class CssSelectorGenerator {

  constructor (custom_options = {}) {
    this._options = Object.assign({}, default_options);
    this._options = this.setOptions(custom_options);
  }

  setOptions (custom_options = {}) {
    // TODO sanitize options
    this._options = Object.assign({}, this._options, custom_options);
  }

  getSelector (element) {
    return null;
  }

}
