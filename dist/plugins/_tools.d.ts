/**
 * Encode plain SVG data string into Data URI string.
 *
 * @param {String} str input string
 * @param {String} type Data URI type
 * @return {String} output string
 */
export declare function encodeSVGDatauri(str: any, type: any): any;
/**
 * Decode SVG Data URI string into plain SVG string.
 *
 * @param {string} str input string
 * @return {String} output string
 */
export declare function decodeSVGDatauri(str: any): any;
export declare function intersectArrays(a: any, b: any): any;
export declare function cleanupOutData(data: any, params: any): string;
/**
 * Remove floating-point numbers leading zero.
 *
 * @example
 * 0.5 → .5
 *
 * @example
 * -0.5 → -.5
 *
 * @param {Float} num input number
 *
 * @return {String} output number as string
 */
export declare function removeLeadingZero(num: any): any;
