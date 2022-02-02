"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeWallet = void 0;
var FeeWallet = /** @class */ (function () {
    function FeeWallet(estimated_min, estimated_max, minimum_coins, deposit) {
        this.estimated_min = estimated_min;
        this.estimated_max = estimated_max;
        this.minimum_coins = minimum_coins;
        this.deposit = deposit;
    }
    FeeWallet.from = function (fee) {
        return new this(fee.estimated_min, fee.estimated_max, fee.minimum_coins, fee.deposit);
    };
    return FeeWallet;
}());
exports.FeeWallet = FeeWallet;
//# sourceMappingURL=fee-wallet.js.map