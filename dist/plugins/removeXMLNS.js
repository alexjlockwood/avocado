"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = 'perItem';
exports.active = false;
exports.description = 'removes xmlns attribute (for inline svg, disabled by default)';
exports.params = undefined;
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
function fn(item) {
    if (item.isElem('svg') && item.hasAttr('xmlns')) {
        item.removeAttr('xmlns');
    }
}
exports.fn = fn;
