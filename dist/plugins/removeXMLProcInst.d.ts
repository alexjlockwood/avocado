export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes XML processing instructions";
export declare const params: any;
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
export declare function fn(item: any): boolean;
