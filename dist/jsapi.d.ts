export declare class JsApi {
    parentNode: JsApi | undefined;
    content?: JsApi[];
    elem: string;
    prefix?: string;
    local?: string;
    attrs?: any;
    constructor(data: {
        elem: string;
        content?: JsApi[];
        prefix?: string;
        local?: string;
        attrs?: {
            [key: string]: any;
        };
    }, parentNode?: JsApi);
    /**
     * Perform a deep clone of this node.
     * @return {Object} element
     */
    clone(): JsApi;
    /**
     * Determine if item is an element (any, with a specific name or in a names array).
     * @param {String|Array} [elemNames] element name or names arrays
     * @return {Boolean}
     */
    isElem(elemNames?: string | string[]): boolean;
    /**
     * Renames an element.
     * @param {String} name new element name
     * @return {Object} element
     */
    renameElem(name: string): this;
    /**
     * Determine if element is empty.
     * @return {Boolean}
     */
    isEmpty(): boolean;
    /**
     * Find the closest ancestor of the current element.
     * @param elemName
     * @return {?Object}
     */
    closestElem(elemName: string): JsApi;
    /**
     * Changes content by removing elements and/or adding new elements.
     * @param {Number} start Index at which to start changing the content.
     * @param {Number} n Number of elements to remove.
     * @param {Array|Object} [insertion] Elements to add to the content.
     * @return {Array} Removed elements.
     */
    spliceContent(start: number, n: number, insertion: JsApi[]): any;
    /**
     * Determine if element has an attribute (any, or by name or by name + value).
     * @param {String} [name] attribute name
     * @param {String} [val] attribute value (will be toString()'ed)
     * @return {Boolean}
     */
    hasAttr(name?: string, val?: any): boolean;
    /**
     * Determine if element has an attribute by local name
     * (any, or by name or by name + value).
     *
     * @param {String} [localName] local attribute name
     * @param {Number|String|RegExp|Function} [val] attribute value (will be toString()'ed or executed, otherwise ignored)
     * @return {Boolean}
     */
    hasAttrLocal(localName?: string, val?: number | string | RegExp | Function): boolean;
    /**
     * Get a specific attribute from an element (by name or name + value).
     * @param {String} name attribute name
     * @param {String} [val] attribute value (will be toString()'ed)
     * @return {Object|Undefined}
     */
    attr(name: string, val?: string): any;
    /**
     * Get computed attribute value from an element.
     * @param {String} name attribute name
     * @return {Object|Undefined}
     */
    computedAttr(name: string, val: any): any;
    /**
     * Remove a specific attribute.
     * @param {String|Array} name attribute name
     * @param {String} [val] attribute value
     * @return {Boolean}
     */
    removeAttr(name: any, val: any, recursive?: boolean): boolean;
    /**
     * Add attribute.
     * @param {Object} [attr={}] attribute object
     * @return {Object|Boolean} created attribute or false if no attr was passed in
     */
    addAttr(attr: any): any;
    /**
     * Iterates over all attributes.
     *
     * @param {Function} callback callback
     * @param {Object} [context] callback context
     * @return {Boolean} false if there are no any attributes
     */
    eachAttr(callback: Function, context: any): boolean;
    /**
     * Tests whether some attribute passes the test.
     *
     * @param {Function} callback callback
     * @param {Object} [context] callback context
     * @return {Boolean} false if there are no any attributes
     */
    someAttr(callback: Function, context?: any): boolean;
}
