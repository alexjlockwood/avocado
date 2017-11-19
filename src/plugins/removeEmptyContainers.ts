import * as _collections from './_collections';

export const type = 'perItemReverse';

export const active = true;

export const description = 'removes empty container elements';

export const params = undefined;

const container = _collections.elemsGroups.container;

/**
 * Remove empty containers.
 *
 * @see http://www.w3.org/TR/SVG/intro.html#TermContainerElement
 *
 * @example
 * <defs/>
 *
 * @example
 * <g><marker><a/></marker></g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  return !(
    item.isElem(container) &&
    !item.isElem('svg') &&
    item.isEmpty() &&
    (!item.isElem('pattern') || !item.hasAttrLocal('href'))
  );
}
