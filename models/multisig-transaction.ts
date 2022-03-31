import { Address, AuxiliaryData, BigNum, Bip32PrivateKey, hash_auxiliary_data, hash_transaction, LinearFee, make_vkey_witness, min_fee, NativeScript, NativeScripts, PrivateKey, Transaction, TransactionBody, TransactionHash, TransactionOutput, TransactionOutputs, TransactionWitnessSet, Value, Vkey, Vkeywitness, Vkeywitnesses } from "@emurgo/cardano-serialization-lib-nodejs";
import { Seed } from "../utils";
import { CoinSelectionWallet } from "../wallet/coin-selection-wallet";
import { TokenWallet } from "../wallet/token-wallet";

export class MultisigTransaction {
    txBody: TransactionBody;
    vkeyWitnesses: Vkeywitnesses;
    nativeScripts: NativeScripts;
    metadata: AuxiliaryData;
    txHash: TransactionHash;

    constructor() {
        this.vkeyWitnesses = Vkeywitnesses.new();
        this.nativeScripts = NativeScripts.new();
    }

    static new(coinSelection: CoinSelectionWallet, txBody: TransactionBody, scripts: NativeScript[], privateKeys: PrivateKey[], numberOfWitnesses: number, config: any, encoding: BufferEncoding, metadata?: AuxiliaryData, tokens?: TokenWallet[]): MultisigTransaction {
        const multisig = new MultisigTransaction();
        multisig.metadata = metadata;

        scripts.forEach(s => {
            multisig.nativeScripts.add(s);
        });

        multisig.txBody = multisig.adjustFee(txBody, coinSelection, tokens, numberOfWitnesses, config, encoding);
        multisig.txHash = hash_transaction(multisig.txBody);

        privateKeys.forEach(prvKey => {
            // add keyhash witnesses
            const vkeyWitness = make_vkey_witness(multisig.txHash, prvKey);
            multisig.vkeyWitnesses.add(vkeyWitness);
        });

        return multisig
    }

    addKeyWitnesses(...privateKeys: PrivateKey[]): void {
        privateKeys.forEach(prvKey => {
            // add keyhash witnesses
            const vkeyWitness = make_vkey_witness(this.txHash, prvKey);
            this.vkeyWitnesses.add(vkeyWitness);
        });
	}

