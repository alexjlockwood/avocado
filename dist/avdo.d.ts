import { Plugin } from './plugins/_types';
export interface Options {
    plugins?: Plugin[][];
    multipass?: boolean;
}
export declare class Avdo {
    private readonly options;
    constructor(options?: Options);
    optimize(xml: string): Promise<string>;
    private optimizeOnce(xml, onSuccess, onFail);
}
