import { ApiTransaction, ApiTransactionDirectionEnum, ApiTransactionStatusEnum, WalletswalletIdpaymentfeesAmount, WalletswalletIdpaymentfeesPayments, WalletswalletIdtransactionsAmount, WalletswalletIdtransactionsDepth, WalletswalletIdtransactionsExpiresAt, WalletswalletIdtransactionsInputs, WalletswalletIdtransactionsInsertedAt, WalletswalletIdtransactionsMint, WalletswalletIdtransactionsPendingSince, WalletswalletIdtransactionsWithdrawals } from "../models";
export declare class TransactionWallet implements ApiTransaction {
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
    constructor(id: any, amount: WalletswalletIdtransactionsAmount, fee: WalletswalletIdpaymentfeesAmount, deposit: WalletswalletIdpaymentfeesAmount, inserted_at: WalletswalletIdtransactionsInsertedAt, expires_at: WalletswalletIdtransactionsExpiresAt, pending_since: WalletswalletIdtransactionsPendingSince, depth: WalletswalletIdtransactionsDepth, direction: ApiTransactionDirectionEnum, inputs: WalletswalletIdtransactionsInputs[], outputs: Array<WalletswalletIdpaymentfeesPayments>, withdrawals: WalletswalletIdtransactionsWithdrawals[], mint: WalletswalletIdtransactionsMint[], status: ApiTransactionStatusEnum, metadata: any);
    static from(tx: ApiTransaction): TransactionWallet;
}
