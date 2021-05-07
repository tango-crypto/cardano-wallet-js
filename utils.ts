import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { CoinSelectionWallet } from './wallet/coin-selection-wallet';
import { getCommand } from './binaries';
import { mnemonicToEntropy } from 'bip39';
import { Address, BigNum, Bip32PrivateKey, Ed25519Signature, GeneralTransactionMetadata, hash_metadata, hash_transaction, Int, LinearFee, make_vkey_witness, MetadataList, MetadataMap, PrivateKey, PublicKey, Transaction, TransactionBody, TransactionBuilder, TransactionHash, TransactionInput, TransactionMetadata, TransactionMetadatum, TransactionOutput, TransactionWitnessSet, Value, Vkeywitnesses } from '@emurgo/cardano-serialization-lib-nodejs';
import { Config } from './config';

const cardano_address_cmd = getCommand('cardano-address');
export class Seed {
	static generateRecoveryPhrase(size: number = 15): string {
		const ls = spawnSync(cardano_address_cmd, ['recovery-phrase', 'generate', '--size', size.toString()], {});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static toMnemonicList(phrase: string): Array<string> {
		return phrase.split(/\s+/);
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

	static buildTransaction(coinSelection: CoinSelectionWallet, ttl: number, data?: TransactionMetadata, config = Config.Mainnet): TransactionBody {
		const protocolParams = config.protocolParams;
		let txBuilder = TransactionBuilder.new(
			// all of these are taken from the mainnet genesis settings
			// linear fee parameters (a*size + b)
			LinearFee.new(BigNum.from_str(protocolParams.minFeeA.toString()), BigNum.from_str(protocolParams.minFeeB.toString())),
			// minimum utxo value
			BigNum.from_str(protocolParams.minUTxOValue.toString()),
			// pool deposit
			BigNum.from_str(protocolParams.poolDeposit.toString()),
			// key deposit
			BigNum.from_str(protocolParams.keyDeposit.toString())
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
			let txOutput = TransactionOutput.new(
				address,
				amount
			);
			txBuilder.add_output(txOutput);
		});

		// add tx metadata
		if (data) {
			txBuilder.set_metadata(data);
		}

		// set tx ttl
		txBuilder.set_ttl(ttl);

		// set tx fee
		let fee = coinSelection.inputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
		- coinSelection.outputs.reduce((acc, c) => c.amount.quantity + acc, 0) 
		- coinSelection.change.reduce((acc, c) => c.amount.quantity + acc, 0);
		txBuilder.set_fee(BigNum.from_str(fee.toString()));

		let txBody = txBuilder.build();
		return txBody;
	}
	
	static sign(txBody: TransactionBody, privateKeys: PrivateKey[], transactionMetadata?: TransactionMetadata): Transaction {
		const txHash = hash_transaction(txBody);
		const witnesses = TransactionWitnessSet.new();
		const vkeyWitnesses = Vkeywitnesses.new();
		privateKeys.forEach(prvKey => {
			// add keyhash witnesses
			const vkeyWitness = make_vkey_witness(txHash, prvKey);
			vkeyWitnesses.add(vkeyWitness);
		});
		witnesses.set_vkeys(vkeyWitnesses);

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
				let index = parseInt(key);
				if(!isNaN(index)) {
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
						"k": isNaN(parseInt(k)) ? this.getMetadataObject(k) : this.getMetadataObject(parseInt(k)),
						"v": this.getMetadataObject(data[k])
					}
				});
			} else {
				result[MetadateTypesEnum.String] = "null";
			}
		}
		return result;
	}

	static construcTransactionMetadata(data: any): TransactionMetadata {
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