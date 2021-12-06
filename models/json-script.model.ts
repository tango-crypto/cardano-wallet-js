export interface JsonScript {
    type: ScriptTypeEnum;
    keyHash?: string;
    scripts?: JsonScript[];
    lockTime?: string | number | Date;
    slot?: number;
    require?: number;
}


export enum ScriptTypeEnum {
    Sig = "sig",
    All = "all",
    Any = "any",
    AtLeast = "atLeast",
    After = "after",
    Before = "before"
}

export const scriptTypes = ['sig', 'all', 'any', 'atLeast', 'after', 'before'];