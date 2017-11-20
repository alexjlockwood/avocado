"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Remove empty groups.
 * TODO: are there any empty containers that could be removed in an animated-vector?
 */
function fn(item) {
    return item.isElem('g') && item.isEmpty() ? undefined : item;
}
exports.removeEmptyGroups = {
    type: 'perItemReverse',
    active: true,
    description: 'removes empty groups',
    params: undefined,
    fn: fn,
};
