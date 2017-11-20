/**
 * Convert transform string to JS representation.
 *
 * @param {String} transformString input string
 * @param {Object} params plugin params
 * @return {Array} output array
 */
export declare function transform2js(transformString: any): any[];
/**
 * Multiply transforms into one.
 *
 * @param {Array} input transforms array
 * @return {Array} output matrix array
 */
export declare function transformsMultiply(transforms: any): any;
/**
 * Do math like a school girl.
 *
 * @type {Object}
 */
export declare const mth: {
    rad: (deg: any) => number;
    deg: (rad: any) => number;
    cos: (deg: any) => number;
    acos: (val: any, floatPrecision: any) => number;
    sin: (deg: any) => number;
    asin: (val: any, floatPrecision: any) => number;
    tan: (deg: any) => number;
    atan: (val: any, floatPrecision: any) => number;
};
/**
 * Decompose matrix into simple transforms. See
 * http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
 *
 * @param {Object} data matrix transform object
 * @return {Object|Array} transforms array or original transform object
 */
export declare function matrixToTransform(transform: any, params: any): any;
/**
 * Applies transformation to an arc. To do so, we represent ellipse as a matrix, multiply it
 * by the transformation matrix and use a singular value decomposition to represent in a form
 * rotate(θ)·scale(a b)·rotate(φ). This gives us new ellipse params a, b and θ.
 * SVD is being done with the formulae provided by Wolffram|Alpha (svd {{m0, m2}, {m1, m3}})
 *
 * @param {Array} arc [a, b, rotation in deg]
 * @param {Array} transform transformation matrix
 * @return {Array} arc transformed input arc
 */
export declare function transformArc(arc: any, transform: any): any;
