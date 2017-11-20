import { JsApi } from './jsapi';
export interface Options {
    pretty?: boolean;
}
/**
 * Convert XML-as-JS object to XML string.
 * @param {Object} data input data
 * @param {Object} options options
 * @return {Object} output data
 */
export declare function js2xml(data: JsApi, options?: Options): string;
