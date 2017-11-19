export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "converts basic shapes to more compact path form";
export declare const params: {
    convertArcs: boolean;
};
/**
 * Converts basic shape to more compact path.
 * It also allows further optimizations like
 * combining paths with similar attributes.
 *
 * @see http://www.w3.org/TR/SVG/shapes.html
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Lev Solntsev
 */
export declare function fn(item: any, params: any): boolean;
