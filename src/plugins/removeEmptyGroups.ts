import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

/**
 * Remove empty groups.
 * TODO: are there any empty containers that could be removed in an animated-vector?
 */
function fn(item: JsApi) {
  // TODO: should we remove an empty group if it has a name? we could break an AVD...
  return item.isElem('group') && item.isEmpty() ? undefined : item;
}

export const removeEmptyGroups: Plugin<undefined> = {
  type: 'perItemReverse',
  active: true,
  description: 'removes empty groups',
  params: undefined,
  fn,
};
