declare type powerSetGeneratorOptions = {
    maxResults?: number;
};
/**
 * Generates power set of input items.
 */
export declare function getPowerSet<T>(input?: Array<T>, { maxResults }?: powerSetGeneratorOptions): Array<Array<T>>;
export {};
