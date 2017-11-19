export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "collapses multiple transformations and optimizes it";
export declare const params: {
    convertToShorts: boolean;
    floatPrecision: number;
    transformPrecision: number;
    matrixToTransform: boolean;
    shortTranslate: boolean;
    shortScale: boolean;
    shortRotate: boolean;
    removeUseless: boolean;
    collapseIntoOne: boolean;
    leadingZero: boolean;
    negativeExtraSpace: boolean;
};
/**
 * Convert matrices to the short aliases,
 * convert long translate, scale or rotate transform notations to the shorts ones,
 * convert transforms to the matrices and multiply them all into one,
 * remove useless transforms.
 *
 * @see http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): void;
