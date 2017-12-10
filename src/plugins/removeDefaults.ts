import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

const defaultAttrs: {
  [index: string]: { [index: string]: string | number };
} = {
  vector: {
    alpha: 1,
    autoMirrored: 'false',
    tintMode: 'src_in',
  },
  group: {
    pivotX: 0,
    pivotY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
  },
  path: {
    fillAlpha: 1,
    fillColor: '#00000000',
    fillType: 'nonZero',
    strokeAlpha: 1,
    strokeColor: '#00000000',
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    trimPathStart: 0,
    trimPathEnd: 1,
    trimPathOffset: 0,
  },
};

/**
 * Remove attributes with default values.
 */
export function fn(item: JsApi) {
  if (!item.isElem() || !item.attrs) {
    return item;
  }
  if (item.isElem('vector') || item.isElem('group') || item.isElem('path')) {
    const elemType = item.elem as 'vector' | 'group' | 'path';
    const defaults = defaultAttrs[elemType];
    Object.keys(defaults).forEach(key => {
      const attrName = `android:${key}`;
      if (item.hasAttr(attrName)) {
        const defaultValue = defaults[key];
        const actualValue = item.attr(attrName).value;
        const convertedValue =
          typeof defaultValue === 'number' ? +actualValue : actualValue;
        if (defaultValue === convertedValue) {
          item.removeAttr(attrName);
        }
      }
    });
  }
  return item;
}

export const removeDefaults: Plugin<undefined> = {
  type: 'perItem',
  active: true,
  description: 'remove attributes with default values',
  params: undefined,
  fn,
};
