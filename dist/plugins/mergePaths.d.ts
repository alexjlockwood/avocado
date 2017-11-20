import { Plugin } from './_types';
export interface Params {
    collapseRepeated: boolean;
    leadingZero: boolean;
    negativeExtraSpace: boolean;
}
export declare const mergePaths: Plugin<Params>;
