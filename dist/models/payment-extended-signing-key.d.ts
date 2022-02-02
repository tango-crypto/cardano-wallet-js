export declare class ExtendedSigningKey {
    type: ExtendedSigningKeyEnum;
    description: string;
    cborHex: string;
    constructor(cborHex: string, description?: string);
    toJSON(): any;
}
export declare enum ExtendedSigningKeyEnum {
    PaymentExtendedSigningKeyShelley_ed25519_bip32 = "PaymentExtendedSigningKeyShelley_ed25519_bip32"
}
