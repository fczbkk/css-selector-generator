type powerSetGeneratorOptions = {
    maxResults?: number;
};
export declare function powerSetGenerator<T>(input?: Array<T>, { maxResults }?: powerSetGeneratorOptions): IterableIterator<Array<T>>;
/**
 * Generates power set of input items.
 */
export declare function getPowerSet<T>(input?: Array<T>, { maxResults }?: powerSetGeneratorOptions): Array<Array<T>>;
export {};
