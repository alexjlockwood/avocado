import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

/**
 * Remove empty groups.
 * TODO: are there any empty containers that could be removed in an animated-vector?
 */
function fn(item: JsApi) {
  // TODO: detect if the group w/ a name is being referenced by an AVD
  return item.isElem('group') && !item.hasAttr('android:name') && item.isEmpty()
    ? undefined
    : item;
}

export const removeEmptyGroups: Plugin<undefined> = {
  type: 'perItemReverse',
  active: true,
  description: 'removes empty groups',
  params: undefined,
  fn,
};
