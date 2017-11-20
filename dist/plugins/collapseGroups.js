"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Collapse groups with no attributes.
 * TODO: what about groups w/ a name but no other attributes?
 */
function fn(item) {
    if (!item.isElem() || item.isEmpty()) {
        return item;
    }
    item.content.forEach(function (g, i) {
        // Collapse non-empty groups with no attributes.
        if (g.isElem('group') && !g.isEmpty() && !g.hasAttr()) {
            item.spliceContent(i, 1, g.content);
        }
    });
    return item;
}
exports.collapseGroups = {
    type: 'perItemReverse',
    active: true,
    description: 'collapses useless groups',
    params: undefined,
    fn: fn,
};
