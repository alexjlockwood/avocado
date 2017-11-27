import { intersects, js2path, path2js } from './_path';

import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

export interface Params {
  collapseRepeated: boolean;
  leadingZero: boolean;
  negativeExtraSpace: boolean;
}

/**
 * Merge multiple paths into one.
 */
function fn(item: JsApi, params: Params) {
  if (!item.isElem() || item.isEmpty()) {
    return item;
  }

  let prevContentItem: JsApi;
  let prevContentItemKeys: string[];

  // TODO: figure out how to deal with clip paths!
  item.content = item.content.filter(contentItem => {
    if (
      prevContentItem &&
      prevContentItem.isElem('path') &&
      prevContentItem.isEmpty() &&
      prevContentItem.hasAttr('android:pathData') &&
      contentItem.isElem('path') &&
      contentItem.isEmpty() &&
      contentItem.hasAttr('android:pathData')
    ) {
      if (!prevContentItemKeys) {
        prevContentItemKeys = Object.keys(prevContentItem.attrs);
      }
      const contentItemAttrs = Object.keys(contentItem.attrs);
      const equalData =
        prevContentItemKeys.length === contentItemAttrs.length &&
        contentItemAttrs.every(key => {
          return (
            key === 'android:pathData' ||
            (prevContentItem.hasAttr(key) &&
              prevContentItem.attr(key).value === contentItem.attr(key).value)
          );
        });
      const prevPathJS = path2js(prevContentItem);
      const curPathJS = path2js(contentItem);
      if (equalData && !intersects(prevPathJS, curPathJS)) {
        js2path(prevContentItem, prevPathJS.concat(curPathJS), params);
        return false;
      }
    }
    prevContentItem = contentItem;
    prevContentItemKeys = undefined;
    return true;
  });

  return item;
}

export const mergePaths: Plugin<Params> = {
  type: 'perItem',
  active: true,
  description: 'merges multiple paths into one, if possible',
  params: {
    collapseRepeated: true,
    leadingZero: true,
    negativeExtraSpace: true,
  },
  fn,
};
