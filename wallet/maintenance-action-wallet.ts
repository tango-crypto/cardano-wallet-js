import { ApiMaintenanceAction, ApiMaintenanceActionGcStakePools } from "../models";

export class MaintenanceActionWallet implements ApiMaintenanceAction {
	gc_stake_pools: ApiMaintenanceActionGcStakePools;

	constructor(gc_stake_pools: ApiMaintenanceActionGcStakePools) {
		this.gc_stake_pools = gc_stake_pools;
	}

}