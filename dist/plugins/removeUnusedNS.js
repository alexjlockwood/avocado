"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Remove unused namespaces declarations.
 * TODO: remove namespace declarations that occur on non-root nodes?
 */
function fn(data) {
    var svgElem;
    var xmlnsCollection = [];
    function removeNSfromCollection(nsName) {
        var pos = xmlnsCollection.indexOf(nsName);
        // If found, remove the ns from the namespaces collection.
        if (pos > -1) {
            xmlnsCollection.splice(pos, 1);
        }
    }
    data = (function recurseFn(items) {
        var i = 0;
        var length = items.content.length;
        while (i < length) {
            var item = items.content[i];
            if (item.isElem('vector') || item.isElem('animated-vector')) {
                item.eachAttr(function (attr) {
                    // Collect namespaces.
                    if (attr.prefix === 'xmlns' && attr.local) {
                        xmlnsCollection.push(attr.local);
                    }
                });
                // If the root element has ns-attr.
                if (xmlnsCollection.length) {
                    // Save root element.
                    svgElem = item;
                }
            }
            else if (xmlnsCollection.length) {
                // Check item for the ns-attrs.
                if (item.prefix) {
                    removeNSfromCollection(item.prefix);
                }
                // Check each attr for the ns-attrs.
                item.eachAttr(function (attr) { return removeNSfromCollection(attr.prefix); });
            }
            // If nothing is found, go deeper.
            if (xmlnsCollection.length && item.content) {
                recurseFn(item);
            }
            i++;
        }
        return items;
    })(data);
    // Remove svg element ns-attributes if they are never used.
    if (xmlnsCollection.length) {
        xmlnsCollection.forEach(function (name) { return svgElem.removeAttr('xmlns:' + name); });
    }
    return data;
}
exports.removeUnusedNS = {
    type: 'full',
    active: true,
    description: 'removes unused namespaces declarations',
    params: undefined,
    fn: fn,
};
