import { Plugin } from './plugins/_types';
export declare const plugins: {
    [name: string]: Plugin;
};
export interface Options {
    plugins?: Plugin[][];
    multipass?: boolean;
    pretty?: boolean;
}
export declare class Avdo {
    private readonly options;
    constructor(options?: Options);
    optimize(xml: string): Promise<string>;
    private optimizeOnce(xml, onSuccess, onFail);
}
