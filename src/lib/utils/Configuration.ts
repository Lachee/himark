/* Utility Types that handles defaults, optionals, and configuration
 * Removal of readonly getters https://stackoverflow.com/a/52473108
*/

type IfEquals<X, Y, A, B> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

type NonFunctionPropertyNames<T> = { 
    [K in keyof T]: T[K] extends Function ? never : (IfEquals<{ [Q in K]: T[K] }, { -readonly [Q in K]: T[K] }, K, never>)
}[keyof T];

/** Extracts the writable properties in a class */
export type Defaults<T> = Pick<T, NonFunctionPropertyNames<T>>;
/** Makes an optional version of all writable properties in the class */
export type Options<T> = Partial<Defaults<T>>;

/** Configures the given context object with a set of optional configuration, and default values. */
export const configure = <T>(context : T, opts? : Options<T>, defaults? : Defaults<T>) : T => Object.assign(context, defaults ?? {}, opts ?? {});
export const configureNew = <T>(opts : Options<T>, defaults : Defaults<T>) : T => configure(Object.assign({}, defaults) as T, opts);