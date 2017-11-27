export interface Attr {
  name: string;
  value: string;
  prefix: string;
  local: string;
}

export interface Options {
  content?: JsApi[];
  parentNode?: JsApi;
  elem?: string;
  prefix?: string;
  local?: string;
  attrs?: { [name: string]: Attr };
  comment?: { text: string };
  processingInstruction?: { name: string; body: string };
}

export class JsApi implements Options {
  content: JsApi[];
  parentNode?: JsApi;
  readonly elem?: string;
  readonly prefix?: string;
  readonly local?: string;
  attrs?: { [name: string]: Attr };
  readonly comment?: { text: string };
  readonly processingInstruction?: { name: string; body: string };

  // TODO: avoid this caching hackery
  pathJS?: Array<{ instruction: string; data?: number[] }>;

  constructor(arg: Options) {
    this.content = arg.content || [];
    this.parentNode = arg.parentNode;
    this.elem = arg.elem;
    this.prefix = arg.prefix;
    this.local = arg.local;
    this.attrs = arg.attrs;
    this.comment = arg.comment;
    this.processingInstruction = arg.processingInstruction;
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
   * Determine if element is empty.
   * @return {Boolean}
   */
  isEmpty() {
    return !this.content || !this.content.length;
  }

  // /**
  //  * Find the closest ancestor of the current element.
  //  * @param elemName
  //  * @return {Object}
  //  */
  // closestElem(elemName: string) {
  //   let node: JsApi = this;
  //   while ((node = node.parentNode) && !node.isElem(elemName)) {}
  //   return node;
  // }

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
      insertion = Array.apply(undefined, arguments).slice(2);
    }
    insertion.forEach(function(this: JsApi, inner) {
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
  computedAttr(name: string, val?: any) {
    if (!arguments.length) {
      return undefined;
    }

    let elem: JsApi;
    for (
      elem = this;
      elem && (!elem.hasAttr(name) || !elem.attr(name).value);
      elem = elem.parentNode
    ) {}

    // tslint:disable-next-line:triple-equals no-null-keyword
    if (val != null) {
      // TODO: why return a boolean here instead of a string?
      return elem ? elem.hasAttr(name, val) : undefined;
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
  removeAttr(name: string | string[]) {
    if (!arguments.length) {
      return false;
    }
    if (Array.isArray(name)) {
      name.forEach(this.removeAttr, this);
    }
    // TODO: fix this cast
    if (!this.hasAttr(name as any)) {
      return false;
    }
    // TODO: fix this cast
    delete this.attrs[name as any];
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
  addAttr(attr: Attr) {
    attr = attr || ({} as Attr);
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
  eachAttr(callback: (attr: Attr) => void, context?: any) {
    if (!this.hasAttr()) {
      return false;
    }
    for (const name of Object.keys(this.attrs)) {
      callback.call(context, this.attrs[name]);
    }
    return true;
  }
}
