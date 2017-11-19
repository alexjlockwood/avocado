"use strict";
var SAX = require("sax");
var JsApi = require("./jsapi");
var saxOptions = {
    trim: false,
    normalize: true,
    lowercase: true,
    xmlns: true,
    position: true,
};
module.exports = function (data, callback) {
    var sax = SAX.parser(true, saxOptions);
    var root = new JsApi({ elem: '#document', content: [] });
    var current = root;
    var stack = [root];
    var parsingError = false;
    function pushToContent(content) {
        var newContent = new JsApi(content, current);
        (current.content = current.content || []).push(newContent);
        return newContent;
    }
    sax.onopentag = function (node) {
        var qualifiedTag = node;
        var elem = {
            elem: qualifiedTag.name,
            prefix: qualifiedTag.prefix,
            local: qualifiedTag.local,
            attrs: {},
        };
        console.log(qualifiedTag);
        console.log('name', qualifiedTag.name, 'prefix', qualifiedTag.prefix, 'local', qualifiedTag.local);
        for (var _i = 0, _a = Object.keys(qualifiedTag.attributes); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var _b = qualifiedTag.attributes[name_1], value = _b.value, prefix = _b.prefix, local = _b.local;
            elem.attrs[name_1] = { name: name_1, value: value, prefix: prefix, local: local };
        }
        var jsApiElem = pushToContent(elem);
        current = jsApiElem;
        stack.push(jsApiElem);
    };
    sax.onclosetag = function () {
        stack.pop();
        current = stack[stack.length - 1];
    };
    sax.oncomment = function (comment) {
        comment = comment.trim();
        pushToContent({ comment: comment });
    };
    sax.onerror = function (error) {
        error.message = 'Error in parsing SVG: ' + error.message;
        if (error.message.indexOf('Unexpected end') < 0) {
            throw error;
        }
    };
    sax.onend = function () {
        if (this.error) {
            callback({ error: this.error.message });
        }
        else {
            callback(root);
        }
    };
    try {
        sax.write(data);
    }
    catch (e) {
        callback({ error: e.message });
        parsingError = true;
    }
    if (!parsingError) {
        sax.close();
    }
};
