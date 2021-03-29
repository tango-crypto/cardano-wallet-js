import { ApiVerificationKey } from "../models";

export class KeyWallet implements ApiVerificationKey {
		key: any;
		role: KeyRoleEnum;
		constructor(key: any, role: KeyRoleEnum) {
			this.key = key;
			this.role = role;
		}
}

export enum KeyRoleEnum {
	AddressExternal = 'utxo_external',
	AddressInternal = 'utxo_internal',
	Stake = 'mutable_account',
	Script = 'multisig_script',

}