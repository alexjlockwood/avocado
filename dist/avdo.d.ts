import { Plugin } from './plugins/_types';
export interface Options {
    plugins: Plugin[][];
    multipass?: boolean;
}
export declare class Avdo {
    private readonly options;
    constructor(options?: Options);
    optimize(svgstr: any, info?: any): Promise<{
        data: string;
        info: {
            width: number;
            height: number;
        };
    }>;
    private _optimizeOnce(svgstr, info, onSuccess, onFail);
}
