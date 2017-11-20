"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Plugins engine.
 * @param {Object} data input data
 * @param {Array} plugins plugins object from config
 * @return {Object} output data
 */
function process(item, plugins) {
    plugins.forEach(function (batch) {
        switch (batch[0].type) {
            case 'perItem':
                item = perItem(item, batch);
                break;
            case 'perItemReverse':
                item = perItem(item, batch, true);
                break;
            case 'full':
                item = full(item, batch);
                break;
        }
    });
    return item;
}
exports.process = process;
/**
 * Direct or reverse per-item loop.
 * @param {Object} jsApi input data
 * @param {Array} plugins plugins list to process
 * @param {Boolean} [reverse] reverse pass
 * @return {Object} output data
 */
function perItem(jsApi, plugins, reverse) {
    if (reverse === void 0) { reverse = false; }
    return (function monkeys(item) {
        item.content = item.content.filter(function (i) {
            // Reverse pass.
            if (reverse && i.content) {
                monkeys(i);
            }
            // Main filter.
            var filter = true;
            for (var j = 0; filter && j < plugins.length; j++) {
                var _a = plugins[j], active = _a.active, params = _a.params, fn = _a.fn;
                if (active && !fn(i, params)) {
                    filter = false;
                }
            }
            // Direct pass.
            if (!reverse && i.content) {
                monkeys(i);
            }
            return filter;
        });
        return item;
    })(jsApi);
}
/**
 * Full plugins.
 * @param {Object} item input data
 * @param {Array} plugins plugins list to process
 * @return {Object} output data
 */
function full(item, plugins) {
    plugins.forEach(function (_a) {
        var active = _a.active, params = _a.params, fn = _a.fn;
        item = active ? fn(item, params) : item;
    });
    return item;
}
