"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js_1 = require("./xml2js");
var _plugins_1 = require("./plugins/_plugins");
var js2xml_1 = require("./js2xml");
var removeXMLProcInst = require("./plugins/removeXMLProcInst");
var removeComments = require("./plugins/removeComments");
var removeXMLNS = require("./plugins/removeXMLNS");
var cleanupAttrs = require("./plugins/cleanupAttrs");
var cleanupIDs = require("./plugins/cleanupIDs");
var cleanupNumericValues = require("./plugins/cleanupNumericValues");
var convertColors = require("./plugins/convertColors");
var removeUnknownsAndDefaults = require("./plugins/removeUnknownsAndDefaults");
var removeNonInheritableGroupAttrs = require("./plugins/removeNonInheritableGroupAttrs");
var removeUselessStrokeAndFill = require("./plugins/removeUselessStrokeAndFill");
var removeHiddenElems = require("./plugins/removeHiddenElems");
var convertShapeToPath = require("./plugins/convertShapeToPath");
var moveElemsAttrsToGroup = require("./plugins/moveElemsAttrsToGroup");
var moveGroupAttrsToElems = require("./plugins/moveGroupAttrsToElems");
var collapseGroups = require("./plugins/collapseGroups");
var convertPathData = require("./plugins/convertPathData");
var convertTransform = require("./plugins/convertTransform");
var removeEmptyAttrs = require("./plugins/removeEmptyAttrs");
var removeEmptyContainers = require("./plugins/removeEmptyContainers");
var mergePaths = require("./plugins/mergePaths");
var removeUnusedNS = require("./plugins/removeUnusedNS");
var sortAttrs = require("./plugins/sortAttrs");
var removeDimensions = require("./plugins/removeDimensions");
// Arrange plugins by type - this is what plugins() expects.
var optimizedPluginsData = (function optimizePluginsArray(plugins) {
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
})([
    // The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
    removeXMLProcInst,
    removeComments,
    removeXMLNS,
    cleanupAttrs,
    cleanupIDs,
    cleanupNumericValues,
    convertColors,
    removeUnknownsAndDefaults,
    removeNonInheritableGroupAttrs,
    removeUselessStrokeAndFill,
    removeHiddenElems,
    convertShapeToPath,
    moveElemsAttrsToGroup,
    moveGroupAttrsToElems,
    collapseGroups,
    convertPathData,
    convertTransform,
    removeEmptyAttrs,
    removeEmptyContainers,
    mergePaths,
    removeUnusedNS,
    sortAttrs,
    removeDimensions,
]);
var defaultOptions = {
    plugins: optimizedPluginsData,
};
var Avdo = /** @class */ (function () {
    function Avdo(options) {
        if (options === void 0) { options = defaultOptions; }
        this.options = options;
    }
    Avdo.prototype.optimize = function (svgstr, info) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this.options;
            var maxPassCount = options.multipass ? 10 : 1;
            var counter = 0;
            var prevResultSize = Number.POSITIVE_INFINITY;
            var onSuccess = function (result) {
                if (++counter < maxPassCount && result.data.length < prevResultSize) {
                    prevResultSize = result.data.length;
                    _this._optimizeOnce(result.data, info, onSuccess, onFail);
                }
                else {
                    // if (config.datauri) {
                    //   svgjs.data = encodeSVGDatauri(svgjs.data, config.datauri);
                    // }
                    resolve(result);
                }
            };
            var onFail = function (error) { return reject(error); };
            _this._optimizeOnce(svgstr, info, onSuccess, onFail);
        });
    };
    Avdo.prototype._optimizeOnce = function (svgstr, info, onSuccess, onFail) {
        var options = this.options;
        xml2js_1.xml2js(svgstr, function (jsApi) {
            // console.log("==========");
            // console.log("optimizeOnceInfo", info);
            // console.log("optimizeOnce", "plugins", config.plugins);
            jsApi = _plugins_1.process(jsApi, info, options.plugins);
            onSuccess(js2xml_1.js2xml(jsApi, /*config.js2svg*/ undefined));
        }, function (error) { return onFail(error); });
    };
    return Avdo;
}());
exports.Avdo = Avdo;
