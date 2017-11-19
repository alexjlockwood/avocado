export const type = 'perItem';

export const active = true;

export const description = 'removes comments';

export const params = undefined;

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
export function fn(item) {
  if (item.comment && item.comment.charAt(0) !== '!') {
    return false;
  }
}
