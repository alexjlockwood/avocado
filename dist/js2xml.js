"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var OS = require("os");
var EOL = OS.EOL;
var entities = {
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
    '>': '&gt;',
    '<': '&lt;',
};
var defaults = {
    doctypeStart: '<!DOCTYPE',
    doctypeEnd: '>',
    procInstStart: '<?',
    procInstEnd: '?>',
    tagOpenStart: '<',
    tagOpenEnd: '>',
    tagCloseStart: '</',
    tagCloseEnd: '>',
    tagShortStart: '<',
    tagShortEnd: '/>',
    attrStart: '="',
    attrEnd: '"',
    commentStart: '<!--',
    commentEnd: '-->',
    cdataStart: '<![CDATA[',
    cdataEnd: ']]>',
    textStart: '',
    textEnd: '',
    indent: 4,
    regEntities: /[&'"<>]/g,
    regValEntities: /[&"<>]/g,
    encodeEntity: function (char) { return entities[char]; },
    pretty: false,
    useShortTags: true,
};
/**
 * Convert XML-as-JS object to XML string.
 * @param {Object} data input data
 * @param {Object} config config
 * @return {Object} output data
 */
function js2xml(data, config) {
    return new Js2Xml(config).convert(data);
}
exports.js2xml = js2xml;
var Js2Xml = /** @class */ (function () {
    function Js2Xml(config) {
        if (config) {
            this.config = __assign({}, defaults, config);
        }
        else {
            this.config = defaults;
        }
        var indent = this.config.indent;
        if (typeof indent !== 'number' && !isNaN(indent)) {
            this.config.indent = indent < 0 ? '\t' : ' '.repeat(indent);
        }
        else if (typeof indent !== 'string') {
            this.config.indent = '    ';
        }
        if (this.config.pretty) {
            this.config.doctypeEnd += EOL;
            this.config.procInstEnd += EOL;
            this.config.commentEnd += EOL;
            this.config.cdataEnd += EOL;
            this.config.tagShortEnd += EOL;
            this.config.tagOpenEnd += EOL;
            this.config.tagCloseEnd += EOL;
            this.config.textEnd += EOL;
        }
        this.indentLevel = 0;
    }
    /**
     * Start conversion.
     *
     * @param {Object} data input data
     *
     * @return {String}
     */
    Js2Xml.prototype.convert = function (data) {
        var _this = this;
        var svg = '';
        if (data.content) {
            this.indentLevel++;
            data.content.forEach(function (item) {
                if (item.elem) {
                    svg += _this.createElem(item);
                }
                else if (item.doctype) {
                    svg += _this.createDoctype(item.doctype);
                }
                else if (item.processinginstruction) {
                    svg += _this.createProcInst(item.processinginstruction);
                }
                else if (item.comment) {
                    svg += _this.createComment(item.comment);
                }
                else if (item.cdata) {
                    svg += _this.createCDATA(item.cdata);
                }
            }, this);
        }
        this.indentLevel--;
        return {
            data: svg,
            info: {
                width: this.width,
                height: this.height,
            },
        };
    };
    /**
     * Create indent string in accordance with the current node level.
     *
     * @return {String}
     */
    Js2Xml.prototype.createIndent = function () {
        var indent = '';
        if (this.config.pretty) {
            indent = this.config.indent.repeat(this.indentLevel - 1);
        }
        return indent;
    };
    /**
     * Create doctype tag.
     *
     * @param {String} doctype doctype body string
     *
     * @return {String}
     */
    Js2Xml.prototype.createDoctype = function (doctype) {
        return this.config.doctypeStart + doctype + this.config.doctypeEnd;
    };
    /**
     * Create XML Processing Instruction tag.
     *
     * @param {Object} instruction instruction object
     *
     * @return {String}
     */
    Js2Xml.prototype.createProcInst = function (instruction) {
        return (this.config.procInstStart +
            instruction.name +
            ' ' +
            instruction.body +
            this.config.procInstEnd);
    };
    /**
     * Create comment tag.
     *
     * @param {String} comment comment body
     *
     * @return {String}
     */
    Js2Xml.prototype.createComment = function (comment) {
        return this.config.commentStart + comment + this.config.commentEnd;
    };
    /**
     * Create CDATA section.
     *
     * @param {String} cdata CDATA body
     *
     * @return {String}
     */
    Js2Xml.prototype.createCDATA = function (cdata) {
        return (this.createIndent() +
            this.config.cdataStart +
            cdata +
            this.config.cdataEnd);
    };
    /**
     * Create element tag.
     *
     * @param {Object} data element object
     *
     * @return {String}
     */
    Js2Xml.prototype.createElem = function (data) {
        // beautiful injection for obtaining SVG information :)
        if (data.isElem('svg') && data.hasAttr('width') && data.hasAttr('height')) {
            this.width = data.attr('width').value;
            this.height = data.attr('height').value;
        }
        // empty element and short tag
        if (data.isEmpty()) {
            if (this.config.useShortTags) {
                return (this.createIndent() +
                    this.config.tagShortStart +
                    data.elem +
                    this.createAttrs(data) +
                    this.config.tagShortEnd);
            }
            else {
                return (this.createIndent() +
                    this.config.tagShortStart +
                    data.elem +
                    this.createAttrs(data) +
                    this.config.tagOpenEnd +
                    this.config.tagCloseStart +
                    data.elem +
                    this.config.tagCloseEnd);
            }
            // non-empty element
        }
        else {
            var tagOpenStart = this.config.tagOpenStart;
            var tagOpenEnd = this.config.tagOpenEnd;
            var tagCloseStart = this.config.tagCloseStart;
            var tagCloseEnd = this.config.tagCloseEnd;
            var openIndent = this.createIndent();
            var dataEnd = '';
            var processedData = '' + this.convert(data).data;
            return (openIndent +
                tagOpenStart +
                data.elem +
                this.createAttrs(data) +
                tagOpenEnd +
                processedData +
                dataEnd +
                this.createIndent() +
                tagCloseStart +
                data.elem +
                tagCloseEnd);
        }
    };
    /**
     * Create element attributes.
     *
     * @param {Object} elem attributes object
     *
     * @return {String}
     */
    Js2Xml.prototype.createAttrs = function (elem) {
        var attrs = '';
        elem.eachAttr(function (attr) {
            if (attr.value !== undefined) {
                attrs +=
                    ' ' +
                        attr.name +
                        this.config.attrStart +
                        String(attr.value).replace(this.config.regValEntities, this.config.encodeEntity) +
                        this.config.attrEnd;
            }
            else {
                attrs += ' ' + attr.name;
            }
        }, this);
        return attrs;
    };
    return Js2Xml;
}());
