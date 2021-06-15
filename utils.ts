import { CoinSelectionWallet } from './wallet/coin-selection-wallet';
import { generateMnemonic, mnemonicToEntropy } from 'bip39';
import { Address, AssetName, Assets, BigNum, Bip32PrivateKey, Bip32PublicKey, Ed25519KeyHash, Ed25519Signature, EnterpriseAddress, GeneralTransactionMetadata, hash_metadata, hash_transaction, Int, LinearFee, make_vkey_witness, MetadataList, MetadataMap, Mint, MintAssets, min_ada_required, min_fee, MultiAsset, NativeScript, NativeScripts, NetworkInfo, PrivateKey, PublicKey, ScriptAll, ScriptAny, ScriptHash, ScriptHashNamespace, ScriptNOfK, ScriptPubkey, StakeCredential, TimelockExpiry, TimelockStart, Transaction, TransactionBody, TransactionBuilder, TransactionHash, TransactionInput, TransactionMetadata, TransactionMetadatum, TransactionOutput, TransactionWitnessSet, Value, Vkeywitnesses } from '@emurgo/cardano-serialization-lib-nodejs';
import { Config } from './config';
import { TokenWallet } from './wallet/token-wallet';
import { ApiCoinSelectionChange, WalletsAssetsAvailable } from './models';
import { AssetWallet } from './wallet/asset-wallet';
import { exception } from 'node:console';

const phrasesLengthMap: {[key: number]: number} = {
	12: 128,
	15: 160,
	18: 192,
	21: 224,
	24: 256
}
export class Seed {
	static generateRecoveryPhrase(size: number = 15): string {
		let strength = phrasesLengthMap[size] || phrasesLengthMap[15];
		return generateMnemonic(strength).trim();
	}

	static toMnemonicList(phrase: string): Array<string> {
		return phrase.trim().split(/\s+/g);
	}

	static deriveRootKey(phrase: string | string[]): Bip32PrivateKey {
		let mnemonic = Array.isArray(phrase) ? phrase.join(" ") : phrase;
		const entropy = mnemonicToEntropy(mnemonic);
		const rootKey = Bip32PrivateKey.from_bip39_entropy(
			Buffer.from(entropy, 'hex'),
			Buffer.from(''),
		);
		return rootKey;
	}

	static deriveAccountKey(key: Bip32PrivateKey, index: number = 0): Bip32PrivateKey{
			return key
			.derive(Seed.harden(CARDANO_PUROPOSE)) // purpose
			.derive(Seed.harden(CARDANO_COIN_TYPE)) // coin type
			.derive(Seed.harden(index)); // account #0
	 }

	static deriveKey(key: Bip32PrivateKey, path: string[]): Bip32PrivateKey {
		let result = key;
		path.forEach(p => {
			result = result.derive(p.endsWith('H') || p.endsWith("'") 
				? Seed.harden(Number.parseInt(p.substr(0, p.length - 1))) 
				: Number.parseInt(p))
		});

		return result;
	}

