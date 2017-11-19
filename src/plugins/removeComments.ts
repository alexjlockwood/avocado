const type = 'perItem';

const active = true;

const description = 'removes comments';

/**
 * Remove comments.
 *
 * @example
 * <!-- Generator: Adobe Illustrator 15.0.0, SVG Export
 * Plug-In . SVG Version: 6.00 Build 0)  -->
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
const fn = function(item) {
  if (item.comment && item.comment.charAt(0) !== '!') {
    return false;
  }
};

export = { type, active, description, params: undefined, fn };
