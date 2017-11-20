import { JsApi } from '../jsapi';
import { Plugin } from './_types';

/**
 * Plugins engine.
 * @param {Object} data input data
 * @param {Array} plugins plugins object from config
 * @return {Object} output data
 */
export function processPlugins(item: JsApi, plugins: Plugin[][]) {
  plugins.forEach(batch => {
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

/**
 * Direct or reverse per-item loop.
 * @param {Object} jsApi input data
 * @param {Array} plugins plugins list to process
 * @param {Boolean} [reverse] reverse pass
 * @return {Object} output data
 */
function perItem(jsApi: JsApi, plugins: Plugin[], reverse = false) {
  return (function monkeys(item) {
    item.content = item.content.filter(i => {
      // Reverse pass.
      if (reverse && i.content) {
        monkeys(i);
      }
      // Main filter.
      let filter = true;
      for (let j = 0; filter && j < plugins.length; j++) {
        const { active, params, fn } = plugins[j];
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
function full(item: JsApi, plugins: Plugin[]) {
  plugins.forEach(({ active, params, fn }) => {
    item = active ? fn(item, params) : item;
  });
  return item;
}
