import { WalletsAssetsAvailable } from "../models";
export declare class AssetWallet implements WalletsAssetsAvailable {
    policy_id: string;
    asset_name: string;
    quantity: number;
    constructor(policy_id: string, asset_name: string, quantity: number);
}