    adjustFee(txBody: TransactionBody, coinSelection: CoinSelectionWallet, tokens: TokenWallet[], numberOfWitnesses: number, config: any, encoding: BufferEncoding): TransactionBody {
        const bodyFee = parseInt(txBody.fee().to_str());
        const tx = this.fakeTx(txBody, numberOfWitnesses);
        const txFee = this.txFee(tx, config);

        console.log(`Fees: initial = ${bodyFee}, adjusted = ${txFee}`);
        if (txFee < bodyFee) {
            const feeDiff = bodyFee - txFee;
            const feeDiffPerChange = Math.ceil(feeDiff/coinSelection.change.length);
			const change = coinSelection.change.map(c => {
				c.amount.quantity += feeDiffPerChange;
				return c;
			});

            const outputs = coinSelection.outputs.map(output => {
				let address = Address.from_bech32(output.address);
				let amount = Value.new(
					BigNum.from_str(output.amount.quantity.toString())
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

            outputs.push(...change.map(ch => {
				let address = Address.from_bech32(ch.address);
				let amount = Value.new(
					BigNum.from_str(ch.amount.quantity.toString())
				);
	
				// add tx assets
				if(ch.assets && ch.assets.length > 0){
					let multiAsset = Seed.buildMultiAssets(ch.assets, encoding);
					amount.set_multiasset(multiAsset);
				}
	
				return TransactionOutput.new(
					address,
					amount
				);
			}));

            const txOutputs = TransactionOutputs.new();
			outputs.forEach(txout => txOutputs.add(txout));
            console.log('Final change:', change);
            const body = TransactionBody.new(txBody.inputs(), txOutputs, BigNum.from_str(txFee.toString()), txBody.ttl());

            // metadata
            if (this.metadata) {
                const dataHash = hash_auxiliary_data(this.metadata);
                body.set_auxiliary_data_hash(dataHash);
            }
            
            // mint tokens
            if (tokens) {
                const mint = Seed.buildTransactionMint(tokens, encoding);
                body.set_mint(mint);
            }

            // set tx validity start interval
		    body.set_validity_start_interval(txBody.validity_start_interval());
           
            return body;

        } else {
            return txBody;
        }
    }

    build(): string {
        const witnesses = TransactionWitnessSet.new();
        witnesses.set_vkeys(this.vkeyWitnesses);
		if (this.nativeScripts.len() > 0) {
			witnesses.set_native_scripts(this.nativeScripts);
		}
        
		const tx = Transaction.new(
			this.txBody,
			witnesses,
			this.metadata
		);

        return Buffer.from(tx.to_bytes()).toString('hex');
    }

    toBytes(): Uint8Array {
        const encoder = new TextEncoder();
        const keys = Array.from(Array(this.vkeyWitnesses.len()).keys()).map(i => this.vkeyWitnesses.get(i).to_bytes()).map(k => MultisigTransaction.buff2hex(k));
        const scripts = Array.from(Array(this.nativeScripts.len()).keys()).map(i => this.nativeScripts.get(i).to_bytes()).map(s =>
            MultisigTransaction.buff2hex(s));
        const data = {
            body: MultisigTransaction.buff2hex(this.txBody.to_bytes()),
            keys: keys,
            scripts: scripts,
            metadata: this.metadata ? MultisigTransaction.buff2hex(this.metadata.to_bytes()): null
        };
        return encoder.encode(JSON.stringify(data));
    }

    static fromBytes(bytes: Uint8Array): MultisigTransaction {
        const decoder = new TextDecoder();
        const { body, keys, scripts, metadata } = JSON.parse(decoder.decode(bytes));
        const multisig = new MultisigTransaction();
        multisig.txBody = TransactionBody.from_bytes(MultisigTransaction.hexToBuff(body));
        multisig.txHash = hash_transaction(multisig.txBody);
        multisig.metadata = metadata ? AuxiliaryData.from_bytes(MultisigTransaction.hexToBuff(metadata)) : null;
        const vKyes: Vkeywitness[] = keys.map((k:any) => Vkeywitness.from_bytes(MultisigTransaction.hexToBuff(k)));
        for (const key of vKyes) {
            multisig.vkeyWitnesses.add(key);
        }
        const nScripts: NativeScript[] = scripts.map((k:any) => NativeScript.from_bytes(MultisigTransaction.hexToBuff(k)));
        for (const script of nScripts) {
            multisig.nativeScripts.add(script);
        }

        return multisig;
    }

    private static buff2hex(buffer: Uint8Array): string { // buffer is an ArrayBuffer
    return Array.from(buffer.values())
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }

    private static hexToBuff(hexString: string) {
        return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    }

    private txFee(tx: Transaction, config: any) {
        return parseInt(min_fee(tx, 
            LinearFee.new(BigNum.from_str(config.protocols.txFeePerByte.toString()), BigNum.from_str(config.protocols.txFeeFixed.toString()))).to_str());
    }

    private fakeTx(txBody: TransactionBody, numberOfWitnesses: number) {
        const fakeWitnesses = Vkeywitnesses.new();
        const fakeKey = this.fakePrivateKey();
        const rawKey = fakeKey.to_raw_key();
        // const txHash = hash_transaction(txBody);
        const fakeVkeyWitness = Vkeywitness.new(
            Vkey.new(rawKey.to_public()),
            // rawKey.sign(txHash.to_bytes())
            rawKey.sign(Buffer.from(Array.from(Array(100).keys())))
        );
        for (let i = 0; i < numberOfWitnesses; i++) {
            fakeWitnesses.add(fakeVkeyWitness);
        }

        const witnessSet = TransactionWitnessSet.new();
        witnessSet.set_vkeys(fakeWitnesses);
        if (this.nativeScripts.len() > 0) {
            witnessSet.set_native_scripts(this.nativeScripts);
        }

        const cloneMetadata = this.metadata ? AuxiliaryData.from_bytes(this.metadata.to_bytes()) : null;
        const tx = Transaction.new(
            txBody,
            witnessSet,
            cloneMetadata
        );
        return tx;
    }

    private fakePrivateKey(): Bip32PrivateKey {
        return Bip32PrivateKey.from_bytes(
            Buffer.from([0xb8, 0xf2, 0xbe, 0xce, 0x9b, 0xdf, 0xe2, 0xb0, 0x28, 0x2f, 0x5b, 0xad, 0x70, 0x55, 0x62, 0xac, 0x99, 0x6e, 0xfb, 0x6a, 0xf9, 0x6b, 0x64, 0x8f,
                0x44, 0x45, 0xec, 0x44, 0xf4, 0x7a, 0xd9, 0x5c, 0x10, 0xe3, 0xd7, 0x2f, 0x26, 0xed, 0x07, 0x54, 0x22, 0xa3, 0x6e, 0xd8, 0x58, 0x5c, 0x74, 0x5a,
                0x0e, 0x11, 0x50, 0xbc, 0xce, 0xba, 0x23, 0x57, 0xd0, 0x58, 0x63, 0x69, 0x91, 0xf3, 0x8a, 0x37, 0x91, 0xe2, 0x48, 0xde, 0x50, 0x9c, 0x07, 0x0d,
                0x81, 0x2a, 0xb2, 0xfd, 0xa5, 0x78, 0x60, 0xac, 0x87, 0x6b, 0xc4, 0x89, 0x19, 0x2c, 0x1e, 0xf4, 0xce, 0x25, 0x3c, 0x19, 0x7e, 0xe2, 0x19, 0xa4]
            )
        );
    }
}