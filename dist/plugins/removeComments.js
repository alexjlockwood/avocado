"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Remove comments.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 */
function fn(item) {
    return item.comment && item.comment.charAt(0) !== '!' ? undefined : item;
}
exports.removeComments = {
    type: 'perItem',
    active: true,
    description: 'removes all comments',
    params: undefined,
    fn: fn,
};
