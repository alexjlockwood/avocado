import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

export type Params = undefined;

/**
 * Remove comments.
 */
function fn(item: JsApi) {
  return item.comment && item.comment.text.charAt(0) !== '!' ? undefined : item;
}

export const removeComments: Plugin<Params> = {
  type: 'perItem',
  active: false,
  description: 'removes all comments',
  params: undefined,
  fn,
};
