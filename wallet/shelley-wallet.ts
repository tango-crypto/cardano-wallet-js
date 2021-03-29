
import { WalletsApi } from '../api';
import { Configuration } from '../configuration';
import { ApiWallet, WalletsAssets, WalletsBalance, WalletsDelegation, WalletsPassphrase, WalletsState, WalletsTip } from '../models';
export class ShelleyWallet implements ApiWallet {
	id: any;
	address_pool_gap: any;
	balance: WalletsBalance;
	assets: WalletsAssets;
	delegation: WalletsDelegation;
	name: any;
	passphrase: WalletsPassphrase;
	state: WalletsState;
	tip: WalletsTip;
	walletsApi: WalletsApi;

	constructor(
		id: any, 
		address_pool_gap: any, 
		balance: WalletsBalance, 
		assets: WalletsAssets,
		delegation: WalletsDelegation,
		name: any,
		passphrase: WalletsPassphrase,
		state: WalletsState,
		tip: WalletsTip,
		config: Configuration) {
			this.id = id;
			this.address_pool_gap = address_pool_gap;
			this.balance = balance;
			this.assets = assets;
			this.delegation = delegation;
			this.name = name;
			this.passphrase = passphrase;
			this.state = state;
			this.tip = tip;
			this.walletsApi = new WalletsApi(config);
		}

		static from(wallet: ApiWallet, config: Configuration): ShelleyWallet {
			return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, wallet.passphrase, wallet.state, wallet.tip, config);
		}

}
