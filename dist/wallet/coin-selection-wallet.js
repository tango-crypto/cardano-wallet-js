"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinSelectionWallet = void 0;
var CoinSelectionWallet = /** @class */ (function () {
    function CoinSelectionWallet(inputs, outputs, change, withdrawals, certificates, deposits, metadata) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.change = change;
        this.withdrawals = withdrawals;
        this.certificates = certificates;
        this.deposits = deposits;
        this.metadata = metadata;
    }
    CoinSelectionWallet.from = function (coinSelection) {
        return new this(coinSelection.inputs, coinSelection.outputs, coinSelection.change, coinSelection.withdrawals, coinSelection.certificates, coinSelection.deposits, coinSelection.metadata);
    };
    return CoinSelectionWallet;
}());
exports.CoinSelectionWallet = CoinSelectionWallet;
//# sourceMappingURL=coin-selection-wallet.js.map