import { ApiAddress, ApiAddressStateEnum } from "../models";

export class AddressWallet implements ApiAddress {
	id: any;
	state: ApiAddressStateEnum;

	constructor(address: any, state: ApiAddressStateEnum = ApiAddressStateEnum.Unused) {
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