import { ApiWalletUTxOsStatistics, ApiWalletUTxOsStatisticsScaleEnum, WalletswalletIdpaymentfeesAmount } from "../models";

export class UtxoStatisticsWallet implements ApiWalletUTxOsStatistics {
	total: WalletswalletIdpaymentfeesAmount;
	scale: ApiWalletUTxOsStatisticsScaleEnum;
	distribution: any;


	constructor(total: WalletswalletIdpaymentfeesAmount, scale: ApiWalletUTxOsStatisticsScaleEnum, distribution: any) {
		this.total = total;
		this.scale = scale;
		this.distribution = distribution;
	}

	static from(utxoStatistics: ApiWalletUTxOsStatistics) {
		return new this(utxoStatistics.total, utxoStatistics.scale, utxoStatistics.distribution);
	} 

}