	static buildTransaction(coinSelection: CoinSelectionWallet, ttl: number, opts: {[key: string]:  any} = {changeAddress: "", metadata: null as any, startSlot: 0, config: Config.Mainnet}): TransactionBody {
		let config = opts.config || Config.Mainnet;
		let metadata = opts.metadata;
		let startSlot = opts.startSlot || 0;
		let txBuilder = TransactionBuilder.new(
			// all of these are taken from the mainnet genesis settings
			// linear fee parameters (a*size + b)
			LinearFee.new(BigNum.from_str(config.protocolParams.minFeeA.toString()), BigNum.from_str(config.protocolParams.minFeeB.toString())),
			// minimum utxo value
			BigNum.from_str(config.protocolParams.minUTxOValue.toString()),
			// pool deposit
			BigNum.from_str(config.protocolParams.poolDeposit.toString()),
			// key deposit
			BigNum.from_str(config.protocolParams.keyDeposit.toString())
		);


		// add tx inputs
		coinSelection.inputs.forEach((input, i) => {
			let address = Address.from_bech32(input.address);
			let txInput = TransactionInput.new(
				TransactionHash.from_bytes(Buffer.from(input.id, 'hex')),
				input.index
			);
			let amount = Value.new(
				BigNum.from_str(input.amount.quantity.toString())
			);

			txBuilder.add_input(address, txInput, amount);
		});

		// add tx outputs
		coinSelection.outputs.forEach(output => {
			let address = Address.from_bech32(output.address);
			let amount = Value.new(
				BigNum.from_str(output.amount.quantity.toString())
			);

			// add tx assets
			if(output.assets && output.assets.length > 0){
				let multiAsset = Seed.buildMultiAssets(output.assets);
				amount.set_multiasset(multiAsset);
			}

			let txOutput = TransactionOutput.new(
				address,
				amount
			);
			txBuilder.add_output(txOutput);
		});

		// add tx change
		coinSelection.change.forEach(change => {
			let address = Address.from_bech32(change.address);
			let amount = Value.new(
				BigNum.from_str(change.amount.quantity.toString())
			);

			// add tx assets
			if(change.assets && change.assets.length > 0){
				let multiAsset = Seed.buildMultiAssets(change.assets);
				amount.set_multiasset(multiAsset);
			}

			let txOutput = TransactionOutput.new(
				address,
				amount
			);
			txBuilder.add_output(txOutput);
		});

		// add tx metadata
		if (metadata) {
			txBuilder.set_metadata(metadata);
		}

		// set tx validity start interval
		txBuilder.set_validity_start_interval(startSlot);

		// set tx ttl
		txBuilder.set_ttl(ttl);

		// calculate fee
		if (opts.changeAddress) { // don't take the implicit fee
			let address = Address.from_bech32(opts.changeAddress);
			txBuilder.add_change_if_needed(address);
		} else {
			let fee = coinSelection.inputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			+ (coinSelection.withdrawals?.reduce((acc, c) => c.amount.quantity + acc, 0) || 0)
			- coinSelection.outputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			- coinSelection.change.reduce((acc, c) => c.amount.quantity + acc, 0)
			- (coinSelection.deposits?.reduce((acc, c) => c.quantity + acc, 0) || 0);
			txBuilder.set_fee(BigNum.from_str(fee.toString()));
		}
		let txBody = txBuilder.build();
		return txBody;
	}

	static buildTransactionWithToken(coinSelection: CoinSelectionWallet, ttl: number, tokens: TokenWallet[], signingKeys: PrivateKey[], opts: {[key: string]: any} = {changeAddress: "", data: null as any, startSlot: 0, config: Config.Mainnet}): TransactionBody {
		let metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
		opts.config = opts.config || Config.Mainnet;
		let buildOpts = Object.assign({}, { metadata: metadata, ...opts });

		// create mint token data
		let mint = Seed.buildTransactionMint(tokens);

		// get token's scripts 
		let scripts = tokens.map(t => t.script);

		// set mint into tx
		let txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
		txBody.set_mint(mint);

		// tx field fee
		let fieldFee = parseInt(txBody.fee().to_str());

		// sign to calculate the real tx fee;
		let tx = Seed.sign(txBody, signingKeys, metadata, scripts);

		// NOTE: new fee should be equal to txFee after changed since we're only rearranging the tx bytes 
		// the marginFee value between the change utxo and the fee field;
		let txFee = parseInt(Seed.getTransactionFee(tx, opts.config).to_str());
		let marginFee = txFee - fieldFee; // if < 0 the current fee is enough, so we won't burn the dust!

		// get the change UTXO from where adjust the quantity
		let index = marginFee <= 0 ? 0 : coinSelection.change.findIndex(c => {
			let minAda = Seed.getMinUtxoValueWithAssets(c.assets, opts.config, 'hex');
			return c.amount.quantity - marginFee >= minAda;
		});

		if (index < 0) {
			throw new Error("Not enough money for minting :(");
		}
		let quantity = coinSelection.change[index].amount.quantity;
		coinSelection.change[index].amount.quantity = quantity - marginFee;
		
		// after signing the metadata is cleaned so we need to create it again
		metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
		buildOpts = Object.assign({}, { metadata: metadata, ...opts });

		txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
		txBody.set_mint(mint);

		return txBody;
	}

