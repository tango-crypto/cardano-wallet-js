import { ApiAddress, ApiAddressStateEnum } from "../models";

export class AddressWallet implements ApiAddress {
	id: string;
	state: ApiAddressStateEnum;

	constructor(address: string, state: ApiAddressStateEnum = ApiAddressStateEnum.Unused) {
		this.id = address;
		this.state = state;
	}

	get address() {
		return this.id;
	}

	used() {
		return this.state === ApiAddressStateEnum.Used;
	}
}