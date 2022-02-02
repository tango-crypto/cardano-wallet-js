"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedSigningKeyEnum = exports.ExtendedSigningKey = void 0;
var ExtendedSigningKey = /** @class */ (function () {
    function ExtendedSigningKey(cborHex, description) {
        if (description === void 0) { description = ''; }
        this.cborHex = cborHex;
        this.description = description;
        this.type = ExtendedSigningKeyEnum.PaymentExtendedSigningKeyShelley_ed25519_bip32;
    }
    ExtendedSigningKey.prototype.toJSON = function () {
        return {
            type: this.type.toString(),
            description: this.description,
            cborHex: this.cborHex
        };
    };
    return ExtendedSigningKey;
}());
exports.ExtendedSigningKey = ExtendedSigningKey;
var ExtendedSigningKeyEnum;
(function (ExtendedSigningKeyEnum) {
    ExtendedSigningKeyEnum["PaymentExtendedSigningKeyShelley_ed25519_bip32"] = "PaymentExtendedSigningKeyShelley_ed25519_bip32";
})(ExtendedSigningKeyEnum = exports.ExtendedSigningKeyEnum || (exports.ExtendedSigningKeyEnum = {}));
//# sourceMappingURL=payment-extended-signing-key.js.map