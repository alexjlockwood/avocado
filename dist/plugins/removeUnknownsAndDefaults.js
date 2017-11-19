"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _collections = require("./_collections");
exports.type = 'perItem';
exports.active = true;
exports.description = 'removes unknown elements content and attributes, removes attrs with default values';
exports.params = {
    unknownContent: true,
    unknownAttrs: true,
    defaultAttrs: true,
    uselessOverrides: true,
    keepDataAttrs: true,
    keepAriaAttrs: true,
};
var elems = _collections.elems;
var attrsGroups = _collections.attrsGroups;
var elemsGroups = _collections.elemsGroups;
var attrsGroupsDefaults = _collections.attrsGroupsDefaults;
var attrsInheritable = _collections.inheritableAttrs;
var _loop_1 = function (e) {
    var elem = elems[e];
    if (elem.attrsGroups) {
        elem.attrs = elem.attrs || [];
        elem.attrsGroups.forEach(function (attrsGroupName) {
            elem.attrs = elem.attrs.concat(attrsGroups[attrsGroupName]);
            var groupDefaults = attrsGroupsDefaults[attrsGroupName];
            if (groupDefaults) {
                elem.defaults = elem.defaults || {};
                // tslint:disable-next-line:forin
                for (var attrName in groupDefaults) {
                    elem.defaults[attrName] = groupDefaults[attrName];
                }
            }
        });
    }
    if (elem.contentGroups) {
        elem.content = elem.content || [];
        elem.contentGroups.forEach(function (contentGroupName) {
            elem.content = elem.content.concat(elemsGroups[contentGroupName]);
        });
    }
};
// collect and extend all references
// tslint:disable-next-line:forin
for (var e in elems) {
    _loop_1(e);
}
/**
 * Remove unknown elements content and attributes,
 * remove attributes with default values.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
function fn(item, params) {
    // elems w/o namespace prefix
    if (item.isElem() && !item.prefix) {
        var elem_1 = item.elem;
        // remove unknown element's content
        if (params.unknownContent &&
            !item.isEmpty() &&
            elems[elem_1] && // make sure we know of this element before checking its children
            elem_1 !== 'foreignObject' // Don't check foreignObject
        ) {
            item.content.forEach(function (content, i) {
                if (content.isElem() &&
                    !content.prefix &&
                    ((elems[elem_1].content && // Do we have a record of its permitted content?
                        elems[elem_1].content.indexOf(content.elem) === -1) ||
                        (!elems[elem_1].content && // we dont know about its permitted content
                            !elems[content.elem])) // check that we know about the element at all
                ) {
                    item.content.splice(i, 1);
                }
            });
        }
        // remove element's unknown attrs and attrs with default values
        if (elems[elem_1] && elems[elem_1].attrs) {
            item.eachAttr(function (attr) {
                if (attr.name !== 'xmlns' &&
                    (attr.prefix === 'xml' || !attr.prefix) &&
                    (!params.keepDataAttrs || attr.name.indexOf('data-') != 0) &&
                    (!params.keepAriaAttrs || attr.name.indexOf('aria-') != 0)) {
                    if (
                    // unknown attrs
                    (params.unknownAttrs &&
                        elems[elem_1].attrs.indexOf(attr.name) === -1) ||
                        // attrs with default values
                        (params.defaultAttrs &&
                            elems[elem_1].defaults &&
                            elems[elem_1].defaults[attr.name] === attr.value &&
                            (attrsInheritable.indexOf(attr.name) < 0 ||
                                !item.parentNode.computedAttr(attr.name))) ||
                        // useless overrides
                        (params.uselessOverrides &&
                            attr.name !== 'transform' &&
                            attrsInheritable.indexOf(attr.name) > -1 &&
                            item.parentNode.computedAttr(attr.name, attr.value))) {
                        item.removeAttr(attr.name);
                    }
                }
            });
        }
    }
}
exports.fn = fn;
