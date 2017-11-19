"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = 'perItem';
exports.active = true;
exports.description = 'removes comments';
exports.params = undefined;
/**
 * Remove comments.
 *
 * @example
 * <!-- Generator: Adobe Illustrator 15.0.0, SVG Export
 * Plug-In . SVG Version: 6.00 Build 0)  -->
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
function fn(item) {
    if (item.comment && item.comment.charAt(0) !== '!') {
        return false;
    }
}
exports.fn = fn;
