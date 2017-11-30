import {
  applyTransforms,
  convertToRelative,
  flattenGroups,
  getGroupAttrs,
  getRotation,
  getScaling,
  getTranslation,
  js2path,
  path2js,
} from './_path';

import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

export const defaultParams = {
  floatPrecision: 3,
  transformPrecision: 5,
  applyTransformsStroked: true,
};

export type Params = typeof defaultParams;

/**
 * Bakes group transforms into paths.
 * TODO: figure out what to do with group/path names
 * TODO: figure out what to do with clip-paths?
 */
function fn(item: JsApi, params: Params) {
  if (
    !item.isElem('group') ||
    !item.hasAttr() ||
    item.hasAttr('android:name') ||
    item.isEmpty() ||
    item.content.some(i => i.hasAttr('android:name'))
  ) {
    return item;
  }

  const { floatPrecision } = params;
  const error = +Math.pow(0.1, floatPrecision).toFixed(floatPrecision);

  /**
   * Decrease accuracy of floating-point numbers
   * in path data keeping a specified number of decimals.
   * Smart rounds values like 2.3491 to 2.35 instead of 2.349.
   * Doesn't apply "smartness" if the number precision fits already.
   *
   * @param {Array} data input data array
   * @return {Array} output data array
   */
  function strongRound(data: number[]) {
    for (let i = data.length; i-- > 0; ) {
      if (+data[i].toFixed(floatPrecision) !== data[i]) {
        const rounded = +data[i].toFixed(floatPrecision - 1);
        data[i] =
          +Math.abs(rounded - data[i]).toFixed(floatPrecision + 1) >= error
            ? +data[i].toFixed(floatPrecision)
            : rounded;
      }
    }
    return data;
  }

  /**
   * Simple rounding function if precision is 0.
   *
   * @param {Array} data input data array
   * @return {Array} output data array
   */
  function round(data: number[]) {
    for (let i = data.length; i-- > 0; ) {
      data[i] = Math.round(data[i]);
    }
    return data;
  }

  const roundData =
    floatPrecision > 0 && floatPrecision < 20 ? strongRound : round;

  const g1Attrs = getGroupAttrs(item);
  item.content.forEach(i => {
    if (i.isElem('group')) {
      const g2Attrs = getGroupAttrs(i);
      const matrix = flattenGroups([g1Attrs, g2Attrs]);
      const { sx, sy } = getScaling(matrix);
      const { r } = getRotation(matrix);
      const { tx, ty } = getTranslation(matrix);
      const g3Attrs = { sx, sy, r, tx, ty };
      const addAttrFn = (local: string, value: number) => {
        i.addAttr({
          name: `android:${local}`,
          prefix: 'android',
          local,
          value: String(value),
        });
      };
      addAttrFn('scaleX', sx);
      addAttrFn('scaleY', sy);
      addAttrFn('rotation', r);
      addAttrFn('translateX', tx);
      addAttrFn('translateY', ty);
    } else if (i.isElem('path') || i.isElem('clip-path')) {
      let data = path2js(i);
      if (!data.length) {
        return;
      }
      convertToRelative(data);
      data = applyTransforms(item, i, data, params);
      data.forEach(d => roundData(d.data));
      js2path(i, data, {
        collapseRepeated: true,
        negativeExtraSpace: true,
        leadingZero: false,
      });
    }
  });

  removeGroupAttrs(item);

  return item;
}

function removeGroupAttrs(group: JsApi) {
  group.removeAttr('android:pivotX');
  group.removeAttr('android:pivotY');
  group.removeAttr('android:scaleX');
  group.removeAttr('android:scaleY');
  group.removeAttr('android:translateX');
  group.removeAttr('android:translateY');
  group.removeAttr('android:rotation');
}

export const bakeGroupTransforms: Plugin<Params> = {
  type: 'perItem',
  active: true,
  description: 'merges group transforms towards the bottom of the tree',
  params: defaultParams,
  fn,
};
