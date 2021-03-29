import { ApiFee, WalletswalletIdpaymentfeesAmount } from "../models";

export class FeeWallet implements ApiFee {
	estimated_min: WalletswalletIdpaymentfeesAmount;
	estimated_max: WalletswalletIdpaymentfeesAmount;
	minimum_coins: WalletswalletIdpaymentfeesAmount[];
	deposit: WalletswalletIdpaymentfeesAmount;

	constructor(
		estimated_min: WalletswalletIdpaymentfeesAmount, 
		estimated_max: WalletswalletIdpaymentfeesAmount, 
		minimum_coins: WalletswalletIdpaymentfeesAmount[], 
		deposit: WalletswalletIdpaymentfeesAmount) {
		this.estimated_min = estimated_min;
		this.estimated_max = estimated_max;
		this.minimum_coins = minimum_coins;
		this.deposit = deposit;
	}

	static from(fee: ApiFee) {
		return new this(fee.estimated_min, fee.estimated_max, fee.minimum_coins, fee.deposit);
	}

}