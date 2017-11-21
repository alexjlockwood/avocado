export declare function cleanupOutData(data: number[], params: {
    leadingZero: boolean;
    negativeExtraSpace: boolean;
}): string;
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
export declare function removeLeadingZero(num: number): string;
