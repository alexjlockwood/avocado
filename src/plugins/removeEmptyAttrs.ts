const type = 'perItem';

const active = true;

const description = 'removes empty attributes';

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
const fn = function(item) {
  if (item.elem) {
    item.eachAttr(function(attr) {
      if (attr.value === '') {
        item.removeAttr(attr.name);
      }
    });
  }
};

export = { type, active, description, params: undefined, fn };
