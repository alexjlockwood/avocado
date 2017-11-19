const type = 'perItem';

const active = true;

const description = 'removes non-inheritable group’s presentational attributes';

var inheritableAttrs = require('./_collections').inheritableAttrs,
  attrsGroups = require('./_collections').attrsGroups,
  excludedAttrs = ['display', 'opacity'];

/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
const fn = function(item) {
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
};

export = { type, active, description, params: undefined, fn };
