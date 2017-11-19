/**
 * Convert path string to JS representation.
 *
 * @param {String} pathString input string
 * @param {Object} params plugin params
 * @return {Array} output array
 */
export declare function path2js(path: any): any;
/**
 * Convert relative Path data to absolute.
 *
 * @param {Array} data input data
 * @return {Array} output data
 */
export declare function relative2absolute(data: any): any;
/**
 * Apply transformation(s) to the Path data.
 *
 * @param {Object} elem current element
 * @param {Array} path input path data
 * @param {Object} params whether to apply transforms to stroked lines and transform precision (used for stroke width)
 * @return {Array} output path data
 */
export declare function applyTransforms(elem: any, path: any, params: any): any;
/**
 * Compute Cubic Bézie bounding box.
 *
 * @see http://processingjs.nihongoresources.com/bezierinfo/
 *
 * @param {Float} xa
 * @param {Float} ya
 * @param {Float} xb
 * @param {Float} yb
 * @param {Float} xc
 * @param {Float} yc
 * @param {Float} xd
 * @param {Float} yd
 *
 * @return {Object}
 */
export declare function computeCubicBoundingBox(xa: any, ya: any, xb: any, yb: any, xc: any, yc: any, xd: any, yd: any): {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
};
/**
 * Compute Quadratic Bézier bounding box.
 *
 * @see http://processingjs.nihongoresources.com/bezierinfo/
 *
 * @param {Float} xa
 * @param {Float} ya
 * @param {Float} xb
 * @param {Float} yb
 * @param {Float} xc
 * @param {Float} yc
 *
 * @return {Object}
 */
export declare function computeQuadraticBoundingBox(xa: any, ya: any, xb: any, yb: any, xc: any, yc: any): {
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
};
/**
 * Convert path array to string.
 *
 * @param {Array} path input path data
 * @param {Object} params plugin params
 * @return {String} output path string
 */
export declare function js2path(path: any, data: any, params: any): void;
/**
 * Checks if two paths have an intersection by checking convex hulls
 * collision using Gilbert-Johnson-Keerthi distance algorithm
 * http://entropyinteractive.com/2011/04/gjk-algorithm/
 *
 * @param {Array} path1 JS path representation
 * @param {Array} path2 JS path representation
 * @return {Boolean}
 */
export declare function intersects(path1: any, path2: any): any;
