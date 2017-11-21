"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collapseGroups_1 = require("./plugins/collapseGroups");
var convertPathData_1 = require("./plugins/convertPathData");
var js2xml_1 = require("./js2xml");
var mergePaths_1 = require("./plugins/mergePaths");
var _plugins_1 = require("./plugins/_plugins");
var removeComments_1 = require("./plugins/removeComments");
var removeEmptyGroups_1 = require("./plugins/removeEmptyGroups");
var removeXMLProcInst_1 = require("./plugins/removeXMLProcInst");
var xml2js_1 = require("./xml2js");
// import * as cleanupAttrs from './plugins/cleanupAttrs';
// import * as cleanupIDs from './plugins/cleanupIDs';
// import * as cleanupNumericValues from './plugins/cleanupNumericValues';
// import * as convertColors from './plugins/convertColors';
// import * as removeUnknownsAndDefaults from './plugins/removeUnknownsAndDefaults';
// import * as removeUselessStrokeAndFill from './plugins/removeUselessStrokeAndFill';
// import * as removeHiddenElems from './plugins/removeHiddenElems';
// import * as convertTransform from './plugins/convertTransform';
// import * as removeUnusedNS from './plugins/removeUnusedNS';
// import * as sortAttrs from './plugins/sortAttrs';
exports.plugins = {
    // The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
    removeXMLProcInst: removeXMLProcInst_1.removeXMLProcInst,
    removeComments: removeComments_1.removeComments,
    // cleanupAttrs,
    // cleanupIDs,
    // cleanupNumericValues,
    // convertColors,
    // removeUnknownsAndDefaults,
    // removeUselessStrokeAndFill,
    // removeHiddenElems,
    collapseGroups: collapseGroups_1.collapseGroups,
    convertPathData: convertPathData_1.convertPathData,
    // convertTransform,
    removeEmptyGroups: removeEmptyGroups_1.removeEmptyGroups,
    mergePaths: mergePaths_1.mergePaths,
};
// Arrange plugins by type - this is what plugins() expects.
var optimizedPluginsData = (function (plugins) {
    return plugins.map(function (item) { return [item]; }).reduce(function (arr, item) {
        var last = arr[arr.length - 1];
        if (last && item[0].type === last[0].type) {
            last.push(item[0]);
        }
        else {
            arr.push(item);
        }
        return arr;
    }, []);
})(Array.from(Object.values(exports.plugins)));
var Avdo = /** @class */ (function () {
    function Avdo(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        options.plugins = options.plugins || optimizedPluginsData;
    }
    Avdo.prototype.optimize = function (xml) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var maxPassCount = _this.options.multipass ? 10 : 1;
            var counter = 0;
            var prevResultSize = Number.POSITIVE_INFINITY;
            var onSuccess = function (result) {
                if (++counter < maxPassCount && result.length < prevResultSize) {
                    prevResultSize = result.length;
                    _this.optimizeOnce(result, onSuccess, onFail);
                }
                else {
                    resolve(result);
                }
            };
            var onFail = function (error) { return reject(error); };
            _this.optimizeOnce(xml, onSuccess, onFail);
        });
    };
    Avdo.prototype.optimizeOnce = function (xml, onSuccess, onFail) {
        var options = this.options;
        xml2js_1.xml2js(xml, function (jsApi) {
            jsApi = _plugins_1.processPlugins(jsApi, options.plugins);
            onSuccess(js2xml_1.js2xml(jsApi, { pretty: options.pretty }));
        }, function (error) { return onFail(error); });
    };
    return Avdo;
}());
exports.Avdo = Avdo;
