import { ApiCoinSelection, ApiCoinSelectionCertificates, ApiCoinSelectionChange, ApiCoinSelectionInputs, ApiCoinSelectionWithdrawals, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesPayments } from "../models";

export class CoinSelectionWallet implements ApiCoinSelection {
	inputs: ApiCoinSelectionInputs[];
	outputs: WalletswalletIdpaymentfeesPayments[];
	change: ApiCoinSelectionChange[];
	withdrawals?: ApiCoinSelectionWithdrawals[];
	certificates?: ApiCoinSelectionCertificates[];
	deposits?: WalletswalletIdpaymentfeesAmount[];
	metadata?: any;


	constructor(
		inputs: ApiCoinSelectionInputs[], 
		outputs: WalletswalletIdpaymentfeesPayments[], 
		change: ApiCoinSelectionChange[],
		withdrawals: ApiCoinSelectionWithdrawals[],
		certificates: ApiCoinSelectionCertificates[],
		deposits: WalletswalletIdpaymentfeesAmount[],
		metadata: any) {
		this.inputs = inputs;
		this.outputs = outputs;
		this.change = change;
		this.withdrawals = withdrawals;
		this.certificates = certificates;
		this.deposits = deposits;
		this.metadata = metadata;
	}

	static from(coinSelection: ApiCoinSelection) {
		return new this(coinSelection.inputs, coinSelection.outputs, coinSelection.change, coinSelection.withdrawals, coinSelection.certificates, coinSelection.deposits, coinSelection.metadata);
	}

}