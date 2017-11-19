"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _path = require("./_path");
exports.type = 'perItem';
exports.active = true;
exports.description = 'merges multiple paths in one if possible';
exports.params = {
    collapseRepeated: true,
    leadingZero: true,
    negativeExtraSpace: true,
};
var path2js = _path.path2js, js2path = _path.js2path, intersects = _path.intersects;
/**
 * Merge multiple Paths into one.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich, Lev Solntsev
 */
function fn(item, params) {
    if (!item.isElem() || item.isEmpty()) {
        return;
    }
    var prevContentItem = null;
    var prevContentItemKeys = null;
    item.content = item.content.filter(function (contentItem) {
        if (prevContentItem &&
            prevContentItem.isElem('path') &&
            prevContentItem.isEmpty() &&
            prevContentItem.hasAttr('d') &&
            contentItem.isElem('path') &&
            contentItem.isEmpty() &&
            contentItem.hasAttr('d')) {
            if (!prevContentItemKeys) {
                prevContentItemKeys = Object.keys(prevContentItem.attrs);
            }
            var contentItemAttrs = Object.keys(contentItem.attrs);
            var equalData = prevContentItemKeys.length == contentItemAttrs.length &&
                contentItemAttrs.every(function (key) {
                    return (key == 'd' ||
                        (prevContentItem.hasAttr(key) &&
                            prevContentItem.attr(key).value == contentItem.attr(key).value));
                });
            var prevPathJS = path2js(prevContentItem);
            var curPathJS = path2js(contentItem);
            if (equalData && !intersects(prevPathJS, curPathJS)) {
                js2path(prevContentItem, prevPathJS.concat(curPathJS), params);
                return false;
            }
        }
        prevContentItem = contentItem;
        prevContentItemKeys = null;
        return true;
    });
}
exports.fn = fn;
