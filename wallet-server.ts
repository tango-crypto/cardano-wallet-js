import { WalletsApi, NetworkApi } from './api';
import { Configuration } from './configuration';

export class WalletServer {
	networkApi: NetworkApi;
	private constructor(protected url: string){
		let config : Configuration = {
			basePath: url
		}

		this.networkApi = new NetworkApi(config);
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
}