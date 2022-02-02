/// <reference types="node" />
import { AuxiliaryData, NativeScript, NativeScripts, PrivateKey, Transaction, TransactionBody, TransactionHash, Vkeywitnesses } from "@emurgo/cardano-serialization-lib-nodejs";
import { CoinSelectionWallet } from "../wallet/coin-selection-wallet";
import { TokenWallet } from "../wallet/token-wallet";
export declare class MultisigTransaction {
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
    constructor(coinSelection: CoinSelectionWallet, txBody: TransactionBody, scripts: NativeScript[], privateKeys: PrivateKey[], config: any, encoding: BufferEncoding, metadata?: AuxiliaryData, tokens?: TokenWallet[]);
    private buildTx;
    addKeyWitnesses(...privateKeys: PrivateKey[]): void;
    addScriptWitness(...scripts: NativeScript[]): void;
    private adjustFee;
    build(): string;
}
