export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes empty attributes";
export declare const params: any;
/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any): void;