	static buildMultiAssets(assets: WalletsAssetsAvailable[]): MultiAsset {
		let multiAsset = MultiAsset.new();
		assets.forEach(a => {
				let asset = Assets.new();
				let scriptHash = Seed.getScriptHashFromPolicy(a.policy_id);
				asset.insert(AssetName.new(Buffer.from(a.asset_name, 'hex')), BigNum.from_str(a.quantity.toString()));
				multiAsset.insert(scriptHash, asset);
		});
		return multiAsset;
	}

	static buildTransactionMint(tokens: TokenWallet[]): Mint {
		let mint = Mint.new();
		tokens.forEach(t => {
			let mintAssets = MintAssets.new();
			let scriptHash = Seed.getScriptHashFromPolicy(t.asset.policy_id);
			mintAssets.insert(AssetName.new(Buffer.from(t.asset.asset_name)), Int.new_i32(t.asset.quantity));
			mint.insert(scriptHash, mintAssets);
		});

		return mint;
	}

	static getTransactionFee(tx: Transaction, config = Config.Mainnet) {
		return min_fee(tx, LinearFee.new(BigNum.from_str(config.protocolParams.minFeeA.toString()), BigNum.from_str(config.protocolParams.minFeeB.toString())));
	}
	
	static sign(txBody: TransactionBody, privateKeys: PrivateKey[], transactionMetadata?: TransactionMetadata, scripts?: NativeScript[]): Transaction {
		const txHash = hash_transaction(txBody);
		const witnesses = TransactionWitnessSet.new();
		const vkeyWitnesses = Vkeywitnesses.new();
		privateKeys.forEach(prvKey => {
			// add keyhash witnesses
			const vkeyWitness = make_vkey_witness(txHash, prvKey);
			vkeyWitnesses.add(vkeyWitness);
		});
		witnesses.set_vkeys(vkeyWitnesses);
		if (scripts) {
			let nativeScripts = NativeScripts.new();
			scripts.forEach(s => {
					nativeScripts.add(s);
			});
			witnesses.set_scripts(nativeScripts);
		}

		const transaction = Transaction.new(
			txBody,
			witnesses,
			transactionMetadata
		);

		return transaction;
	}

	static signMessage(key: PrivateKey, message: string): string {
		return key.sign(Buffer.from(message)).to_hex();
	}

	static verifyMessage(key: PublicKey, message: string, signed: string): boolean {
		return key.verify(Buffer.from(message), Ed25519Signature.from_hex(signed));
	}

	static harden(num: number): number{
		return 0x80000000 + num;
	}

