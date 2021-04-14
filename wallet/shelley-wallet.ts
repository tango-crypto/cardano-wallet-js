
import { config } from 'chai';
import { AddressesApi, KeysApi, TransactionsApi, WalletsApi, StakePoolsApi, CoinSelectionsApi } from '../api';
import { Configuration } from '../configuration';
import { ApiAddressData, ApiAddressStateEnum, ApiPostTransactionData, ApiPostTransactionDataWithdrawalEnum, ApiPostTransactionFeeData, ApiWallet, ApiWalletPassphrase, ApiWalletPutData, ApiWalletPutPassphraseData, WalletsAssets, WalletsBalance, WalletsDelegation, WalletsPassphrase, WalletsState, WalletsTip, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesAmountUnitEnum, WalletswalletIdpaymentfeesPayments } from '../models';
import { AddressWallet } from './address-wallet';
import { CoinSelectionWallet } from './coin-selection-wallet';
import { FeeWallet } from './fee-wallet';
import { KeyRoleEnum, KeyWallet } from './key-wallet';
import { TransactionWallet } from './transaction-wallet';
import { UtxoStatisticsWallet } from './utxo-statistics-wallet';

const HEX_PATTERN = /^[0-9|a-f|A-F]+$/;
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
	transactionsApi: TransactionsApi;
	walletsApi: WalletsApi;
	config: Configuration;
	stakePoolApi: StakePoolsApi;
	coinSelectionsApi: CoinSelectionsApi;


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
			this.config = config;
			this.addressesApi = new AddressesApi(config);
			this.keysApi = new KeysApi(config);
			this.transactionsApi = new TransactionsApi(config);
			this.walletsApi = new WalletsApi(config);
			this.stakePoolApi = new StakePoolsApi(config);
			this.coinSelectionsApi = new CoinSelectionsApi(config);
		}

		static from(wallet: ApiWallet, config: Configuration): ShelleyWallet {
			return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, wallet.passphrase, wallet.state, wallet.tip, config);
		}

		async rename(name: string) {
			let payload: ApiWalletPutData = {
				name: name
			};
			let res = await this.walletsApi.putWallet(payload, this.id);
			this.updateData(res.data);
			return this;
		}

		async updatePassphrase(oldPassphrase: string, newPassphrase: string) {
			let paylaod: ApiWalletPutPassphraseData = {
				old_passphrase: oldPassphrase,
				new_passphrase: newPassphrase
			};
			await this.walletsApi.putWalletPassphrase(paylaod, this.id);
			let res = await this.walletsApi.getWallet(this.id);
			this.updateData(res.data);
			return this;
		}

		async getUtxoStatistics() {
			let res = await this.walletsApi.getUTxOsStatistics(this.id);
			return UtxoStatisticsWallet.from(res.data);
		}

		getTotalBalance() {
			return this.balance.total.quantity;
		}

		getAvailableBalance() {
			return this.balance.available.quantity;
		}

		getRewardBalance() {
			return this.balance.reward.quantity;
		}

		getDelegation() {
			return this.delegation;
		}

		async refresh() {
			let res = await this.walletsApi.getWallet(this.id);
			this.updateData(res.data);
			return this;
		}

		async delete() {
			return await this.walletsApi.deleteWallet(this.id);
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

		async getAddressAt(index: number): Promise<AddressWallet> {
			let addressVk = await this.getAddressExternalVerificationKey(index);
			let stakeVk = await this.getStakeVerificationKey(0);
			let payload: ApiAddressData = {
				payment: addressVk.key,
				stake: stakeVk.key
			};
			let next = await this.addressesApi.postAnyAddress(payload); 
			return new AddressWallet(next.data.address);
		}

		async getNextAddress(): Promise<AddressWallet> {
			let index = (await this.getAddresses()).length;
			return this.getAddressAt(index);
		}

		async getAddressExternalVerificationKey(index: number): Promise<KeyWallet> {
			let account = await this.keysApi.getWalletKey(this.id, KeyRoleEnum.AddressExternal, index.toString());
			return new KeyWallet(account.data, KeyRoleEnum.AddressExternal);
		}

		async getStakeVerificationKey(index: number): Promise<KeyWallet> {
			let account = await this.keysApi.getWalletKey(this.id, KeyRoleEnum.Stake, index.toString());
			return new KeyWallet(account.data, KeyRoleEnum.Stake);
		}

		async getTransaction(txId: string): Promise<TransactionWallet> {
			let res = await this.transactionsApi.getTransaction(this.id, txId);
			return TransactionWallet.from(res.data);
		}

		async estimateFee(addresses: AddressWallet[], amounts: number[]): Promise<FeeWallet> { 
			let payload: ApiPostTransactionFeeData = {
				payments: addresses.map((addr, i) =>  {
					let amount: WalletswalletIdpaymentfeesAmount = { unit: WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
					let payment: WalletswalletIdpaymentfeesPayments = { 
						address: addr.address, 
						amount: amount
					};
					return payment;
				})
			};
			let res = await this.transactionsApi.postTransactionFee(payload, this.id);
			return FeeWallet.from(res.data);
		}

		async sendPayment(passphrase: any, addresses: AddressWallet[], amounts: number[], data?: any): Promise<TransactionWallet> { 
			let metadata = data ? this.constructMetadata(data) : undefined;
			let payload: ApiPostTransactionData = {
				passphrase: passphrase,
				payments: addresses.map((addr, i) =>  {
					let amount: WalletswalletIdpaymentfeesAmount = { unit: WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
					let payment: WalletswalletIdpaymentfeesPayments = { 
						address: addr.address, 
						amount: amount
					};
					return payment;
				}),
				metadata: metadata
			};
			let res = await this.transactionsApi.postTransaction(payload, this.id);
			return TransactionWallet.from(res.data);
		}

		async estimateDelegationFee(): Promise<FeeWallet> {
			let res = await this.stakePoolApi.getDelegationFee(this.id);
			return FeeWallet.from(res.data);
		}

		async delegate(poolId: string, passphrase: string): Promise<TransactionWallet> {
			let payload: ApiWalletPassphrase = {
				passphrase: passphrase
			};
			let res = await this.stakePoolApi.joinStakePool(payload, poolId, this.id);
			return TransactionWallet.from(res.data);
		}

		async withdraw(passphrase: any, addresses: AddressWallet[], amounts: number[]): Promise<TransactionWallet> { 
			let payload: ApiPostTransactionData = {
				passphrase: passphrase,
				payments: addresses.map((addr, i) =>  {
					let amount: WalletswalletIdpaymentfeesAmount = { unit: WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
					let payment: WalletswalletIdpaymentfeesPayments = { 
						address: addr.address, 
						amount: amount
					};
					return payment;
				}),
				withdrawal: ApiPostTransactionDataWithdrawalEnum.Self
			};
			let res = await this.transactionsApi.postTransaction(payload, this.id);
			return TransactionWallet.from(res.data);
		}

		async stopDelegation(passphrase: string): Promise<TransactionWallet> {
			let payload: ApiWalletPassphrase = {
				passphrase: passphrase
			};
			let res = await this.stakePoolApi.quitStakePool(payload, this.id);
			return TransactionWallet.from(res.data);
		}

		async getCoinSelection(addresses: AddressWallet[], amounts: number[]): Promise<CoinSelectionWallet> {
			let payload: ApiPostTransactionFeeData = {
				payments: addresses.map((addr, i) =>  {
					let amount: WalletswalletIdpaymentfeesAmount = { unit: WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
					let payment: WalletswalletIdpaymentfeesPayments = { 
						address: addr.address, 
						amount: amount
					};
					return payment;
				})
			};
			let res = await this.coinSelectionsApi.selectCoins(payload, this.id);
			return CoinSelectionWallet.from(res.data);
		}

		private updateData(data: ApiWallet) {
			this.address_pool_gap = data.address_pool_gap;
			this.balance = data.balance;
			this.assets = data.assets;
			this.delegation = data.delegation;
			this.name = data.name;
			this.passphrase = data.passphrase;
			this.state = data.state;
			this.tip = data.tip;
		}

		private constructMetadata(data: any) {
			let metadata: any = {};

			if(Array.isArray(data)) {
				for (let i = 0; i < data.length; i++) {
					const value = data[i];
					metadata[i] = this.getMetadataObject(value);
				}
			} else {
				let keys = Object.keys(data);
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					let index = parseInt(key);
					if(!isNaN(index)) {
						metadata[index] = this.getMetadataObject(data[key]);
					}
				}
			}
			return metadata;
		}

		private getMetadataObject(data:any) {
			let result: any = {};
			let type = typeof data;
			if(type == "number") {
				result[MetadateTypesEnum.Number] = data;
			} else if(type == "string") {
				if (this.isHex(data)) {
					if(Buffer.byteLength(data, "hex") <= 64) {
						result[MetadateTypesEnum.Bytes] = data;
					}
				} else if(Buffer.byteLength(data, 'utf-8') <= 64) {
					result[MetadateTypesEnum.String] = data;
				}
			} else if(type == "boolean"){
				result[MetadateTypesEnum.String] = data.toString();
			} else if(type == "undefined"){
				result[MetadateTypesEnum.String] = "undefined";
			}else if(Array.isArray(data)) {
				result[MetadateTypesEnum.List] = data.map(a => this.getMetadataObject(a));
			} else if (type == "object") {
				if (data) {
					result[MetadateTypesEnum.Map] = Object.keys(data).map(k => {
						return {
							"k": this.getMetadataObject(k),
							"v": this.getMetadataObject(data[k])
						}
					});
				} else {
					result[MetadateTypesEnum.String] = "null";
				}
			}
			return result;
		}

		private isHex(s: string): boolean {
			return HEX_PATTERN.test(s);
		}
}

export enum MetadateTypesEnum {
	Number = "int",
	String = "string",
	Bytes = "bytes",
	List = "list",
	Map = "map",
}