import { ApiAddress, ApiAddressStateEnum } from "../models";
export declare class AddressWallet implements ApiAddress {
    id: string;
    state: ApiAddressStateEnum;
    constructor(address: string, state?: ApiAddressStateEnum);
    get address(): string;
    used(): boolean;
}
