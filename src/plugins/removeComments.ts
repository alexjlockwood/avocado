import { JsApi } from '../jsapi';
import { Plugin } from './_types';

export type Params = undefined;

/**
 * Remove comments.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 */
function fn(item: JsApi) {
  return item.comment && item.comment.charAt(0) !== '!' ? undefined : item;
}

export const removeComments: Plugin<Params> = {
  type: 'perItem',
  active: true,
  description: 'removes all comments',
  params: undefined,
  fn,
};
