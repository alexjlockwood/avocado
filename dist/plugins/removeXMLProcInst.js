"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = 'perItem';
exports.active = true;
exports.description = 'removes XML processing instructions';
exports.params = undefined;
/**
 * Remove XML Processing Instruction.
 *
 * @example
 * <?xml version="1.0" encoding="utf-8"?>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
function fn(item) {
    return !(item.processinginstruction && item.processinginstruction.name === 'xml');
}
exports.fn = fn;
