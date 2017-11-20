"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Remove comments.
 */
function fn(item) {
    return item.comment && item.comment.text.charAt(0) !== '!' ? undefined : item;
}
exports.removeComments = {
    type: 'perItem',
    active: true,
    description: 'removes all comments',
    params: undefined,
    fn: fn,
};
