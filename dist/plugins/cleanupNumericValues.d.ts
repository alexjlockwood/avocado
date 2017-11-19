export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "rounds numeric values to the fixed precision, removes default ‘px’ units";
export declare const params: {
    floatPrecision: number;
    leadingZero: boolean;
    defaultPx: boolean;
    convertToPx: boolean;
};
/**
 * Round numeric values to the fixed precision,
 * remove default 'px' units.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
