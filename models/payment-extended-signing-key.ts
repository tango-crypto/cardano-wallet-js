export class ExtendedSigningKey {
    type: ExtendedSigningKeyEnum;
    description: string;
    cborHex: string;

    constructor(cborHex: string, description = '') {
        this.cborHex = cborHex;
        this.description = description;
        this.type = ExtendedSigningKeyEnum.PaymentExtendedSigningKeyShelley_ed25519_bip32;
    }

    toJSON(): any {
        return {
            type: this.type.toString(),
            description: this.description,
            cborHex: this.cborHex
        }
    }
}

export enum ExtendedSigningKeyEnum {
    PaymentExtendedSigningKeyShelley_ed25519_bip32 = "PaymentExtendedSigningKeyShelley_ed25519_bip32"
}