	static constructMetadata(data: any) {
		let metadata: any = {};

		if(Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				const value = data[i];
				metadata[i] = Seed.getMetadataObject(value);
			}
		} else {
			let keys = Object.keys(data);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (this.isInteger(key)) {
					let index = parseInt(key);
					metadata[index] = Seed.getMetadataObject(data[key]);
				}
			}
		}
		return metadata;
	}

	static getMetadataObject(data:any) {
		let result: any = {};
		let type = typeof data;
		if(type == "number") {
			result[MetadateTypesEnum.Number] = data;
		} else if(type == "string" && Buffer.byteLength(data, 'utf-8') <= 64) {
			result[MetadateTypesEnum.String] = data;
		}else if(Buffer.isBuffer(data) && Buffer.byteLength(data, "hex") <= 64) {
			result[MetadateTypesEnum.Bytes] = data.toString("hex");
		} else if(type == "boolean"){
			result[MetadateTypesEnum.String] = data.toString();
		} else if(type == "undefined"){
			result[MetadateTypesEnum.String] = "undefined";
		}else if(Array.isArray(data)) {
			result[MetadateTypesEnum.List] = data.map(a => this.getMetadataObject(a));
		} else if (type == "object") {
			if (data) {
				result[MetadateTypesEnum.Map] = Object.keys(data).map(k => {
					return {
						"k": this.getMetadataObject(k),
						"v": this.getMetadataObject(data[k])
					}
				});
			} else {
				result[MetadateTypesEnum.String] = "null";
			}
		}
		return result;
	}

	static reverseMetadata(data: any, type = "object"): any {
		if (!data) {
			return null;
		}
		let metadata: any = type == "object" ? {} : [];
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let index = parseInt(key);
			metadata[index] = Seed.reverseMetadataObject(data[key]);
		}
		return metadata;
	}

	static reverseMetadataObject(data: any): any {
		let result = [];
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let value = data[key];
			if (key == "string") {
				result.push(value);
			} else if (key == "int") {
				result.push(new Number(value));
			} else if (key == "bytes") {
				result.push(Buffer.from(value, 'hex'));
			} else if (key == "list") {
				result.push(value.map((d: any) => Seed.reverseMetadataObject(d)))
			} else if (key == "map") {
				let map = value.reduce((acc: any, obj: any) => {
					let k = Seed.reverseMetadataObject(obj["k"]);
					let v = Seed.reverseMetadataObject(obj["v"]);
					acc[k] = v;
					return acc;
				}, {});
				result.push(map);
			} else {
				result.push(null);
			}
		}
		return result.length == 1 ? result[0] : result;
	}

	static buildTransactionMetadata(data: any): TransactionMetadata {
		let metadata = Seed.constructMetadata(data);
		let generalMetatada = GeneralTransactionMetadata.new();
		for (const key in metadata) {
			let value = metadata[key];
			generalMetatada.insert(BigNum.from_str(key), Seed.getTransactionMetadatum(value));
		}
		return TransactionMetadata.new(generalMetatada);
	}

	static getTransactionMetadatum(value:any): TransactionMetadatum {
		if (value.hasOwnProperty(MetadateTypesEnum.Number)) {
			return TransactionMetadatum.new_int(Int.new_i32(value[MetadateTypesEnum.Number]));
		} 
		if (value.hasOwnProperty(MetadateTypesEnum.String)) {
			return TransactionMetadatum.new_text(value[MetadateTypesEnum.String]);
		} 
		if (value.hasOwnProperty(MetadateTypesEnum.Bytes)) {
			return TransactionMetadatum.new_bytes(Buffer.from(value[MetadateTypesEnum.Bytes], 'hex'));
		} 
		if (value.hasOwnProperty(MetadateTypesEnum.List)) {
			let list = value[MetadateTypesEnum.List];
			let metalist = MetadataList.new();
			for(let i = 0; i < list.length; i++) {
				metalist.add(Seed.getTransactionMetadatum(list[i]));
			}
			return TransactionMetadatum.new_list(metalist);
		}
		if (value.hasOwnProperty(MetadateTypesEnum.Map)) {
			let map = value[MetadateTypesEnum.Map];
			let metamap = MetadataMap.new();
			for(let i = 0; i < map.length; i++) {
				let {k, v} = map[i];
				metamap.insert(Seed.getTransactionMetadatum(k), Seed.getTransactionMetadatum(v));
			}
			return TransactionMetadatum.new_map(metamap);
		}
	}

	static generateKeyPair(): Bip32KeyPair {
		let prvKey = Bip32PrivateKey.generate_ed25519_bip32();
		let pubKey = prvKey.to_public();
		let pair: Bip32KeyPair = {
			privateKey: prvKey,
			publicKey: pubKey
		}

		return pair;
	}

	// enterprise address without staking ability, for use by exchanges/etc
	static generateEnterpriseAddress(pubKey: Bip32PublicKey, network = 'mainnet'): Address {
		let networkId = network == 'mainnet' ? NetworkInfo.mainnet().network_id() : NetworkInfo.testnet().network_id();
		return EnterpriseAddress.new(networkId, StakeCredential.from_keyhash(pubKey.to_raw_key().hash())).to_address();
	} 

	static getKeyHash(key: Bip32PublicKey): Ed25519KeyHash {
		return key.to_raw_key().hash();
	}

	static buildSingleIssuerScript(keyHash: Ed25519KeyHash): NativeScript {
		let scriptPubKey = ScriptPubkey.new(keyHash);
		return NativeScript.new_script_pubkey(scriptPubKey);
	}

	static buildMultiIssuerAllScript(scripts: NativeScript[]): NativeScript {
		let nativeScripts = this.buildNativeScripts(scripts);
		let scriptAll = ScriptAll.new(nativeScripts);
		return NativeScript.new_script_all(scriptAll);
	}

	static buildMultiIssuerAnyScript(scripts: NativeScript[]): NativeScript {
		let nativeScripts = this.buildNativeScripts(scripts);
		let scriptAny = ScriptAny.new(nativeScripts);
		return NativeScript.new_script_any(scriptAny);
	}

	static buildMultiIssuerAtLeastScript(n: number, scripts: NativeScript[]): NativeScript {
		let nativeScripts = this.buildNativeScripts(scripts);
		let scriptAtLeast = ScriptNOfK.new(n, nativeScripts);
		return NativeScript.new_script_n_of_k(scriptAtLeast);
	}

	// you need to set validity range on transcation builder to check on a deterministic way
	static buildAfterScript(slot: number): NativeScript {
		let scriptAfter = TimelockStart.new(slot);
		return NativeScript.new_timelock_start(scriptAfter);
	}

	// you need to set validity range on transcation builder to check on a deterministic way
	static buildBeforeScript(slot: number): NativeScript {
		let scriptBefore = TimelockExpiry.new(slot);
		return NativeScript.new_timelock_expiry(scriptBefore);
	}

	private static buildNativeScripts(scripts: NativeScript[]): NativeScripts {
		let nativeScripts = NativeScripts.new();
		scripts.forEach(script => {
			nativeScripts.add(script);
		});
		return nativeScripts;
	}

	static getScriptHash(script: NativeScript): ScriptHash {
		let keyHash = script.hash(ScriptHashNamespace.NativeScript);
		let scriptHash = ScriptHash.from_bytes(keyHash.to_bytes());
		return scriptHash;
		// let credential = StakeCredential.from_keyhash(keyHash);
		// return credential.to_scripthash();
	}

	static getPolicyId(scriptHash: ScriptHash): string {
		return Buffer.from(scriptHash.to_bytes()).toString('hex');
	}

	static getScriptHashFromPolicy(policyId: string): ScriptHash {
		return ScriptHash.from_bytes(Buffer.from(policyId, 'hex'));
	}

	static getMinUtxoValueWithAssets(tokenAssets: AssetWallet[], config: {[key: string]: any} = Config.Mainnet, encoding: BufferEncoding = 'utf8'): number {
		let assets = Value.new(BigNum.from_str('1000000'));
		let multiAsset = MultiAsset.new();
		tokenAssets.forEach(a => {
			let asset = Assets.new();
			let assetName = a.asset_name;
			let quantity = a.quantity.toString();
			let scriptHash = Seed.getScriptHashFromPolicy(a.policy_id);
			asset.insert(AssetName.new(Buffer.from(assetName, encoding)), BigNum.from_str(quantity));
			multiAsset.insert(scriptHash, asset);
		});
		assets.set_multiasset(multiAsset);
		let min = min_ada_required(assets, BigNum.from_str(config.protocolParams.minUTxOValue.toString()));
		return Number.parseInt(min.to_str());
	}

	private static isInteger(value: any) {
		return Number.isInteger(Number(value));
	}

}

export class Bip32KeyPair{
	privateKey: Bip32PrivateKey;
	publicKey: Bip32PublicKey
}

export enum MetadateTypesEnum {
	Number = "int",
	String = "string",
	Bytes = "bytes",
	List = "list",
	Map = "map",
}

export const CARDANO_PUROPOSE = 1852;
export const CARDANO_COIN_TYPE = 1815;
export const CARDANO_EXTERNAL = 0;
export const CARDANO_CHANGE = 1;
export const CARDANO_CHIMERIC = 2;