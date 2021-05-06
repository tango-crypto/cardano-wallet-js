import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { CoinSelectionWallet } from './wallet/coin-selection-wallet';
import { getCommand } from './binaries';
import { mnemonicToEntropy } from 'bip39';
import { Address, BigNum, Bip32PrivateKey, hash_transaction, LinearFee, make_vkey_witness, PrivateKey, Transaction, TransactionBody, TransactionBuilder, TransactionHash, TransactionInput, TransactionOutput, TransactionWitnessSet, Value, Vkeywitnesses } from '@emurgo/cardano-serialization-lib-nodejs';
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
			.derive(Seed.harden(1852)) // purpose
			.derive(Seed.harden(1815)) // coin type
			.derive(Seed.harden(index)); // account #0
	 }

	static deriveKey(key: Bip32PrivateKey, path: string[]): PrivateKey {
		let result = key;
		path.forEach(p => {
			result = result.derive(p.endsWith('H') || p.endsWith("'") 
				? Seed.harden(Number.parseInt(p.substr(0, p.length - 1))) 
				: Number.parseInt(p))
		});

		return result.to_raw_key();
	}

	static buildTransaction(coinSelection: CoinSelectionWallet, ttl: number, config = Config.Mainnet): TransactionBody {
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
	
	static sign(txBody: TransactionBody, privateKeys: PrivateKey[]): Transaction {
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
			undefined, // transaction metadata
		);

		return transaction;
	}

	static harden(num: number): number{
		return 0x80000000 + num;
	}
}