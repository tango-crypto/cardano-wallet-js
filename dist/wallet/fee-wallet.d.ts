import { ApiFee, WalletswalletIdpaymentfeesAmount } from "../models";
export declare class FeeWallet implements ApiFee {
    estimated_min: WalletswalletIdpaymentfeesAmount;
    estimated_max: WalletswalletIdpaymentfeesAmount;
    minimum_coins: WalletswalletIdpaymentfeesAmount[];
    deposit: WalletswalletIdpaymentfeesAmount;
    constructor(estimated_min: WalletswalletIdpaymentfeesAmount, estimated_max: WalletswalletIdpaymentfeesAmount, minimum_coins: WalletswalletIdpaymentfeesAmount[], deposit: WalletswalletIdpaymentfeesAmount);
    static from(fee: ApiFee): FeeWallet;
}
