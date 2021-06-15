import { WalletsAssetsAvailable } from "../models";

export class AssetWallet implements WalletsAssetsAvailable {
	policy_id: string;
	asset_name: string;
	quantity: number;
	constructor(policy_id: string, asset_name: string, quantity: number){
		this.policy_id = policy_id;
		this.asset_name = asset_name;
		this.quantity = quantity;
	}
}