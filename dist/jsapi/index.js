module.exports = /** @class */ (function () {
    function JsApi(data, parentNode) {
        /**
         * Perform a deep clone of this node.
         * @return {Object} element
         */
        this.clone = function () {
            var node = this;
            var nodeData = {};
            Object.keys(node).forEach(function (key) {
                if (key !== 'content') {
                    nodeData[key] = node[key];
                }
            });
            // Deep-clone node data
            nodeData = JSON.parse(JSON.stringify(nodeData));
            // parentNode gets set to a proper object by the parent clone,
            // but it needs to be true/false now to do the right thing
            // in the constructor.
            var clonedNode = new JsApi(nodeData, node.parentNode);
            if (node.content) {
                clonedNode.content = node.content.map(function (childNode) {
                    var clonedChild = childNode.clone();
                    clonedChild.parentNode = clonedNode;
                    return clonedChild;
                });
            }
            return clonedNode;
        };
        /**
         * Determine if item is an element
         * (any, with a specific name or in a names array).
         *
         * @param {String|Array} [param] element name or names arrays
         * @return {Boolean}
         */
        this.isElem = function (param) {
            if (!param)
                return !!this.elem;
            if (Array.isArray(param))
                return !!this.elem && param.indexOf(this.elem) > -1;
            return !!this.elem && this.elem === param;
        };
        /**
         * Renames an element
         *
         * @param {String} name new element name
         * @return {Object} element
         */
        this.renameElem = function (name) {
            if (name && typeof name === 'string')
                this.elem = this.local = name;
            return this;
        };
        /**
         * Determine if element is empty.
         *
         * @return {Boolean}
         */
        this.isEmpty = function () {
            return !this.content || !this.content.length;
        };
        /**
         * Find the closest ancestor of the current element.
         * @param elemName
         *
         * @return {?Object}
         */
        this.closestElem = function (elemName) {
            var elem = this;
            while ((elem = elem.parentNode) && !elem.isElem(elemName))
                ;
            return elem;
        };
        /**
         * Changes content by removing elements and/or adding new elements.
         *
         * @param {Number} start Index at which to start changing the content.
         * @param {Number} n Number of elements to remove.
         * @param {Array|Object} [insertion] Elements to add to the content.
         * @return {Array} Removed elements.
         */
        this.spliceContent = function (start, n, insertion) {
            if (arguments.length < 2)
                return [];
            if (!Array.isArray(insertion))
                insertion = Array.apply(null, arguments).slice(2);
            insertion.forEach(function (inner) {
                inner.parentNode = this;
            }, this);
            return this.content.splice.apply(this.content, [start, n].concat(insertion));
        };
        /**
         * Determine if element has an attribute
         * (any, or by name or by name + value).
         *
         * @param {String} [name] attribute name
         * @param {String} [val] attribute value (will be toString()'ed)
         * @return {Boolean}
         */
        this.hasAttr = function (name, val) {
            if (!this.attrs || !Object.keys(this.attrs).length)
                return false;
            if (!arguments.length)
                return !!this.attrs;
            if (val !== undefined)
                return !!this.attrs[name] && this.attrs[name].value === val.toString();
            return !!this.attrs[name];
        };
        /**
         * Determine if element has an attribute by local name
         * (any, or by name or by name + value).
         *
         * @param {String} [localName] local attribute name
         * @param {Number|String|RegExp|Function} [val] attribute value (will be toString()'ed or executed, otherwise ignored)
         * @return {Boolean}
         */
        this.hasAttrLocal = function (localName, val) {
            if (!this.attrs || !Object.keys(this.attrs).length)
                return false;
            if (!arguments.length)
                return !!this.attrs;
            var callback;
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
            }
            return this.someAttr(callback);
            function nameTest(attr) {
                return attr.local === localName;
            }
            function stringValueTest(attr) {
                return attr.local === localName && val == attr.value;
            }
            function regexpValueTest(attr) {
                return attr.local === localName && val.test(attr.value);
            }
            function funcValueTest(attr) {
                return attr.local === localName && val(attr.value);
            }
        };
        /**
         * Get a specific attribute from an element
         * (by name or name + value).
         *
         * @param {String} name attribute name
         * @param {String} [val] attribute value (will be toString()'ed)
         * @return {Object|Undefined}
         */
        this.attr = function (name, val) {
            if (!this.hasAttr() || !arguments.length)
                return undefined;
            if (val !== undefined)
                return this.hasAttr(name, val) ? this.attrs[name] : undefined;
            return this.attrs[name];
        };
        /**
         * Get computed attribute value from an element
         *
         * @param {String} name attribute name
         * @return {Object|Undefined}
         */
        this.computedAttr = function (name, val) {
            /* jshint eqnull: true */
            if (!arguments.length)
                return;
            for (var elem = this; elem && (!elem.hasAttr(name) || !elem.attr(name).value); elem = elem.parentNode)
                ;
            if (val != null) {
                return elem ? elem.hasAttr(name, val) : false;
            }
            else if (elem && elem.hasAttr(name)) {
                return elem.attrs[name].value;
            }
        };
        /**
         * Remove a specific attribute.
         *
         * @param {String|Array} name attribute name
         * @param {String} [val] attribute value
         * @return {Boolean}
         */
        this.removeAttr = function (name, val, recursive) {
            if (!arguments.length)
                return false;
            if (Array.isArray(name))
                name.forEach(this.removeAttr, this);
            if (!this.hasAttr(name))
                return false;
            if (!recursive && val && this.attrs[name].value !== val)
                return false;
            delete this.attrs[name];
            if (!Object.keys(this.attrs).length)
                delete this.attrs;
            return true;
        };
        /**
         * Add attribute.
         *
         * @param {Object} [attr={}] attribute object
         * @return {Object|Boolean} created attribute or false if no attr was passed in
         */
        this.addAttr = function (attr) {
            attr = attr || {};
            if (attr.name === undefined ||
                attr.prefix === undefined ||
                attr.local === undefined)
                return false;
            this.attrs = this.attrs || {};
            this.attrs[attr.name] = attr;
            if (attr.name === 'class') {
                // newly added class attribute
                this.class.hasClass();
            }
            if (attr.name === 'style') {
                // newly added style attribute
                this.style.hasStyle();
            }
            return this.attrs[attr.name];
        };
        /**
         * Iterates over all attributes.
         *
         * @param {Function} callback callback
         * @param {Object} [context] callback context
         * @return {Boolean} false if there are no any attributes
         */
        this.eachAttr = function (callback, context) {
            if (!this.hasAttr())
                return false;
            for (var name in this.attrs) {
                callback.call(context, this.attrs[name]);
            }
            return true;
        };
        /**
         * Tests whether some attribute passes the test.
         *
         * @param {Function} callback callback
         * @param {Object} [context] callback context
         * @return {Boolean} false if there are no any attributes
         */
        this.someAttr = function (callback, context) {
            if (!this.hasAttr())
                return false;
            for (var name in this.attrs) {
                if (callback.call(context, this.attrs[name]))
                    return true;
            }
            return false;
        };
        Object.assign(this, data);
        if (parentNode) {
            Object.defineProperty(this, 'parentNode', {
                writable: true,
                value: parentNode,
            });
        }
    }
    return JsApi;
}());
