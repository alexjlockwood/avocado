// Code forked and modified from svgo v1.0.3.

import { JsApi } from './jsapi';
import { Plugin } from './plugins/_types';
import { collapseGroups } from './plugins/collapseGroups';
import { convertPathData } from './plugins/convertPathData';
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
// import * as convertTransform from './plugins/convertTransform';
// import * as removeUnusedNS from './plugins/removeUnusedNS';
// import * as sortAttrs from './plugins/sortAttrs';

export const plugins: { [name: string]: Plugin } = {
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
  collapseGroups,
  convertPathData,
  // convertTransform,
  removeEmptyGroups,
  mergePaths,
  // removeUnusedNS,
  // sortAttrs,
};

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
})(Array.from(Object.values(plugins)));

export interface Options {
  plugins?: Plugin[][];
  multipass?: boolean;
  // TODO: make it possible to configure indentation too
  pretty?: boolean;
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
      const onFail = (error: any) => reject(error);
      this.optimizeOnce(xml, onSuccess, onFail);
    });
  }

  private optimizeOnce(
    xml: string,
    onSuccess: (result: string) => void,
    onFail: (error: string) => void,
  ) {
    const { options } = this;
    xml2js(
      xml,
      jsApi => {
        jsApi = processPlugins(jsApi, options.plugins);
        onSuccess(js2xml(jsApi, { pretty: options.pretty }));
      },
      error => onFail(error),
    );
  }
}
