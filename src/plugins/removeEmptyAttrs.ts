export const type = 'perItem';

export const active = true;

export const description = 'removes empty attributes';

export const params = undefined;

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (item.elem) {
    item.eachAttr(function(attr) {
      if (attr.value === '') {
        item.removeAttr(attr.name);
      }
    });
  }
}
