import { NativeScript } from "@emurgo/cardano-serialization-lib-nodejs";
import { Bip32KeyPair } from "../utils";
import { AssetWallet } from "./asset-wallet";

export class TokenWallet {
	asset: AssetWallet;
	script: NativeScript;
	policy: Bip32KeyPair;

	constructor(asset: AssetWallet, policy: Bip32KeyPair, script: NativeScript) {
		this.asset = asset;
		this.script = script;
		this.policy = policy;
	}
}
