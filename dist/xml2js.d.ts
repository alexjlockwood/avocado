import { JsApi } from './jsapi';
/**
 * @param {String} data input data
 * @param {Function} callback
 */
export declare function xml2js(data: string, onSuccess: (jsApi: JsApi) => void, onFail: (error: string) => void): void;
