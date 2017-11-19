import * as _collections from './_collections';

export const type = 'perItem';

export const active = true;

export const description =
  'removes non-inheritable group’s presentational attributes';

export const params = undefined;

const inheritableAttrs = _collections.inheritableAttrs;
const attrsGroups = _collections.attrsGroups;
const excludedAttrs = ['display', 'opacity'];

/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export function fn(item) {
  if (item.isElem('g')) {
    item.eachAttr(function(attr) {
      if (
        ~attrsGroups.presentation.indexOf(attr.name) &&
        ~attrsGroups.graphicalEvent.indexOf(attr.name) &&
        ~attrsGroups.core.indexOf(attr.name) &&
        ~attrsGroups.conditionalProcessing.indexOf(attr.name) &&
        !~excludedAttrs.indexOf(attr.name) &&
        !~inheritableAttrs.indexOf(attr.name)
      ) {
        item.removeAttr(attr.name);
      }
    });
  }
}
