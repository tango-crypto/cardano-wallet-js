import { ApiCoinSelection, ApiCoinSelectionCertificates, ApiCoinSelectionChange, ApiCoinSelectionInputs, ApiCoinSelectionWithdrawals, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesPayments } from "../models";
export declare class CoinSelectionWallet implements ApiCoinSelection {
    inputs: ApiCoinSelectionInputs[];
    outputs: WalletswalletIdpaymentfeesPayments[];
    change: ApiCoinSelectionChange[];
    withdrawals?: ApiCoinSelectionWithdrawals[];
    certificates?: ApiCoinSelectionCertificates[];
    deposits?: WalletswalletIdpaymentfeesAmount[];
    metadata?: any;
    constructor(inputs: ApiCoinSelectionInputs[], outputs: WalletswalletIdpaymentfeesPayments[], change: ApiCoinSelectionChange[], withdrawals: ApiCoinSelectionWithdrawals[], certificates: ApiCoinSelectionCertificates[], deposits: WalletswalletIdpaymentfeesAmount[], metadata: any);
    static from(coinSelection: ApiCoinSelection): CoinSelectionWallet;
}
