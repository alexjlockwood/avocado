"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js_1 = require("./xml2js");
var js2xml_1 = require("./js2xml");
var _plugins_1 = require("./plugins/_plugins");
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
// The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
var pluginsData = {
    removeXMLProcInst: removeXMLProcInst,
    removeComments: removeComments,
    removeXMLNS: removeXMLNS,
    cleanupAttrs: cleanupAttrs,
    cleanupIDs: cleanupIDs,
    cleanupNumericValues: cleanupNumericValues,
    convertColors: convertColors,
    removeUnknownsAndDefaults: removeUnknownsAndDefaults,
    removeNonInheritableGroupAttrs: removeNonInheritableGroupAttrs,
    removeUselessStrokeAndFill: removeUselessStrokeAndFill,
    removeHiddenElems: removeHiddenElems,
    convertShapeToPath: convertShapeToPath,
    moveElemsAttrsToGroup: moveElemsAttrsToGroup,
    moveGroupAttrsToElems: moveGroupAttrsToElems,
    collapseGroups: collapseGroups,
    convertPathData: convertPathData,
    convertTransform: convertTransform,
    removeEmptyAttrs: removeEmptyAttrs,
    removeEmptyContainers: removeEmptyContainers,
    mergePaths: mergePaths,
    removeUnusedNS: removeUnusedNS,
    sortAttrs: sortAttrs,
    removeDimensions: removeDimensions,
};
// Arrange plugins by type - this is what plugins() expects.
function optimizePluginsArray(plugins) {
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
}
var optimisedPluginsData = optimizePluginsArray(Object.values(pluginsData));
function getDimensions(jsApi) {
    var svgEl = jsApi.content.filter(function (el) { return el.isElem('svg'); })[0];
    if (!svgEl) {
        return {};
    }
    if (svgEl.hasAttr('width') && svgEl.hasAttr('height')) {
        return {
            width: parseFloat(svgEl.attr('width').value),
            height: parseFloat(svgEl.attr('height').value),
        };
    }
    if (svgEl.hasAttr('viewBox')) {
        var viewBox = svgEl.attr('viewBox').value.split(/(?:,\s*|\s+)/);
        return {
            width: parseFloat(viewBox[2]),
            height: parseFloat(viewBox[3]),
        };
    }
    return {};
}
function multipassCompress(settings) {
    var floatPrecision, _i, _a, plugin, svg, svgData, previousDataLength;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Activate/deactivate plugins.
                Object.keys(settings.plugins).forEach(function (pluginName) {
                    pluginsData[pluginName].active = settings.plugins[pluginName];
                });
                floatPrecision = settings.floatPrecision;
                for (_i = 0, _a = Object.values(pluginsData); _i < _a.length; _i++) {
                    plugin = _a[_i];
                    if (plugin.params && 'floatPrecision' in plugin.params) {
                        plugin.params.floatPrecision = floatPrecision;
                    }
                }
                svg = parsedSvg.clone();
                _b.label = 1;
            case 1:
                if (!(svgData === undefined || svgData.length != previousDataLength)) return [3 /*break*/, 3];
                previousDataLength = svgData && svgData.length;
                _plugins_1.process(svg, optimisedPluginsData);
                svgData = js2xml_1.js2xml(svg, {
                    indent: '  ',
                    pretty: settings.pretty,
                }).data;
                return [4 /*yield*/, {
                        data: svgData,
                        dimensions: getDimensions(svg),
                    }];
            case 2:
                _b.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
var parsedSvg;
var multipassInstance;
var actions = {
    load: function (_a) {
        var data = _a.data;
        var hasError = false;
        var errorMsg = '';
        xml2js_1.xml2js(data, function (jsApi) { return (parsedSvg = jsApi); }, function (error) {
            errorMsg = error;
            hasError = true;
        });
        if (hasError) {
            throw new Error(errorMsg);
        }
        return getDimensions(parsedSvg);
    },
    process: function (_a) {
        var settings = _a.settings;
        multipassInstance = multipassCompress(settings);
        return multipassInstance.next().value;
    },
    nextPass: function () {
        return multipassInstance.next().value;
    },
};
function execute(event) {
    try {
        return actions[event.data.action](event.data);
    }
    catch (e) {
        return e.message;
    }
}
exports.execute = execute;
