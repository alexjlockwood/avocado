export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes useless stroke and fill attributes";
export declare const params: {
    stroke: boolean;
    fill: boolean;
    removeNone: boolean;
    hasStyleOrScript: boolean;
};
/**
 * Remove useless stroke and fill attrs.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): boolean;
