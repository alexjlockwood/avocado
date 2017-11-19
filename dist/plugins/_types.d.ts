export interface Plugin {
    type: 'perItem' | 'perItemReverse' | 'full';
    description: string;
    active: boolean;
    params: any;
    fn: Function;
}
