"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _path_1 = require("./_path");
/**
 * Merge multiple paths into one.
 */
function fn(item, params) {
    if (!item.isElem() || item.isEmpty()) {
        return item;
    }
    var prevContentItem;
    var prevContentItemKeys;
    item.content = item.content.filter(function (contentItem) {
        if (prevContentItem &&
            prevContentItem.isElem('path') &&
            prevContentItem.isEmpty() &&
            prevContentItem.hasAttr('android:pathData') &&
            contentItem.isElem('path') &&
            contentItem.isEmpty() &&
            contentItem.hasAttr('android:pathData')) {
            if (!prevContentItemKeys) {
                prevContentItemKeys = Object.keys(prevContentItem.attrs);
            }
            var contentItemAttrs = Object.keys(contentItem.attrs);
            var equalData = prevContentItemKeys.length === contentItemAttrs.length &&
                contentItemAttrs.every(function (key) {
                    return (key === 'android:pathData' ||
                        (prevContentItem.hasAttr(key) &&
                            prevContentItem.attr(key).value === contentItem.attr(key).value));
                });
            var prevPathJS = _path_1.path2js(prevContentItem);
            var curPathJS = _path_1.path2js(contentItem);
            if (equalData && !_path_1.intersects(prevPathJS, curPathJS)) {
                _path_1.js2path(prevContentItem, prevPathJS.concat(curPathJS), params);
                return false;
            }
        }
        prevContentItem = contentItem;
        prevContentItemKeys = undefined;
        return true;
    });
    return item;
}
exports.mergePaths = {
    type: 'perItem',
    active: true,
    description: 'merges multiple paths into one, if possible',
    params: {
        collapseRepeated: true,
        leadingZero: true,
        negativeExtraSpace: true,
    },
    fn: fn,
};
