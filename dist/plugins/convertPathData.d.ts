export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "optimizes path data: writes in shorter form, applies transformations";
export declare const params: {
    applyTransforms: boolean;
    applyTransformsStroked: boolean;
    makeArcs: {
        threshold: number;
        tolerance: number;
    };
    straightCurves: boolean;
    lineShorthands: boolean;
    curveSmoothShorthands: boolean;
    floatPrecision: number;
    transformPrecision: number;
    removeUseless: boolean;
    collapseRepeated: boolean;
    utilizeAbsolute: boolean;
    leadingZero: boolean;
    negativeExtraSpace: boolean;
};
/**
 * Convert absolute Path to relative,
 * collapse repeated instructions,
 * detect and convert Lineto shorthands,
 * remove useless instructions like "l0,0",
 * trim useless delimiters and leading zeros,
 * decrease accuracy of floating-point numbers.
 *
 * @see http://www.w3.org/TR/SVG/paths.html#PathData
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
