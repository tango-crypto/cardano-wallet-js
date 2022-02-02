import { ApiVerificationKey } from "../models";
export declare class KeyWallet implements ApiVerificationKey {
    key: any;
    role: KeyRoleEnum;
    constructor(key: any, role: KeyRoleEnum);
}
export declare enum KeyRoleEnum {
    AddressExternal = "utxo_external",
    AddressInternal = "utxo_internal",
    Stake = "mutable_account",
    Script = "multisig_script"
}
