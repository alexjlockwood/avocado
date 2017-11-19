export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "sorts element attributes (disabled by default)";
export declare const params: {
    order: string[];
};
/**
 * Sort element attributes for epic readability.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 *
 * @author Nikolay Frantsev
 */
export declare function fn(item: any, params: any): void;
