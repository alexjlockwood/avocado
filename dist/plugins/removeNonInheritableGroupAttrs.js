"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _collections = require("./_collections");
exports.type = 'perItem';
exports.active = true;
exports.description = 'removes non-inheritable group’s presentational attributes';
exports.params = undefined;
var inheritableAttrs = _collections.inheritableAttrs;
var attrsGroups = _collections.attrsGroups;
var excludedAttrs = ['display', 'opacity'];
/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
function fn(item) {
    if (item.isElem('g')) {
        item.eachAttr(function (attr) {
            if (~attrsGroups.presentation.indexOf(attr.name) &&
                ~attrsGroups.graphicalEvent.indexOf(attr.name) &&
                ~attrsGroups.core.indexOf(attr.name) &&
                ~attrsGroups.conditionalProcessing.indexOf(attr.name) &&
                !~excludedAttrs.indexOf(attr.name) &&
                !~inheritableAttrs.indexOf(attr.name)) {
                item.removeAttr(attr.name);
            }
        });
    }
}
exports.fn = fn;
