"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyRoleEnum = exports.KeyWallet = void 0;
var KeyWallet = /** @class */ (function () {
    function KeyWallet(key, role) {
        this.key = key;
        this.role = role;
    }
    return KeyWallet;
}());
exports.KeyWallet = KeyWallet;
var KeyRoleEnum;
(function (KeyRoleEnum) {
    KeyRoleEnum["AddressExternal"] = "utxo_external";
    KeyRoleEnum["AddressInternal"] = "utxo_internal";
    KeyRoleEnum["Stake"] = "mutable_account";
    KeyRoleEnum["Script"] = "multisig_script";
})(KeyRoleEnum = exports.KeyRoleEnum || (exports.KeyRoleEnum = {}));
//# sourceMappingURL=key-wallet.js.map