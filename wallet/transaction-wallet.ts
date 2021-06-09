import { ApiTransaction, ApiTransactionDirectionEnum, ApiTransactionStatusEnum, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesPayments, WalletswalletIdtransactionsAmount, WalletswalletIdtransactionsDepth, WalletswalletIdtransactionsExpiresAt, WalletswalletIdtransactionsInputs, WalletswalletIdtransactionsInsertedAt, WalletswalletIdtransactionsMint, WalletswalletIdtransactionsPendingSince, WalletswalletIdtransactionsWithdrawals } from "../models";

export class TransactionWallet implements ApiTransaction {
	id: any;
	amount: WalletswalletIdtransactionsAmount;
	fee: WalletswalletIdpaymentfeesAmount;
	deposit: WalletswalletIdpaymentfeesAmount;
	inserted_at?: WalletswalletIdtransactionsInsertedAt;
	expires_at?: WalletswalletIdtransactionsExpiresAt;
	pending_since?: WalletswalletIdtransactionsPendingSince;
	depth?: WalletswalletIdtransactionsDepth;
	direction: ApiTransactionDirectionEnum;
	inputs: WalletswalletIdtransactionsInputs[];
	outputs: Array<WalletswalletIdpaymentfeesPayments>;
	withdrawals: WalletswalletIdtransactionsWithdrawals[];
	mint: WalletswalletIdtransactionsMint[];
	status: ApiTransactionStatusEnum;
	metadata?: any;

	constructor(
		id: any, 
		amount: WalletswalletIdtransactionsAmount, 
		fee: WalletswalletIdpaymentfeesAmount, 
		deposit: WalletswalletIdpaymentfeesAmount, 
		inserted_at: WalletswalletIdtransactionsInsertedAt,
		expires_at: WalletswalletIdtransactionsExpiresAt,
		pending_since: WalletswalletIdtransactionsPendingSince,
		depth: WalletswalletIdtransactionsDepth,
		direction: ApiTransactionDirectionEnum, 
		inputs: WalletswalletIdtransactionsInputs[], 
		outputs: Array<WalletswalletIdpaymentfeesPayments>, 
		withdrawals: WalletswalletIdtransactionsWithdrawals[], 
		mint: WalletswalletIdtransactionsMint[], 
		status: ApiTransactionStatusEnum,
		metadata: any) {
		this.id = id;
		this.amount = amount;
		this.fee = fee;
		this.deposit = deposit;
		this.direction = direction;
		this.inserted_at = inserted_at;
		this.expires_at = expires_at;
		this.pending_since = pending_since;
		this.depth = depth;
		this.inputs = inputs;
		this.outputs = outputs;
		this.withdrawals = withdrawals;
		this.mint = mint;
		this.status = status;
		this.metadata = metadata
	}

	static from(tx: ApiTransaction): TransactionWallet {
		return new this(tx.id, tx.amount, tx.fee, tx.deposit, tx.inserted_at, tx.expires_at, tx.pending_since, tx.depth, tx.direction, tx.inputs, tx.outputs, tx.withdrawals, tx.mint, tx.status, tx.metadata);
	}
}