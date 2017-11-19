export class JsApi {
  parentNode: JsApi | undefined;
  content?: JsApi[];
  elem: string;
  prefix?: string;
  local?: string;
  attrs?: any;

  constructor(
    data: {
      elem: string;
      content?: JsApi[];
      prefix?: string;
      local?: string;
      attrs?: { [key: string]: any };
    },
    parentNode?: JsApi,
  ) {
    this.elem = data.elem;
    this.content = data.content;
    this.prefix = data.prefix;
    this.local = data.local;
    this.attrs = data.attrs;
    this.parentNode = parentNode;
  }

  /**
   * Perform a deep clone of this node.
   * @return {Object} element
   */
  clone() {
    // Deep-clone node data
    const nodeData = JSON.parse(
      JSON.stringify({
        elem: this.elem,
        prefix: this.prefix,
        local: this.local,
        attrs: this.attrs,
      }),
    );
    const clonedNode = new JsApi(nodeData, this.parentNode);
    if (this.content) {
      clonedNode.content = this.content.map(childNode => {
        const clonedChild = childNode.clone();
        clonedChild.parentNode = clonedNode;
        return clonedChild;
      });
    }
    return clonedNode;
  }

  /**
   * Determine if item is an element (any, with a specific name or in a names array).
   * @param {String|Array} [elemNames] element name or names arrays
   * @return {Boolean}
   */
  isElem(elemNames?: string | string[]) {
    if (!elemNames) {
      return !!this.elem;
    }
    if (Array.isArray(elemNames)) {
      return !!this.elem && elemNames.indexOf(this.elem) >= 0;
    }
    return !!this.elem && this.elem === elemNames;
  }

  /**
   * Renames an element.
   * @param {String} name new element name
   * @return {Object} element
   */
  renameElem(name: string) {
    if (name && typeof name === 'string') {
      this.elem = this.local = name;
    }
    return this;
  }

  /**
   * Determine if element is empty.
   * @return {Boolean}
   */
  isEmpty() {
    return !this.content || !this.content.length;
  }

  /**
   * Find the closest ancestor of the current element.
   * @param elemName
   * @return {?Object}
   */
  closestElem(elemName: string) {
    let node: JsApi = this;
    while ((node = node.parentNode) && !node.isElem(elemName)) {}
    return node;
  }

  /**
   * Changes content by removing elements and/or adding new elements.
   * @param {Number} start Index at which to start changing the content.
   * @param {Number} n Number of elements to remove.
   * @param {Array|Object} [insertion] Elements to add to the content.
   * @return {Array} Removed elements.
   */
  spliceContent(start: number, n: number, insertion: JsApi[]) {
    if (arguments.length < 2) {
      return [];
    }
    if (!Array.isArray(insertion)) {
      insertion = Array.apply(null, arguments).slice(2);
    }
    insertion.forEach(function(inner) {
      inner.parentNode = this;
    }, this);
    return this.content.splice.apply(
      this.content,
      ([start, n] as Array<number | JsApi>).concat(insertion),
    );
  }

  /**
   * Determine if element has an attribute (any, or by name or by name + value).
   * @param {String} [name] attribute name
   * @param {String} [val] attribute value (will be toString()'ed)
   * @return {Boolean}
   */
  hasAttr(name?: string, val?: any) {
    if (!this.attrs || !Object.keys(this.attrs).length) {
      return false;
    }
    if (!arguments.length) {
      return !!this.attrs;
    }
    if (val !== undefined) {
      return !!this.attrs[name] && this.attrs[name].value === val.toString();
    }
    return !!this.attrs[name];
  }

  /**
   * Determine if element has an attribute by local name
   * (any, or by name or by name + value).
   *
   * @param {String} [localName] local attribute name
   * @param {Number|String|RegExp|Function} [val] attribute value (will be toString()'ed or executed, otherwise ignored)
   * @return {Boolean}
   */
  hasAttrLocal(localName?: string, val?: number | string | RegExp | Function) {
    if (!this.attrs || !Object.keys(this.attrs).length) {
      return false;
    }
    if (!arguments.length) {
      return !!this.attrs;
    }
    let callback: Function;
    // tslint:disable-next-line:triple-equals no-null-keyword
    switch (val != null && val.constructor && val.constructor.name) {
      case 'Number': // same as String
      case 'String':
        callback = stringValueTest;
        break;
      case 'RegExp':
        callback = regexpValueTest;
        break;
      case 'Function':
        callback = funcValueTest;
        break;
      default:
        callback = nameTest;
        break;
    }
    return this.someAttr(callback);

    function stringValueTest(attr) {
      // tslint:disable-next-line:triple-equals
      return attr.local === localName && val == attr.value;
    }

    function regexpValueTest(attr) {
      const valRegExp = val as RegExp;
      return attr.local === localName && valRegExp.test(attr.value);
    }

    function funcValueTest(attr) {
      const valFn = val as Function;
      return attr.local === localName && valFn(attr.value);
    }

    function nameTest(attr) {
      return attr.local === localName;
    }
  }

  /**
   * Get a specific attribute from an element (by name or name + value).
   * @param {String} name attribute name
   * @param {String} [val] attribute value (will be toString()'ed)
   * @return {Object|Undefined}
   */
  attr(name: string, val?: string) {
    if (!this.hasAttr() || !arguments.length) {
      return undefined;
    }
    if (val !== undefined) {
      return this.hasAttr(name, val) ? this.attrs[name] : undefined;
    }
    return this.attrs[name];
  }

  /**
   * Get computed attribute value from an element.
   * @param {String} name attribute name
   * @return {Object|Undefined}
   */
  computedAttr(name: string, val: any) {
    if (!arguments.length) {
      return;
    }

    let elem: JsApi;
    for (
      elem = this;
      elem && (!elem.hasAttr(name) || !elem.attr(name).value);
      elem = elem.parentNode
    ) {}

    // tslint:disable-next-line:triple-equals no-null-keyword
    if (val != null) {
      return elem ? elem.hasAttr(name, val) : false;
    } else if (elem && elem.hasAttr(name)) {
      return elem.attrs[name].value;
    } else {
      return undefined;
    }
  }

  /**
   * Remove a specific attribute.
   * @param {String|Array} name attribute name
   * @param {String} [val] attribute value
   * @return {Boolean}
   */
  removeAttr(name, val, recursive?: boolean) {
    if (!arguments.length) {
      return false;
    }
    if (Array.isArray(name)) {
      // TODO: figure out how this is supposed to work...
      // @ts-ignore
      name.forEach(this.removeAttr, this);
    }
    if (!this.hasAttr(name)) {
      return false;
    }
    if (!recursive && val && this.attrs[name].value !== val) {
      return false;
    }
    delete this.attrs[name];
    if (!Object.keys(this.attrs).length) {
      delete this.attrs;
    }
    return true;
  }

  /**
   * Add attribute.
   * @param {Object} [attr={}] attribute object
   * @return {Object|Boolean} created attribute or false if no attr was passed in
   */
  addAttr(attr) {
    attr = attr || {};
    if (
      attr.name === undefined ||
      attr.prefix === undefined ||
      attr.local === undefined
    ) {
      return false;
    }
    this.attrs = this.attrs || {};
    this.attrs[attr.name] = attr;
    return this.attrs[attr.name];
  }

  /**
   * Iterates over all attributes.
   *
   * @param {Function} callback callback
   * @param {Object} [context] callback context
   * @return {Boolean} false if there are no any attributes
   */
  eachAttr(callback: Function, context) {
    if (!this.hasAttr()) {
      return false;
    }
    for (const name of Object.keys(this.attrs)) {
      callback.call(context, this.attrs[name]);
    }
    return true;
  }

  /**
   * Tests whether some attribute passes the test.
   *
   * @param {Function} callback callback
   * @param {Object} [context] callback context
   * @return {Boolean} false if there are no any attributes
   */
  someAttr(callback: Function, context?) {
    if (!this.hasAttr()) {
      return false;
    }
    for (const name of Object.keys(this.attrs)) {
      if (callback.call(context, this.attrs[name])) {
        return true;
      }
    }
    return false;
  }
}
