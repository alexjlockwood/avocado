export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "converts colors: rgb() to #rrggbb and #rrggbb to #rgb";
export declare const params: {
    currentColor: boolean;
    names2hex: boolean;
    rgb2hex: boolean;
    shorthex: boolean;
    shortname: boolean;
};
/**
 * Convert different colors formats in element attributes to hex.
 *
 * @see http://www.w3.org/TR/SVG/types.html#DataTypeColor
 * @see http://www.w3.org/TR/SVG/single-page.html#types-ColorKeywords
 *
 * @example
 * Convert color name keyword to long hex:
 * fuchsia ➡ #ff00ff
 *
 * Convert rgb() to long hex:
 * rgb(255, 0, 255) ➡ #ff00ff
 * rgb(50%, 100, 100%) ➡ #7f64ff
 *
 * Convert long hex to short hex:
 * #aabbcc ➡ #abc
 *
 * Convert hex to short name
 * #000080 ➡ navy
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
