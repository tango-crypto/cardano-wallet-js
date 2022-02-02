import { ApiMaintenanceAction, ApiMaintenanceActionGcStakePools } from "../models";
export declare class MaintenanceActionWallet implements ApiMaintenanceAction {
    gc_stake_pools: ApiMaintenanceActionGcStakePools;
    constructor(gc_stake_pools: ApiMaintenanceActionGcStakePools);
}
