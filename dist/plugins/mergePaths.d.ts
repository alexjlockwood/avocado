export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "merges multiple paths in one if possible";
export declare const params: {
    collapseRepeated: boolean;
    leadingZero: boolean;
    negativeExtraSpace: boolean;
};
/**
 * Merge multiple Paths into one.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich, Lev Solntsev
 */
export declare function fn(item: any, params: any): void;
