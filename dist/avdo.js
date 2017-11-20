"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js_1 = require("./xml2js");
var _plugins_1 = require("./plugins/_plugins");
var js2xml_1 = require("./js2xml");
// import * as removeXMLProcInst from './plugins/removeXMLProcInst';
var removeComments_1 = require("./plugins/removeComments");
// import * as removeXMLNS from './plugins/removeXMLNS';
// import * as cleanupAttrs from './plugins/cleanupAttrs';
// import * as cleanupIDs from './plugins/cleanupIDs';
// import * as cleanupNumericValues from './plugins/cleanupNumericValues';
// import * as convertColors from './plugins/convertColors';
// import * as removeUnknownsAndDefaults from './plugins/removeUnknownsAndDefaults';
// import * as removeNonInheritableGroupAttrs from './plugins/removeNonInheritableGroupAttrs';
// import * as removeUselessStrokeAndFill from './plugins/removeUselessStrokeAndFill';
// import * as removeHiddenElems from './plugins/removeHiddenElems';
// import * as convertShapeToPath from './plugins/convertShapeToPath';
// import * as moveElemsAttrsToGroup from './plugins/moveElemsAttrsToGroup';
// import * as moveGroupAttrsToElems from './plugins/moveGroupAttrsToElems';
// import * as collapseGroups from './plugins/collapseGroups';
// import * as convertPathData from './plugins/convertPathData';
// import * as convertTransform from './plugins/convertTransform';
// import * as removeEmptyAttrs from './plugins/removeEmptyAttrs';
// import * as removeEmptyContainers from './plugins/removeEmptyContainers';
// import * as mergePaths from './plugins/mergePaths';
// import * as removeUnusedNS from './plugins/removeUnusedNS';
// import * as sortAttrs from './plugins/sortAttrs';
// import * as removeDimensions from './plugins/removeDimensions';
// import * as removeAttrs from './plugins/removeAttrs';
// import * as removeElementsByAttr from './plugins/removeElementsByAttr';
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
})([
    // The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
    // removeXMLProcInst,
    removeComments_1.removeComments,
]);
var Avdo = /** @class */ (function () {
    function Avdo(options) {
        if (options === void 0) { options = { plugins: optimizedPluginsData }; }
        this.options = options;
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
            jsApi = _plugins_1.process(jsApi, options.plugins);
            onSuccess(js2xml_1.js2xml(jsApi, /*config.js2svg*/ undefined));
        }, function (error) { return onFail(error); });
    };
    return Avdo;
}());
exports.Avdo = Avdo;
