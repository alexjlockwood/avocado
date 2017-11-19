export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes hidden elements (zero sized, with absent attributes)";
export declare const params: {
    displayNone: boolean;
    opacity0: boolean;
    circleR0: boolean;
    ellipseRX0: boolean;
    ellipseRY0: boolean;
    rectWidth0: boolean;
    rectHeight0: boolean;
    patternWidth0: boolean;
    patternHeight0: boolean;
    imageWidth0: boolean;
    imageHeight0: boolean;
    pathEmptyD: boolean;
    polylineEmptyPoints: boolean;
    polygonEmptyPoints: boolean;
};
/**
 * Remove hidden elements with disabled rendering:
 * - display="none"
 * - opacity="0"
 * - circle with zero radius
 * - ellipse with zero x-axis or y-axis radius
 * - rectangle with zero width or height
 * - pattern with zero width or height
 * - image with zero width or height
 * - path with empty data
 * - polyline with empty points
 * - polygon with empty points
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any, params: any): boolean;
