import { CoinSelectionWallet } from './wallet/coin-selection-wallet';
import { generateMnemonic, mnemonicToEntropy } from 'bip39';
import { Address, AssetName, Assets, AuxiliaryData, AuxiliaryDataHash, BaseAddress, BigNum, Bip32PrivateKey, Bip32PublicKey, Ed25519KeyHash, Ed25519Signature, EnterpriseAddress, GeneralTransactionMetadata, hash_auxiliary_data, hash_transaction, Int, LinearFee, make_vkey_witness, MetadataList, MetadataMap, Mint, MintAssets, min_ada_required, min_fee, MultiAsset, NativeScript, NativeScripts, NetworkInfo, PrivateKey, PublicKey, ScriptAll, ScriptAny, ScriptHash, ScriptHashNamespace, ScriptNOfK, ScriptPubkey, StakeCredential, TimelockExpiry, TimelockStart, Transaction, TransactionBody, TransactionBuilder, TransactionBuilderConfigBuilder, TransactionHash, TransactionInput, TransactionInputs, TransactionMetadatum, TransactionOutput, TransactionOutputs, TransactionWitnessSet, Value, Vkeywitnesses } from '@emurgo/cardano-serialization-lib-nodejs';
import { Mainnet, Testnet } from './config/network.config';
import { TokenWallet } from './wallet/token-wallet';
import { ApiCoinSelectionChange, WalletsAssetsAvailable } from './models';
import { AssetWallet } from './wallet/asset-wallet';
import { Script } from './models/script.model';
import { JsonScript, ScriptTypeEnum, scriptTypes } from './models/json-script.model';
import { ExtendedSigningKey } from './models/payment-extended-signing-key';
import { MultisigTransaction } from './models/multisig-transaction';

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

	static buildTransaction(coinSelection: CoinSelectionWallet, ttl: number, opts: {[key: string]:  any} = {changeAddress: "", metadata: null as any, startSlot: 0, config: Mainnet}): TransactionBody {
		let config = opts.config || Mainnet;
		let metadata = opts.metadata;
		let startSlot = opts.startSlot || 0;
		let tbConfig = TransactionBuilderConfigBuilder.new()
		// all of these are taken from the mainnet genesis settings
		// linear fee parameters (a*size + b)
		.fee_algo(LinearFee.new(toBigNum(config.protocols.txFeePerByte), toBigNum(config.protocols.txFeeFixed)))
		//min-ada-value
		.coins_per_utxo_word(toBigNum(config.protocols.utxoCostPerWord))
		// pool deposit
		.pool_deposit(toBigNum(config.protocols.stakePoolDeposit))
		// key deposit
		.key_deposit(toBigNum(config.protocols.stakeAddressDeposit))
		// max output value size
		.max_value_size(config.protocols.maxValueSize)
		// max tx size
		.max_tx_size(config.protocols.maxTxSize)
		.build();

		let txBuilder = TransactionBuilder.new(tbConfig);

		// add tx inputs
		coinSelection.inputs.forEach((input, i) => {
			let address = Address.from_bech32(input.address);
			let txInput = TransactionInput.new(
				TransactionHash.from_bytes(Buffer.from(input.id, 'hex')),
				input.index
			);
			let amount = Value.new(
				toBigNum(input.amount.quantity)
			);

			txBuilder.add_input(address, txInput, amount);
		});

		// add tx outputs
		coinSelection.outputs.forEach(output => {
			let address = Address.from_bech32(output.address);
			let amount = Value.new(
				toBigNum(output.amount.quantity)
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
				toBigNum(change.amount.quantity)
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
			txBuilder.set_auxiliary_data(metadata);
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
			let fee =  opts.fee || coinSelection.inputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			+ (coinSelection.withdrawals?.reduce((acc, c) => c.amount.quantity + acc, 0) || 0)
			- coinSelection.outputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			- coinSelection.change.reduce((acc, c) => c.amount.quantity + acc, 0)
			- (coinSelection.deposits?.reduce((acc, c) => c.quantity + acc, 0) || 0);
			txBuilder.set_fee(toBigNum(fee));
		}
		let txBody = txBuilder.build();
		return txBody;
	}

	static buildTransactionWithToken(coinSelection: CoinSelectionWallet, ttl: number, tokens: TokenWallet[], signingKeys: PrivateKey[], opts: {[key: string]: any} = {changeAddress: "", data: null as any, startSlot: 0, config: Mainnet}, encoding: BufferEncoding = 'hex'): TransactionBody {
		let metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
		opts.config = opts.config || Mainnet;
		// set maximun fee first
		const fee = parseInt(opts.config.protocols.maxTxSize * opts.config.protocols.txFeePerByte + opts.config.protocols.txFeeFixed); // 16384 * 44 + 155381 = 876277
		if (!opts.fee) {
			opts.fee = fee;
			// adjust change if there is any
			if (coinSelection.change && coinSelection.change.length > 0) {
				const selectionfee = coinSelection.inputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
				+ (coinSelection.withdrawals?.reduce((acc, c) => c.amount.quantity + acc, 0) || 0)
				- coinSelection.outputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
				- coinSelection.change.reduce((acc, c) => c.amount.quantity + acc, 0)
				- (coinSelection.deposits?.reduce((acc, c) => c.quantity + acc, 0) || 0);
	
				const feePerChange = Math.ceil((opts.fee - selectionfee)/coinSelection.change.length);
				coinSelection.change = coinSelection.change.map(change => {
					change.amount.quantity -= feePerChange;
					return change;
				});
			}
		}


		let buildOpts = Object.assign({}, { metadata: metadata, ...opts });

		// create mint token data
		let mint = Seed.buildTransactionMint(tokens, encoding);

		// get token's scripts 
		let scripts = tokens.map(t => t.script);

		// set mint into tx
		let txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
		txBody.set_mint(mint);

		// sign to calculate the real tx fee;
		let tx = Seed.sign(txBody, signingKeys, metadata, scripts);

		// NOTE: txFee should be <= original fee = maxTxSize * txFeePerByte + txFeeFixed
        // Also after rearrange the outputs will decrease along with fee field, so new tx fee won't increase because tx's size (bytes) will be smaller;
		const txFee = parseInt(Seed.getTransactionFee(tx, opts.config).to_str());
		// if (txFee > fee) throw new Error(`expected tx size less than ${opts.config.protocols.maxTxSize} but got: ${(txFee - opts.config.protocols.txFeeFixed)/opts.config.protocols.txFeePerByte}`)
		
		const finalFee = txFee;
		// const finalFee = Math.min(txFee, (fee || Number.MAX_SAFE_INTEGER)); // we'll use the min fee on final tx
		opts.fee = finalFee;

		// adjust change UTXO
		const feeDiff = fee - finalFee;
		if (coinSelection.change && coinSelection.change.length > 0) {
			const feeDiffPerChange = Math.ceil(feeDiff/coinSelection.change.length);
			coinSelection.change = coinSelection.change.map(c => {
				c.amount.quantity += feeDiffPerChange;
				return c;
			});
		}
		
		// after signing the metadata is cleaned so we need to create it again
		metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
		buildOpts = Object.assign({}, { metadata: metadata, ...opts });

		txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
		txBody.set_mint(mint);

		return txBody;
	}

	static buildTransactionMultisig(coinSelection: CoinSelectionWallet, ttl: number, scripts: NativeScript[], tokens: TokenWallet[] = null, signingKeys: PrivateKey[] = null, opts: {[key: string]:  any} = {changeAddress: "", data: null, startSlot: 0, config: Mainnet}, encoding: BufferEncoding = 'hex'): MultisigTransaction {
		const config = opts.config || Mainnet;
		let metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
		const startSlot = opts.startSlot || 0;
		const selectionfee = parseInt(config.protocols.maxTxSize * config.protocols.txFeePerByte + config.protocols.txFeeFixed); // 16384 * 44 + 155381 = 876277
		const currentfee = coinSelection.inputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			+ (coinSelection.withdrawals?.reduce((acc, c) => c.amount.quantity + acc, 0) || 0)
			- coinSelection.outputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
			- coinSelection.change.reduce((acc, c) => c.amount.quantity + acc, 0)
			- (coinSelection.deposits?.reduce((acc, c) => c.quantity + acc, 0) || 0);

		// add witnesses Ed25519KeyHash from input addresses
		const vkeys: {[key: string]: number} = {};

		// add tx inputs
		const inputs = coinSelection.inputs.map((input, i) => {
			// check if input is vkeywitness
			const addr = Address.from_bech32(input.address);
			const baseAddr = BaseAddress.from_address(addr);
			const inputHash = baseAddr.payment_cred().to_keyhash();
			if (inputHash) {
				vkeys[inputHash.to_bech32('vkey_')] = (vkeys[inputHash.to_bech32('vkey_')] || 0) + 1;
			} 

			return TransactionInput.new(
				TransactionHash.from_bytes(Buffer.from(input.id, 'hex')),
				input.index
			);
		});	

		// add tx outputs
		let outputs = coinSelection.outputs.map(output => {
			let address = Address.from_bech32(output.address);
			let amount = Value.new(
				toBigNum(output.amount.quantity)
			);

			// add tx assets
			if(output.assets && output.assets.length > 0){
				let multiAsset = Seed.buildMultiAssets(output.assets, encoding);
				amount.set_multiasset(multiAsset);
			}

			return TransactionOutput.new(
				address,
				amount
			);
		});

		// adjust changes to match maximum fee
		if (coinSelection.change && coinSelection.change.length > 0) {
			const feeDiff = selectionfee - currentfee;
            const feeDiffPerChange = Math.abs(Math.ceil(feeDiff/coinSelection.change.length));
			for (let i = 0; i < coinSelection.change.length; i++) {
				const change = coinSelection.change[i];
				change.amount.quantity = feeDiff > 0 ? change.amount.quantity - feeDiffPerChange : change.amount.quantity + feeDiffPerChange;

				let address = Address.from_bech32(change.address);
				let amount = Value.new(
					toBigNum(change.amount.quantity)
				);
	
				// add tx assets
				if(change.assets && change.assets.length > 0){
					let multiAsset = Seed.buildMultiAssets(change.assets, encoding);
					amount.set_multiasset(multiAsset);
				}
	
				const out = TransactionOutput.new(
					address,
					amount
				);

				outputs.push(out);
			}
		}

		const txInputs = TransactionInputs.new();
		inputs.forEach(txin => txInputs.add(txin));
		let txOutputs = TransactionOutputs.new();
		outputs.forEach(txout => txOutputs.add(txout));
		const txBody = TransactionBody.new(txInputs, txOutputs, toBigNum(selectionfee), ttl);

		// add tx metadata
		if (metadata) {
			const dataHash = hash_auxiliary_data(metadata);
			txBody.set_auxiliary_data_hash(dataHash)
		}

		if (tokens) {
			// create mint token data
			const mint = Seed.buildTransactionMint(tokens, encoding);
			txBody.set_mint(mint);
		}

		// set tx validity start interval
		txBody.set_validity_start_interval(startSlot);
		const numOfWitnesses = Object.values(vkeys).reduce((total, cur) => total + cur, 0) + scripts.reduce((t, c) => t + c.get_required_signers().len(), 0);
		return MultisigTransaction.new(coinSelection, txBody, scripts, signingKeys, numOfWitnesses, config, encoding, metadata, tokens);
	}

	static buildMultiAssets(assets: WalletsAssetsAvailable[], encoding: BufferEncoding = 'hex'): MultiAsset {
		let multiAsset = MultiAsset.new();
		const groups = assets.reduce((dict: {[key: string]: WalletsAssetsAvailable[]}, asset: WalletsAssetsAvailable) => {
			(dict[asset.policy_id] = dict[asset.policy_id] || []).push(asset);
			return dict;
		}, {});
		for (const policy_id in groups) {
			const scriptHash = Seed.getScriptHashFromPolicy(policy_id);
			let asset = Assets.new();
			const assetGroups = groups[policy_id].reduce((dict: {[key: string]: number}, asset: WalletsAssetsAvailable) => {
				dict[asset.asset_name] = (dict[asset.asset_name] || 0) + +asset.quantity;
				return dict;
			}, {});
			for (const asset_name in assetGroups) {
				const quantity = assetGroups[asset_name];
			 	const assetName = AssetName.new(Buffer.from(asset_name, encoding));
				asset.insert(assetName, toBigNum(quantity));
			}
			multiAsset.insert(scriptHash, asset);
		}
		return multiAsset;
	}

	static buildTransactionMint(tokens: TokenWallet[], encoding: BufferEncoding = 'utf8'): Mint {
		let mint = Mint.new();
		const groups = tokens.reduce((dict: {[key: string]: TokenWallet[]}, asset: TokenWallet) => {
			(dict[asset.asset.policy_id] = dict[asset.asset.policy_id] || []).push(asset);
			return dict;
		}, {});
		for (const policy_id in groups) {
			const scriptHash = Seed.getScriptHashFromPolicy(policy_id);
			let mintAssets = MintAssets.new();
			const assetGroups = groups[policy_id].reduce((dict: {[key: string]: number}, asset: TokenWallet) => {
				dict[asset.asset.asset_name] = (dict[asset.asset.asset_name] || 0) + +asset.asset.quantity;
				return dict;
			}, {});
			for (const asset_name in assetGroups) {
				const quantity = assetGroups[asset_name];
			 	const assetName = AssetName.new(Buffer.from(asset_name, encoding));
				mintAssets.insert(assetName, Int.new(toBigNum(quantity)));
			}
			mint.insert(scriptHash, mintAssets);
		}
		return mint;
	}

	static getTransactionFee(tx: Transaction, config = Mainnet) {
		return min_fee(tx, LinearFee.new(toBigNum(config.protocols.txFeePerByte), toBigNum(config.protocols.txFeeFixed)));
	}

	static addKeyWitness(transaction: Transaction, prvKey: PrivateKey): Transaction {
		const vkeyWitnesses = Vkeywitnesses.new();
		const txBody = transaction.body();
		const txHash = hash_transaction(txBody);
		const vkeyWitness = make_vkey_witness(txHash, prvKey);
		vkeyWitnesses.add(vkeyWitness);
		const witnesses = transaction.witness_set();
		witnesses.set_vkeys(vkeyWitnesses);
		return Transaction.new(
			txBody,
			witnesses,
			transaction.auxiliary_data()
		);
	}

	static addScriptWitness(transaction: Transaction, script: NativeScript): Transaction {
		const txBody = transaction.body();
		const nativeScripts = NativeScripts.new();
		nativeScripts.add(script);
		const witnesses = transaction.witness_set();
		witnesses.set_native_scripts(nativeScripts);
		return Transaction.new(
			txBody,
			witnesses,
			transaction.auxiliary_data()
		);
	}
	
	static sign(txBody: TransactionBody, privateKeys: PrivateKey[], transactionMetadata?: AuxiliaryData, scripts?: NativeScript[]): Transaction {
		const txHash = hash_transaction(txBody);
		const witnesses = TransactionWitnessSet.new();
		const vkeyWitnesses = Vkeywitnesses.new();
		if (privateKeys) {
			privateKeys.forEach(prvKey => {
				// add keyhash witnesses
				const vkeyWitness = make_vkey_witness(txHash, prvKey);
				vkeyWitnesses.add(vkeyWitness);
			});
		}
		witnesses.set_vkeys(vkeyWitnesses);
		if (scripts) {
			let nativeScripts = NativeScripts.new();
			scripts.forEach(s => {
				nativeScripts.add(s);
			});
			witnesses.set_native_scripts(nativeScripts);
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

	static getTxId(transaction: Transaction): string {
		const txBody = transaction.body();
		const txHash = hash_transaction(txBody);
		const txId = Buffer.from(txHash.to_bytes()).toString('hex');
		return txId;
	}

	static convertPrivateKeyToSignKey(prkKey: Bip32PrivateKey): ExtendedSigningKey {
		// const k = Bip32PrivateKey.from_bech32(scriptKeys[1]);
		console.log(prkKey.to_bech32());
		// const hex = Buffer.from(prkKey.to_raw_key().as_bytes()).toString('hex');
		const cborHex = "5880" + Buffer.from(prkKey.to_128_xprv()).toString('hex');
		return new ExtendedSigningKey(cborHex);
		// console.log(hex);
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

	static buildTransactionMetadata(data: any): AuxiliaryData {
		let metadata = Seed.constructMetadata(data);
		let generalMetatada = GeneralTransactionMetadata.new();
		for (const key in metadata) {
			let value = metadata[key];
			generalMetatada.insert(BigNum.from_str(key), Seed.getTransactionMetadatum(value));
		}
		let auxiliaryData = AuxiliaryData.new();
        auxiliaryData.set_metadata(generalMetatada);
        return auxiliaryData;
	}


	static getTransactionMetadatum(value:any): TransactionMetadatum {
		if (value.hasOwnProperty(MetadateTypesEnum.Number)) {
			return TransactionMetadatum.new_int(Int.new(toBigNum(value[MetadateTypesEnum.Number])));
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

	static generateBip32PrivateKey(): Bip32PrivateKey {
		return Bip32PrivateKey.generate_ed25519_bip32();
	}

	// enterprise address without staking ability, for use by exchanges/etc
	static getEnterpriseAddress(pubKey: Bip32PublicKey, network = 'mainnet'): Address {
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

	static getNativeScripts(script: Script): NativeScript[] {
		const result: NativeScript[] = [];
		const kind = script.root.kind();
		if (kind == 0) { // sig
			result.push(script.root)
		} else if (kind == 1 || kind == 2 || kind == 3) { // all, any and atLeast respectivetly
			result.push(...script.scripts.map(s => s.root));
		}
		return result;
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

	static getMinUtxoValueWithAssets(tokenAssets: AssetWallet[], config: any = Mainnet, encoding: BufferEncoding = 'utf8'): number {
		let assets = Value.new(toBigNum(1000000));
		let multiAsset = MultiAsset.new();
		const groups = tokenAssets.reduce((dict: {[key: string]: AssetWallet[]}, asset: AssetWallet) => {
			(dict[asset.policy_id] = dict[asset.policy_id] || []).push(asset);
			return dict;
		}, {});
		for (const policy_id in groups) {
			const scriptHash = Seed.getScriptHashFromPolicy(policy_id);
			let asset = Assets.new();
			groups[policy_id].forEach(a => {
				asset.insert(AssetName.new(Buffer.from(a.asset_name, encoding)), toBigNum(a.quantity));
			});
			multiAsset.insert(scriptHash, asset);
		}
		assets.set_multiasset(multiAsset);
		let min = min_ada_required(assets, false, toBigNum(config.protocols.utxoCostPerWord));
		return Number.parseInt(min.to_str());
	}

	// static buildMultisigJsonScript(type: ScriptTypeEnum, witnesses: number = 2): JsonScript {

	// 	if (lock) {
	// 		return {
	// 			type: ScriptTypeEnum.All,
	// 			scripts: [
	// 				{
	// 					type: ScriptTypeEnum.Sig
	// 				},
	// 				{
	// 					type: ScriptTypeEnum.Before,
	// 					lockTime: new Date(lockTime).getTime()
	// 				}
	// 			]
	// 		}
	// 	} else {
	// 		return {type: ScriptTypeEnum.Sig}
	// 	}
	// }
    
    static buildScript(json: JsonScript, currentSlot?: number): Script {
        if (json.type === ScriptTypeEnum.Sig) { // Single Issuer
            let keyPair: Bip32KeyPair; // needed to get the signing keys when export (e.g toJSON)
            let keyHash: Ed25519KeyHash;
            if (!json.keyHash) {
                keyPair = Seed.generateKeyPair();
                keyHash = Seed.getKeyHash(keyPair.publicKey);
            } else {
                keyHash = Ed25519KeyHash.from_bytes(Buffer.from(json.keyHash, 'hex'));
            }
            return { root: Seed.buildSingleIssuerScript(keyHash), keyHash: Buffer.from(keyHash.to_bytes()).toString('hex'), keyPair: keyPair, scripts: [] };
        }
        if(json.type === ScriptTypeEnum.All) { // Multiple Issuer All
            let scripts = json.scripts.map(s => Seed.buildScript(s, currentSlot));
            return { root: Seed.buildMultiIssuerAllScript(scripts.map(s => s.root)), scripts: scripts };
        }
        if(json.type === ScriptTypeEnum.Any) { // Multiple Issuer Any
            let scripts = json.scripts.map(s => Seed.buildScript(s, currentSlot));
            return { root: Seed.buildMultiIssuerAnyScript(scripts.map(s => s.root)), scripts: scripts };
        }
        if(json.type === ScriptTypeEnum.AtLeast) { // Multiple Issuer At least
            let scripts = json.scripts.map(s => Seed.buildScript(s, currentSlot));
            let n = json.require;
            return { root: Seed.buildMultiIssuerAtLeastScript(n, scripts.map(s => s.root)), scripts: scripts };
        }
        if (json.type === ScriptTypeEnum.After) { // After
            let slot = 0;
            if (!json.slot) {
                slot = currentSlot; // after now
                let lockTime = json.lockTime;
                if (lockTime != 'now'){
                    let now = Date.now();
                    let datetime = new Date(lockTime).getTime();
                    slot = currentSlot + Math.floor((datetime - now)/1000);
                }
            } else {
                slot = json.slot;
            }
            return { root: Seed.buildAfterScript(slot), slot: slot, scripts: [] }
        }
        if (json.type === ScriptTypeEnum.Before) { // Before
            let slot = 0;
            if (!json.slot) {
                let lockTime = json.lockTime;
                slot = currentSlot + 180; // only 3 min to mint tokens
                if (lockTime != 'now'){
                    let now = Date.now();
                    let datetime = new Date(lockTime).getTime();
                    slot = currentSlot + Math.floor((datetime - now)/1000);
                }
            } else {
                slot = json.slot;
            }
            return { root: Seed.buildBeforeScript(slot), slot: slot, scripts: [] }
        }
    }

	static scriptToJson(script: Script): any {
		let result: any = { };
		result.type = scriptTypes[script.root.kind()];
		if (script.keyHash) {
			result.keyHash = script.keyHash;
		} 
		if(result.type === 'atLeast') { // Multiple Issuer At least)
			result.require = script.root.as_script_n_of_k().n();
		}
		if (result.type === 'after' || result.type === 'before') {
			result.slot = script.slot;
		}
		if(script.scripts && script.scripts.length > 0) {
			result.scripts = script.scripts.map(s => Seed.scriptToJson(s));
		}
		return result;
	}

	static getScriptKeys(script: Script): Bip32PrivateKey[] {
		let result: Bip32PrivateKey[] = [];
		if(script.keyPair) {
			// let prvKey = Bip32PrivateKey.from_bech32(script.signingKey);
			// let pubKey = prvKey.to_public();
			// result.push({ publicKey: pubKey, privateKey: prvKey});
			result.push(script.keyPair.privateKey);
		}
		script.scripts.forEach(s => {
			result.push(...Seed.getScriptKeys(s));
		})
		return result;
	}

	static getScriptAddress(script: Script, network = 'mainnet'): Address {
		let networkId = network == 'mainnet' ? NetworkInfo.mainnet().network_id() : NetworkInfo.testnet().network_id();
		const scriptHash = this.getScriptHash(script.root);
		const credential = StakeCredential.from_scripthash(scriptHash);
		return BaseAddress.new(networkId, credential, credential).to_address();
	}

    static getPolicyScriptId(script: Script): string {
        let scriptHash = Seed.getScriptHash(script.root);
        return Buffer.from(scriptHash.to_bytes()).toString('hex');
    }

	static findSlots(script: Script): {start?: number, end?: number} {
		let result: {start?: number, end?: number} = {};
		let type = script.root.kind();
		if (type === 4) { //after
			result.start = script.slot;
		} else if(type === 5) { //before
			result.end = script.slot;
		} else {
			let slots = script.scripts.map(s => Seed.findSlots(s));
			result.start = slots.reduce((max, act) => !act.start && !max ? max : Math.max(act.start, max), result.start);
			result.end = slots.reduce((min, act) => !act.end ? min : !min ? act.end : Math.min(act.end, min), result.end);
		}
		return result;
	}

	private static isInteger(value: any) {
		return Number.isInteger(Number(value));
	}

}

function toBigNum(quantity: number): BigNum {
	return BigNum.from_str(quantity.toString());
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