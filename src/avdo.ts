import { JsApi } from './jsapi';
import { Plugin } from './plugins/_types';
import { js2xml } from './js2xml';
import { mergePaths } from './plugins/mergePaths';
import { processPlugins } from './plugins/_plugins';
import { removeComments } from './plugins/removeComments';
import { removeEmptyGroups } from './plugins/removeEmptyGroups';
import { removeXMLProcInst } from './plugins/removeXMLProcInst';
import { xml2js } from './xml2js';

// import * as cleanupAttrs from './plugins/cleanupAttrs';
// import * as cleanupIDs from './plugins/cleanupIDs';
// import * as cleanupNumericValues from './plugins/cleanupNumericValues';
// import * as convertColors from './plugins/convertColors';
// import * as removeUnknownsAndDefaults from './plugins/removeUnknownsAndDefaults';
// import * as removeUselessStrokeAndFill from './plugins/removeUselessStrokeAndFill';
// import * as removeHiddenElems from './plugins/removeHiddenElems';
// import * as collapseGroups from './plugins/collapseGroups';
// import * as convertPathData from './plugins/convertPathData';
// import * as convertTransform from './plugins/convertTransform';
// import * as removeUnusedNS from './plugins/removeUnusedNS';
// import * as sortAttrs from './plugins/sortAttrs';

// Arrange plugins by type - this is what plugins() expects.
const optimizedPluginsData = (function(plugins: Plugin[]) {
  return plugins.map(item => [item]).reduce(
    (arr, item) => {
      const last = arr[arr.length - 1];
      if (last && item[0].type === last[0].type) {
        last.push(item[0]);
      } else {
        arr.push(item);
      }
      return arr;
    },
    [] as Plugin[][]
  );
})([
  // The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
  removeXMLProcInst,
  removeComments,
  // cleanupAttrs,
  // cleanupIDs,
  // cleanupNumericValues,
  // convertColors,
  // removeUnknownsAndDefaults,
  // removeUselessStrokeAndFill,
  // removeHiddenElems,
  // collapseGroups,
  // convertPathData,
  // convertTransform,
  removeEmptyGroups,
  mergePaths,
  // removeUnusedNS,
  // sortAttrs,
]);

export interface Options {
  plugins?: Plugin[][];
  multipass?: boolean;
}

export class Avdo {
  constructor(private readonly options: Options = {}) {
    options.plugins = options.plugins || optimizedPluginsData;
  }

  optimize(xml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const maxPassCount = this.options.multipass ? 10 : 1;
      let counter = 0;
      let prevResultSize = Number.POSITIVE_INFINITY;
      const onSuccess = (result: string) => {
        if (++counter < maxPassCount && result.length < prevResultSize) {
          prevResultSize = result.length;
          this.optimizeOnce(result, onSuccess, onFail);
        } else {
          resolve(result);
        }
      };
      const onFail = error => reject(error);
      this.optimizeOnce(xml, onSuccess, onFail);
    });
  }

  private optimizeOnce(xml: string, onSuccess, onFail) {
    const { options } = this;
    xml2js(
      xml,
      jsApi => {
        jsApi = processPlugins(jsApi, options.plugins);
        // TODO: make it possible to configure the 'pretty' option
        onSuccess(js2xml(jsApi, undefined));
      },
      error => onFail(error),
    );
  }
}
