import { ApiStakePool, ApiStakePoolFlagsEnum, StakepoolsCost, StakepoolsMargin, StakepoolsMetadata, StakepoolsMetrics, StakepoolsPledge, StakepoolsRetirement } from "../models";

export class StakePoolWallet implements ApiStakePool {
	id: any;
	metrics: StakepoolsMetrics;
	cost: StakepoolsCost;
	margin: StakepoolsMargin;
	pledge: StakepoolsPledge;
	metadata?: StakepoolsMetadata;
	retirement?: StakepoolsRetirement;
	flags: ApiStakePoolFlagsEnum[];


	constructor(id: any, metrics: StakepoolsMetrics, cost: StakepoolsCost, margin: StakepoolsMargin, pledge: StakepoolsPledge, 	metadata: StakepoolsMetadata, retirement: StakepoolsRetirement, flags: ApiStakePoolFlagsEnum[]) {
		this.id = id;
		this.metrics = metrics;
		this.cost = cost;
		this.margin = margin;
		this.pledge = pledge;
		this.metadata = metadata;
		this.retirement = retirement;
		this.flags = flags;
	}

	static from(apiStakePool: ApiStakePool) {
		return new this(apiStakePool.id, apiStakePool.metrics, apiStakePool.cost, apiStakePool.margin, apiStakePool.pledge, apiStakePool.metadata, apiStakePool.retirement, apiStakePool.flags);
	}
}