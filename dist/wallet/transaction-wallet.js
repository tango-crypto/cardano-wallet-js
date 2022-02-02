"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionWallet = void 0;
var TransactionWallet = /** @class */ (function () {
    function TransactionWallet(id, amount, fee, deposit, inserted_at, expires_at, pending_since, depth, direction, inputs, outputs, withdrawals, mint, status, metadata) {
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
        this.metadata = metadata;
    }
    TransactionWallet.from = function (tx) {
        return new this(tx.id, tx.amount, tx.fee, tx.deposit, tx.inserted_at, tx.expires_at, tx.pending_since, tx.depth, tx.direction, tx.inputs, tx.outputs, tx.withdrawals, tx.mint, tx.status, tx.metadata);
    };
    return TransactionWallet;
}());
exports.TransactionWallet = TransactionWallet;
//# sourceMappingURL=transaction-wallet.js.map