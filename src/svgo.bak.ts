import { xml2js } from './xml2js';
import { js2xml } from './js2xml';
import { JsApi } from './jsapi';
import { process } from './plugins/_plugins';

import * as removeXMLProcInst from './plugins/removeXMLProcInst';
import * as removeComments from './plugins/removeComments';
import * as removeXMLNS from './plugins/removeXMLNS';
import * as cleanupAttrs from './plugins/cleanupAttrs';
import * as cleanupIDs from './plugins/cleanupIDs';
import * as cleanupNumericValues from './plugins/cleanupNumericValues';
import * as convertColors from './plugins/convertColors';
import * as removeUnknownsAndDefaults from './plugins/removeUnknownsAndDefaults';
import * as removeNonInheritableGroupAttrs from './plugins/removeNonInheritableGroupAttrs';
import * as removeUselessStrokeAndFill from './plugins/removeUselessStrokeAndFill';
import * as removeHiddenElems from './plugins/removeHiddenElems';
import * as convertShapeToPath from './plugins/convertShapeToPath';
import * as moveElemsAttrsToGroup from './plugins/moveElemsAttrsToGroup';
import * as moveGroupAttrsToElems from './plugins/moveGroupAttrsToElems';
import * as collapseGroups from './plugins/collapseGroups';
import * as convertPathData from './plugins/convertPathData';
import * as convertTransform from './plugins/convertTransform';
import * as removeEmptyAttrs from './plugins/removeEmptyAttrs';
import * as removeEmptyContainers from './plugins/removeEmptyContainers';
import * as mergePaths from './plugins/mergePaths';
import * as removeUnusedNS from './plugins/removeUnusedNS';
import * as sortAttrs from './plugins/sortAttrs';
import * as removeDimensions from './plugins/removeDimensions';
import * as removeAttrs from './plugins/removeAttrs';
import * as removeElementsByAttr from './plugins/removeElementsByAttr';

// The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
const pluginsData = {
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
  // Some of these don't have a useful default action
  // 'removeAttrs': removeAttrs,
  // 'removeElementsByAttr': removeElementsByAttr,
  // 'addClassesToSVGElement': addClassesToSVGElement,
  // 'addAttributesToSVGElement': addAttributesToSVGElement,
};

// Arrange plugins by type - this is what plugins() expects.
function optimizePluginsArray(plugins) {
  return plugins.map(item => [item]).reduce((arr, item) => {
    const last = arr[arr.length - 1];
    if (last && item[0].type === last[0].type) {
      last.push(item[0]);
    } else {
      arr.push(item);
    }
    return arr;
  }, []);
}

const optimisedPluginsData = optimizePluginsArray(Object.values(pluginsData));

function getDimensions(jsApi: JsApi) {
  const svgEl = jsApi.content.filter(el => el.isElem('svg'))[0];
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
    const viewBox = svgEl.attr('viewBox').value.split(/(?:,\s*|\s+)/);
    return {
      width: parseFloat(viewBox[2]),
      height: parseFloat(viewBox[3]),
    };
  }
  return {};
}

function* multipassCompress(settings) {
  // Activate/deactivate plugins.
  Object.keys(settings.plugins).forEach(pluginName => {
    pluginsData[pluginName].active = settings.plugins[pluginName];
  });

  // Set floatPrecision across all the plugins.
  const floatPrecision = settings.floatPrecision;

  for (const plugin of Object.values(pluginsData)) {
    if (plugin.params && 'floatPrecision' in plugin.params) {
      plugin.params.floatPrecision = floatPrecision;
    }
  }

  const svg = parsedSvg.clone();
  let svgData;
  let previousDataLength;

  while (svgData === undefined || svgData.length != previousDataLength) {
    previousDataLength = svgData && svgData.length;
    process(svg, optimisedPluginsData);
    svgData = js2xml(svg, {
      indent: '  ',
      pretty: settings.pretty,
    }).data;

    yield {
      data: svgData,
      dimensions: getDimensions(svg),
    };
  }
}

let parsedSvg: JsApi;
let multipassInstance;

const actions = {
  load({ data }) {
    let hasError = false;
    let errorMsg = '';
    xml2js(
      data,
      jsApi => (parsedSvg = jsApi),
      error => {
        errorMsg = error;
        hasError = true;
      },
    );
    if (hasError) {
      throw new Error(errorMsg);
    }
    return getDimensions(parsedSvg);
  },
  process({ settings }) {
    multipassInstance = multipassCompress(settings);
    return multipassInstance.next().value;
  },
  nextPass() {
    return multipassInstance.next().value;
  },
};

export function execute(event) {
  try {
    return actions[event.data.action](event.data);
  } catch (e) {
    return e.message;
  }
}
