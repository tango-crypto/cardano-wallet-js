
import { config } from 'chai';
import { AddressesApi, KeysApi, TransactionsApi, WalletsApi, StakePoolsApi } from '../api';
import { Configuration } from '../configuration';
import { ApiAddressData, ApiAddressStateEnum, ApiPostTransactionData, ApiPostTransactionFeeData, ApiWallet, ApiWalletPassphrase, ApiWalletPutData, ApiWalletPutPassphraseData, WalletsAssets, WalletsBalance, WalletsDelegation, WalletsPassphrase, WalletsState, WalletsTip, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesAmountUnitEnum, WalletswalletIdpaymentfeesPayments } from '../models';
import { AddressWallet } from './address-wallet';
import { FeeWallet } from './fee-wallet';
import { KeyRoleEnum, KeyWallet } from './key-wallet';
import { TransactionWallet } from './transaction-wallet';
import { UtxoStatisticsWallet } from './utxo-statistics-wallet';
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
		}

		static from(wallet: ApiWallet, config: Configuration): ShelleyWallet {
			return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, wallet.passphrase, wallet.state, wallet.tip, config);
		}

		async rename(name: string) {
			let payload: ApiWalletPutData = {
				name: name
			};
			let res = await this.walletsApi.putWallet(payload, this.id);
			this.name = res.data.name;
			return this;
		}

		async updatePassphrase(oldPassphrase: string, newPassphrase: string) {
			let paylaod: ApiWalletPutPassphraseData = {
				old_passphrase: oldPassphrase,
				new_passphrase: newPassphrase
			};
			await this.walletsApi.putWalletPassphrase(paylaod, this.id);
			let res = await this.walletsApi.getWallet(this.id);
			return ShelleyWallet.from(res.data, this.config);
		}

		async getUtxoStatistics() {
			let res = await this.walletsApi.getUTxOsStatistics(this.id);
			return UtxoStatisticsWallet.from(res.data);
		}

		async getBalance() {
			let res = await this.walletsApi.getWallet(this.id);
			return res.data.balance;
		}

		async getDelegation() {
			let res = await this.walletsApi.getWallet(this.id);
			return res.data.delegation;
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

		async sendPayment(passphrase: any, addresses: AddressWallet[], amounts: number[]): Promise<TransactionWallet> { 
			let payload: ApiPostTransactionData = {
				passphrase: passphrase,
				payments: addresses.map((addr, i) =>  {
					let amount: WalletswalletIdpaymentfeesAmount = { unit: WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
					let payment: WalletswalletIdpaymentfeesPayments = { 
						address: addr.address, 
						amount: amount
					};
					return payment;
				})
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
}
