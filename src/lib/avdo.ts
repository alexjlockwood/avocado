// Plugin code based off of svgo v1.0.3.

import { JsApi } from './jsapi';
import { Plugin } from '../plugins/_types';
import { collapseGroups } from '../plugins/collapseGroups';
import { convertPathData } from '../plugins/convertPathData';
import { js2xml } from './js2xml';
import { mergePaths } from '../plugins/mergePaths';
import { processPlugins } from '../plugins/_plugins';
import { removeComments } from '../plugins/removeComments';
import { removeEmptyGroups } from '../plugins/removeEmptyGroups';
import { removeXMLProcInst } from '../plugins/removeXMLProcInst';
import { xml2js } from './xml2js';

// The order is from https://github.com/svg/svgo/blob/master/.svgo.yml
export const plugins: { [name: string]: Plugin } = {
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
const optimizedPluginsData = (function(ps: Plugin[]) {
  return ps.map(item => [item]).reduce(
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
})(Object.keys(plugins).map(k => plugins[k]));

// TODO: make it possible to configure indentation too?
export interface Options {
  plugins?: Plugin[][];
  multipass?: boolean;
  pretty?: boolean;
}

export class Avdo {
  constructor(
    private readonly options: Options = {
      plugins: optimizedPluginsData,
      multipass: true,
      pretty: true,
    },
  ) {}

  optimize(xml: string) {
    return new Promise<string>((resolve, reject) => {
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
    xml2js(
      xml,
      jsApi => {
        jsApi = processPlugins(jsApi, this.options.plugins);
        onSuccess(js2xml(jsApi, { pretty: this.options.pretty }));
      },
      error => onFail(error),
    );
  }
}
