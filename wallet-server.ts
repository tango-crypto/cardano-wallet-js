import { WalletsApi, NetworkApi } from './api';
import { Configuration } from './configuration';
import { ApiWalletPostData } from './models';
import { ShelleyWallet } from './wallet/shelley-wallet';
export class WalletServer {
	networkApi: NetworkApi;
	walletsApi: WalletsApi;
	config: Configuration;
	private constructor(protected url: string){
		this.config = {
			basePath: url
		}

		this.networkApi = new NetworkApi(this.config);
		this.walletsApi = new WalletsApi(this.config);
	}

	static init(url: string): WalletServer {
		return new WalletServer(url);
	}

	async getNetworkInformation(){
		const res = await this.networkApi.getNetworkInformation();
		return res.data;
	}

	async getNetworkClock(){
		const res = await this.networkApi.getNetworkClock();
		return res.data;
	}

	async getNetworkParameters() {
		const res = await this.networkApi.getNetworkParameters();
		return res.data;
	}

	async wallets(): Promise<ShelleyWallet[]> {
			let res = await this.walletsApi.listWallets();
			return res.data.map(w => ShelleyWallet.from(w, this.config));
	}

	async createOrRestoreShelleyWallet(name: string, mnemonic_sentence: string[], passphrase: string, mnemonic_second_factor?: string[], address_pool_gap?: string): Promise<ShelleyWallet> {
		let payload: ApiWalletPostData = { 
			name: name, 
			mnemonic_sentence: mnemonic_sentence, 
			passphrase: passphrase, 
			mnemonic_second_factor: mnemonic_second_factor, 
			address_pool_gap: address_pool_gap
		};
		const res = await this.walletsApi.postWallet(payload);
		let apiWallet = res.data;
		return ShelleyWallet.from(apiWallet, this.config);
	}

	async getShelleyWallet(id: any): Promise<ShelleyWallet> {
		const res = await this.walletsApi.getWallet(id);
		return ShelleyWallet.from(res.data, this.config);
	}
}