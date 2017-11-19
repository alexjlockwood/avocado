export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes specified attributes";
export declare const params: {
    elemSeparator: string;
    attrs: any[];
};
/**
 * Remove attributes
 *
 * @param elemSeparator
 *   format: string
 *
 * @param attrs:
 *
 *   format: [ element* : attribute* ]
 *
 *   element   : regexp (wrapped into ^...$), single * or omitted > all elements
 *   attribute : regexp (wrapped into ^...$)
 *
 *   examples:
 *
 *     > basic: remove fill attribute
 *     ---
 *     removeAttrs:
 *       attrs: 'fill'
 *
 *     > remove fill attribute on path element
 *     ---
 *       attrs: 'path:fill'
 *
 *
 *     > remove all fill and stroke attribute
 *     ---
 *       attrs:
 *         - 'fill'
 *         - 'stroke'
 *
 *     [is same as]
 *
 *       attrs: '(fill|stroke)'
 *
 *     [is same as]
 *
 *       attrs: '*:(fill|stroke)'
 *
 *     [is same as]
 *
 *       attrs: '.*:(fill|stroke)'
 *
 *
 *     > remove all stroke related attributes
 *     ----
 *     attrs: 'stroke.*'
 *
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Benny Schudel
 */
export declare function fn(item: any, params: any): void;
