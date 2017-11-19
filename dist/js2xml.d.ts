/**
 * Convert XML-as-JS object to XML string.
 * @param {Object} data input data
 * @param {Object} config config
 * @return {Object} output data
 */
export declare function js2xml(data: any, config: any): {
    data: string;
    info: {
        width: any;
        height: any;
    };
};
