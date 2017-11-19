export const type = 'perItem';

export const active = false;

export const description =
  'removes xmlns attribute (for inline svg, disabled by default)';

export const params = undefined;

/**
 * Remove the xmlns attribute when present.
 *
 * @example
 * <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
 *   ↓
 * <svg viewBox="0 0 100 50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if true, xmlns will be filtered out
 *
 * @author Ricardo Tomasi
 */
export function fn(item) {
  if (item.isElem('svg') && item.hasAttr('xmlns')) {
    item.removeAttr('xmlns');
  }
}
