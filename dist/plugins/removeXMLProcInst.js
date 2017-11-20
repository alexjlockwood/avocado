"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes XML processing instructions. (<?xml version="1.0" encoding="utf-8"?>)
 */
function fn(item) {
    return item.processingInstruction && item.processingInstruction.name === 'xml'
        ? undefined
        : item;
}
exports.removeXMLProcInst = {
    type: 'perItem',
    active: true,
    description: 'removes XML processing instructions',
    params: undefined,
    fn: fn,
};
