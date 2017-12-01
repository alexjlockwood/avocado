import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

const regValidPath = /M\s*(?:[-+]?(?:\d*\.\d+|\d+(?:\.|(?!\.)))([eE][-+]?\d+)?(?!\d)\s*,?\s*){2}\D*\d/i;

/**
 * Remove hidden elements.
 */
function fn(item: JsApi) {
  if (!item.isElem() || item.hasAttr('android:name')) {
    return item;
  }

  // Remove paths/clip-paths with empty/invalid path data strings.
  if (
    (item.isElem('path') || item.isElem('clip-path')) &&
    (!item.hasAttr('android:pathData') ||
      !regValidPath.test(item.attr('android:pathData').value))
  ) {
    return undefined;
  }

  return item;
}

export const removeHiddenElems: Plugin<undefined> = {
  type: 'perItem',
  active: true,
  description: 'removes hidden elements',
  params: undefined,
  fn,
};
