import { Address, AuxiliaryData, BigNum, hash_auxiliary_data, hash_transaction, make_vkey_witness, NativeScript, NativeScripts, PrivateKey, Transaction, TransactionBody, TransactionHash, TransactionOutput, TransactionOutputs, TransactionWitnessSet, Value, Vkeywitnesses } from "@emurgo/cardano-serialization-lib-nodejs";
import { Seed } from "../utils";
import { CoinSelectionWallet } from "../wallet/coin-selection-wallet";
import { TokenWallet } from "../wallet/token-wallet";

export class MultisigTransaction {
    coinSelection: CoinSelectionWallet;
    txBody: TransactionBody;
    txHash: TransactionHash;
    vkeyWitnesses: Vkeywitnesses;
    nativeScripts: NativeScripts;
    transaction: Transaction;
    config: any;
    encoding: BufferEncoding;
    metadata: AuxiliaryData;
    tokens: TokenWallet[];

    constructor(coinSelection: CoinSelectionWallet, txBody: TransactionBody, scripts: NativeScript[], privateKeys: PrivateKey[], config: any, encoding: BufferEncoding, metadata?: AuxiliaryData, tokens?: TokenWallet[]) {
        this.coinSelection = coinSelection;
        this.txBody = txBody;
        this.txHash = hash_transaction(txBody)
        // this.transaction = this.buildTx(txBody, scripts, privateKeys, metadata);
        this.config = config;
        this.encoding = encoding;
        this.metadata = metadata;
        this.tokens = tokens;

        this.vkeyWitnesses = Vkeywitnesses.new();
        this.nativeScripts = NativeScripts.new();

        privateKeys.forEach(prvKey => {
            // add keyhash witnesses
            const vkeyWitness = make_vkey_witness(this.txHash, prvKey);
            this.vkeyWitnesses.add(vkeyWitness);
        });

        scripts.forEach(s => {
            this.nativeScripts.add(s);
        });
    }

    private buildTx(txBody: TransactionBody, scripts: NativeScript[], privateKeys: PrivateKey[], transactionMetadata?: AuxiliaryData): Transaction {
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

		return Transaction.new(
			txBody,
			witnesses,
			transactionMetadata
		);
    }

    addKeyWitnesses(...privateKeys: PrivateKey[]): void {
        privateKeys.forEach(prvKey => {
            // add keyhash witnesses
            const vkeyWitness = make_vkey_witness(this.txHash, prvKey);
            this.vkeyWitnesses.add(vkeyWitness);
        });
	}

	addScriptWitness(...scripts: NativeScript[]): void {
        scripts.forEach(s => {
            this.nativeScripts.add(s);
        });
	}

    private adjustFee() {
        const txFee = parseInt(Seed.getTransactionFee(this.transaction, this.config).to_str());
        const bodyFee = parseInt(this.txBody.fee().to_str());

        if (txFee < bodyFee) {
            const feeDiff = bodyFee - txFee;
            const feeDiffPerChange = Math.ceil(feeDiff/this.coinSelection.change.length);
			this.coinSelection.change = this.coinSelection.change.map(c => {
				c.amount.quantity += feeDiffPerChange;
				return c;
			},);

            const outputs = this.coinSelection.outputs.map(output => {
				let address = Address.from_bech32(output.address);
				let amount = Value.new(
					BigNum.from_str(output.amount.quantity.toString())
				);
	
				// add tx assets
				if(output.assets && output.assets.length > 0){
					let multiAsset = Seed.buildMultiAssets(output.assets, this.encoding);
					amount.set_multiasset(multiAsset);
				}
	
				return TransactionOutput.new(
					address,
					amount
				);
			});

			outputs.push(...this.coinSelection.change.map(change => {
				let address = Address.from_bech32(change.address);
				let amount = Value.new(
					BigNum.from_str(change.amount.quantity.toString())
				);
	
				// add tx assets
				if(change.assets && change.assets.length > 0){
					let multiAsset = Seed.buildMultiAssets(change.assets, this.encoding);
					amount.set_multiasset(multiAsset);
				}
	
				return TransactionOutput.new(
					address,
					amount
				);
			}));

			const txOutputs = TransactionOutputs.new();
			outputs.forEach(txout => txOutputs.add(txout));

            const body = TransactionBody.new(this.txBody.inputs(), txOutputs, BigNum.from_str(txFee.toString()), this.txBody.ttl());
            // metadata
            if (this.metadata) {
                const dataHash = hash_auxiliary_data(this.metadata);
                body.set_auxiliary_data_hash(dataHash)
            }
            // mint tokens
            if (this.tokens) {
                const mint = Seed.buildTransactionMint(this.tokens);
                body.set_mint(mint);
            }

            // set tx validity start interval
		    body.set_validity_start_interval(this.txBody.validity_start_interval());
            this.transaction = Transaction.new(body, this.transaction.witness_set(), this.transaction.auxiliary_data());
        }
    }

    build(): string {
        // this.adjustFee();
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

}