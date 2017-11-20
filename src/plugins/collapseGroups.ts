import * as _collections from './_collections';

import { JsApi } from '../jsapi';
import { Plugin } from './_types';

/*
 * Collapse groups with no attributes.
 * TODO: what about groups w/ a name but no other attributes?
 */
function fn(item: JsApi) {
  if (!item.isElem() || item.isEmpty()) {
    return item;
  }
  item.content.forEach((g, i) => {
    // Collapse non-empty groups with no attributes.
    if (g.isElem('group') && !g.isEmpty() && !g.hasAttr()) {
      item.spliceContent(i, 1, g.content);
    }
  });
  return item;
}

export const collapseGroups: Plugin<undefined> = {
  type: 'perItemReverse',
  active: true,
  description: 'collapses useless groups',
  params: undefined,
  fn,
};
