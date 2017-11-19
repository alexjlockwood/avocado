export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes unknown elements content and attributes, removes attrs with default values";
export declare const params: {
    unknownContent: boolean;
    unknownAttrs: boolean;
    defaultAttrs: boolean;
    uselessOverrides: boolean;
    keepDataAttrs: boolean;
    keepAriaAttrs: boolean;
};
/**
 * Remove unknown elements content and attributes,
 * remove attributes with default values.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
