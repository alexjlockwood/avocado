export declare const type = "perItem";
export declare const active: boolean;
export declare const description = "removes non-inheritable group’s presentational attributes";
export declare const params: any;
/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
export declare function fn(item: any): void;
