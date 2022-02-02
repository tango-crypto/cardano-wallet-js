"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressWallet = void 0;
var models_1 = require("../models");
var AddressWallet = /** @class */ (function () {
    function AddressWallet(address, state) {
        if (state === void 0) { state = models_1.ApiAddressStateEnum.Unused; }
        this.id = address;
        this.state = state;
    }
    Object.defineProperty(AddressWallet.prototype, "address", {
        get: function () {
            return this.id;
        },
        enumerable: false,
        configurable: true
    });
    AddressWallet.prototype.used = function () {
        return this.state === models_1.ApiAddressStateEnum.Used;
    };
    return AddressWallet;
}());
exports.AddressWallet = AddressWallet;
//# sourceMappingURL=address-wallet.js.map