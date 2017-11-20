import { JsApi } from '../jsapi';
import { Plugin } from './_types';

/**
 * Remove empty groups.
 * TODO: are there any empty containers that could be removed in an animated-vector?
 */
function fn(item: JsApi) {
  return item.isElem('g') && item.isEmpty() ? undefined : item;
}

export const removeEmptyGroups: Plugin<undefined> = {
  type: 'perItemReverse',
  active: true,
  description: 'removes empty groups',
  params: undefined,
  fn,
};
