import { JsApi } from '../jsapi';
export interface Plugin<Params = any> {
    readonly type: 'perItem' | 'perItemReverse' | 'full';
    readonly description: string;
    active: boolean;
    params?: Params;
    fn(item: JsApi, params?: Params): JsApi | undefined;
}
