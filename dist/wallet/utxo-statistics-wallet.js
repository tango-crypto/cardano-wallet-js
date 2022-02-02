"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtxoStatisticsWallet = void 0;
var UtxoStatisticsWallet = /** @class */ (function () {
    function UtxoStatisticsWallet(total, scale, distribution) {
        this.total = total;
        this.scale = scale;
        this.distribution = distribution;
    }
    UtxoStatisticsWallet.from = function (utxoStatistics) {
        return new this(utxoStatistics.total, utxoStatistics.scale, utxoStatistics.distribution);
    };
    return UtxoStatisticsWallet;
}());
exports.UtxoStatisticsWallet = UtxoStatisticsWallet;
//# sourceMappingURL=utxo-statistics-wallet.js.map