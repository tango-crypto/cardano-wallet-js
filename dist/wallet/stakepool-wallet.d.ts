import { ApiStakePool, ApiStakePoolFlagsEnum, StakepoolsCost, StakepoolsMargin, StakepoolsMetadata, StakepoolsMetrics, StakepoolsPledge, StakepoolsRetirement } from "../models";
export declare class StakePoolWallet implements ApiStakePool {
    id: any;
    metrics: StakepoolsMetrics;
    cost: StakepoolsCost;
    margin: StakepoolsMargin;
    pledge: StakepoolsPledge;
    metadata?: StakepoolsMetadata;
    retirement?: StakepoolsRetirement;
    flags: ApiStakePoolFlagsEnum[];
    constructor(id: any, metrics: StakepoolsMetrics, cost: StakepoolsCost, margin: StakepoolsMargin, pledge: StakepoolsPledge, metadata: StakepoolsMetadata, retirement: StakepoolsRetirement, flags: ApiStakePoolFlagsEnum[]);
    static from(apiStakePool: ApiStakePool): StakePoolWallet;
}
