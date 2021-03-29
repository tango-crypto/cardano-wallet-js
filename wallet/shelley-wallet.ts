
import { WalletsApi } from '../api';
import { Configuration } from '../configuration';
import { ApiWallet, WalletsAssets, WalletsBalance, WalletsDelegation, WalletsPassphrase, WalletsState, WalletsTip } from '../models';
import { WalletsValuePassphrase } from './passphrase-wallet';
export class ShelleyWallet implements ApiWallet {
	id: any;
	address_pool_gap: any;
	balance: WalletsBalance;
	assets: WalletsAssets;
	delegation: WalletsDelegation;
	name: any;
	passphrase: WalletsValuePassphrase;
	mnemonic_sentence: Array<string>;
	mnemonic_second_factor: Array<string>;
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
		passphrase: WalletsValuePassphrase,
		mnemonic_sentence: Array<string>,
		mnemonic_second_factor: Array<string>,
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
			this.mnemonic_sentence = mnemonic_sentence;
			this.mnemonic_second_factor = mnemonic_second_factor;
			this.state = state;
			this.tip = tip;
			this.walletsApi = new WalletsApi(config);
		}

		static from(wallet: ApiWallet, config: Configuration, passphrase?: WalletsValuePassphrase, mnemonic_sentence?: Array<string>, mnemonic_second_factor?: Array<string>): ShelleyWallet {
			return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, passphrase, mnemonic_sentence, mnemonic_second_factor, wallet.state, wallet.tip, config);
		}

}
