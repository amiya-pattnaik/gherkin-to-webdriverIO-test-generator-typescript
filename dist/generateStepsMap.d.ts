interface Options {
    all?: boolean;
    file?: string[];
    dryRun?: boolean;
    force?: boolean;
    watch?: boolean;
    verbose?: boolean;
}
export declare function processSteps(opts: Options): void;
export {};
