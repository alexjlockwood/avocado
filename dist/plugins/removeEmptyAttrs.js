"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = 'perItem';
exports.active = true;
exports.description = 'removes empty attributes';
exports.params = undefined;
/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
function fn(item) {
    if (item.elem) {
        item.eachAttr(function (attr) {
            if (attr.value === '') {
                item.removeAttr(attr.name);
            }
        });
    }
}
exports.fn = fn;
