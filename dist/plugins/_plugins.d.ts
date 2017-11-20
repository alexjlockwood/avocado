import { JsApi } from '../jsapi';
import { Plugin } from './_types';
/**
 * Plugins engine.
 * @param {Object} data input data
 * @param {Array} plugins plugins object from config
 * @return {Object} output data
 */
export declare function process(item: JsApi, plugins: Plugin[][]): JsApi;
