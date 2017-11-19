export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "cleanups attributes from newlines, trailing and repeating spaces";
export declare const params: {
    newlines: boolean;
    trim: boolean;
    spaces: boolean;
};
/**
 * Cleanup attributes values from newlines, trailing and repeating spaces.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
