import { WalletsApi, NetworkApi } from './api';
import { Configuration } from './configuration';
import { ApiWallet, ApiWalletPostData } from './models';
import { ShelleyWallet } from './wallet/shelley-wallet';
import { WalletsValuePassphrase } from './wallet/passphrase-wallet';

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

	async createOrGetShelleyWallet(name: string, mnemonic_sentence: string[], passphrase: string, mnemonic_second_factor?: string[], address_pool_gap?: string): Promise<ShelleyWallet> {
		let payload: ApiWalletPostData = { 
			name: name, 
			mnemonic_sentence: mnemonic_sentence, 
			passphrase: passphrase, 
			mnemonic_second_factor: mnemonic_second_factor, 
			address_pool_gap: address_pool_gap
		};
		try {
			const res = await this.walletsApi.postWallet(payload);
			let apiWallet = res.data;
			let password: WalletsValuePassphrase = {
				last_updated_at: apiWallet.passphrase.last_updated_at,
				value: passphrase
			}
			return ShelleyWallet.from(apiWallet, this.config, password, mnemonic_sentence, mnemonic_second_factor);
		}
		catch(error) {
			let message = error.response.data.message;
				let match = message.match(/id:\s*(?<id>[0-9a-fA-F]{40})/);
				if (match) {
					let id = match.groups['id'];
					let wallet = await this.getShelleyWallet(id);
					wallet.passphrase.value = passphrase;
					wallet.mnemonic_sentence = mnemonic_sentence;
					wallet.mnemonic_second_factor = mnemonic_second_factor;
					return wallet;
				}
		}
	}

	async getShelleyWallet(id: any): Promise<ShelleyWallet> {
		const res = await this.walletsApi.getWallet(id);
		let password: WalletsValuePassphrase = {
			last_updated_at: res.data.passphrase.last_updated_at,
			value: ''
		}
		return ShelleyWallet.from(res.data, this.config, password);
	}
}