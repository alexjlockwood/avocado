import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

/**
 * Remove comments.
 */
function fn(item: JsApi) {
  return item.comment && item.comment.text.charAt(0) !== '!' ? undefined : item;
}

export const removeComments: Plugin<undefined> = {
  type: 'perItem',
  active: false,
  description: 'removes all comments',
  params: undefined,
  fn,
};
