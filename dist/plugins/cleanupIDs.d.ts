export declare const type = "full";
export declare const active: boolean;
export declare const description = "removes unused IDs and minifies used";
export declare const params: {
    remove: boolean;
    minify: boolean;
    prefix: string;
    preserve: any[];
    force: boolean;
};
/**
 * Remove unused and minify used IDs
 * (only if there are no any <style> or <script>).
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 *
 * @author Kir Belevich
 */
export declare function fn(data: any, params: any): any;
