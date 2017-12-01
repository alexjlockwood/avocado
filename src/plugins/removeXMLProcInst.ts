import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

/**
 * Removes XML processing instructions. (<?xml version="1.0" encoding="utf-8"?>)
 */
function fn(item: JsApi) {
  return item.processingInstruction && item.processingInstruction.name === 'xml'
    ? undefined
    : item;
}

export const removeXMLProcInst: Plugin<undefined> = {
  type: 'perItem',
  active: false,
  description: 'removes XML processing instructions',
  params: undefined,
  fn,
};
