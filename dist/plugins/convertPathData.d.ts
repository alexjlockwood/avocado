import { Plugin } from './_types';
export declare const defaultParams: {
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
export declare type Params = typeof defaultParams;
export declare const convertPathData: Plugin<Params>;
