import { Plugin } from './_types';
/**
 * Plugins engine.
 *
 * @module plugins
 *
 * @param {Object} data input data
 * @param {Object} info extra information
 * @param {Object} plugins plugins object from config
 * @return {Object} output data
 */
export declare function process(data: any, info: any, plugins?: Plugin[][]): any;
