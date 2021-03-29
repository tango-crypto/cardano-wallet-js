
import { AddressesApi, KeysApi } from '../api';
import { Configuration } from '../configuration';
import { ApiAddressData, ApiAddressStateEnum, ApiWallet, WalletsAssets, WalletsBalance, WalletsDelegation, WalletsPassphrase, WalletsState, WalletsTip } from '../models';
import { AddressWallet } from './address-wallet';
import { KeyRoleEnum, KeyWallet } from './key-wallet';
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
	addressesApi: AddressesApi;
	keysApi: KeysApi;

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
			this.addressesApi = new AddressesApi(config);
			this.keysApi = new KeysApi(config);
		}

		static from(wallet: ApiWallet, config: Configuration): ShelleyWallet {
			return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, wallet.passphrase, wallet.state, wallet.tip, config);
		}

		async getAddresses(): Promise<AddressWallet[]> {
			let res = await this.addressesApi.listAddresses(this.id);
			return res.data.map(addr => new AddressWallet(addr.id, addr.state));
		}

		async getUnusedAddresses(): Promise<AddressWallet[]> {
			let res = await this.addressesApi.listAddresses(this.id, ApiAddressStateEnum.Unused);
			return res.data.map(addr => new AddressWallet(addr.id, addr.state));
		}

		async getUsedAddresses(): Promise<AddressWallet[]> {
			let res = await this.addressesApi.listAddresses(this.id, ApiAddressStateEnum.Used);
			return res.data.map(addr => new AddressWallet(addr.id, addr.state));
		}

		async getNextAddress(): Promise<AddressWallet> {
			let addresses = await this.getAddresses();
			let index = addresses.length;
			let addressVk = await this.getAddressExternalVerificationKey(index);
			let stakeVk = await this.getStakeVerificationKey(0);
			let payload: ApiAddressData = {
				payment: addressVk.key,
				stake: stakeVk.key
			};
			let next = await this.addressesApi.postAnyAddress(payload); 
			return new AddressWallet(next.data.address);
		}

		async getAddressExternalVerificationKey(index: number): Promise<KeyWallet> {
			let account = await this.keysApi.getWalletKey(this.id, KeyRoleEnum.AddressExternal, index.toString());
			return new KeyWallet(account.data, KeyRoleEnum.AddressExternal);
		}

		async getStakeVerificationKey(index: number): Promise<KeyWallet> {
			let account = await this.keysApi.getWalletKey(this.id, KeyRoleEnum.Stake, index.toString());
			return new KeyWallet(account.data, KeyRoleEnum.Stake);
		}
}
