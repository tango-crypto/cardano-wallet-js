import { ApiWalletUTxOsStatistics, ApiWalletUTxOsStatisticsScaleEnum, WalletswalletIdpaymentfeesAmount } from "../models";
export declare class UtxoStatisticsWallet implements ApiWalletUTxOsStatistics {
    total: WalletswalletIdpaymentfeesAmount;
    scale: ApiWalletUTxOsStatisticsScaleEnum;
    distribution: any;
    constructor(total: WalletswalletIdpaymentfeesAmount, scale: ApiWalletUTxOsStatisticsScaleEnum, distribution: any);
    static from(utxoStatistics: ApiWalletUTxOsStatistics): UtxoStatisticsWallet;
}
