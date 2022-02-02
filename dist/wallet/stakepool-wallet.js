"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakePoolWallet = void 0;
var StakePoolWallet = /** @class */ (function () {
    function StakePoolWallet(id, metrics, cost, margin, pledge, metadata, retirement, flags) {
        this.id = id;
        this.metrics = metrics;
        this.cost = cost;
        this.margin = margin;
        this.pledge = pledge;
        this.metadata = metadata;
        this.retirement = retirement;
        this.flags = flags;
    }
    StakePoolWallet.from = function (apiStakePool) {
        return new this(apiStakePool.id, apiStakePool.metrics, apiStakePool.cost, apiStakePool.margin, apiStakePool.pledge, apiStakePool.metadata, apiStakePool.retirement, apiStakePool.flags);
    };
    return StakePoolWallet;
}());
exports.StakePoolWallet = StakePoolWallet;
//# sourceMappingURL=stakepool-wallet.js.map