"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Plugins engine.
 *
 * @module plugins
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Object} plugins plugins object from config
 * @return {Object} output data
 */
function process(data, info, plugins) {
    plugins.forEach(function (group) {
        switch (group[0].type) {
            case 'perItem':
                data = perItem(data, info, group);
                break;
            case 'perItemReverse':
                data = perItem(data, info, group, true);
                break;
            case 'full':
                data = full(data, info, group);
                break;
        }
    });
    return data;
}
exports.process = process;
/**
 * Direct or reverse per-item loop.
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Array} plugins plugins list to process
 * @param {Boolean} [reverse] reverse pass?
 * @return {Object} output data
 */
function perItem(data, info, plugins, reverse) {
    return (function monkeys(items) {
        items.content = items.content.filter(function (item) {
            // Reverse pass.
            if (reverse && item.content) {
                monkeys(item);
            }
            // Main filter.
            var filter = true;
            for (var i = 0; filter && i < plugins.length; i++) {
                var plugin = plugins[i];
                if (plugin.active && plugin.fn(item, plugin.params, info) === false) {
                    filter = false;
                }
            }
            // Direct pass.
            if (!reverse && item.content) {
                monkeys(item);
            }
            return filter;
        });
        return items;
    })(data);
}
/**
 * "Full" plugins.
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Array} plugins plugins list to process
 * @return {Object} output data
 */
function full(data, info, plugins) {
    plugins.forEach(function (plugin) {
        if (plugin.active) {
            data = plugin.fn(data, plugin.params, info);
        }
    });
    return data;
}
