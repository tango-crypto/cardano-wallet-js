"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigTransaction = void 0;
var cardano_serialization_lib_nodejs_1 = require("@emurgo/cardano-serialization-lib-nodejs");
var utils_1 = require("../utils");
var MultisigTransaction = /** @class */ (function () {
    function MultisigTransaction(coinSelection, txBody, scripts, privateKeys, config, encoding, metadata, tokens) {
        var _this = this;
        this.coinSelection = coinSelection;
        this.txBody = txBody;
        this.txHash = cardano_serialization_lib_nodejs_1.hash_transaction(txBody);
        // this.transaction = this.buildTx(txBody, scripts, privateKeys, metadata);
        this.config = config;
        this.encoding = encoding;
        this.metadata = metadata;
        this.tokens = tokens;
        this.vkeyWitnesses = cardano_serialization_lib_nodejs_1.Vkeywitnesses.new();
        this.nativeScripts = cardano_serialization_lib_nodejs_1.NativeScripts.new();
        privateKeys.forEach(function (prvKey) {
            // add keyhash witnesses
            var vkeyWitness = cardano_serialization_lib_nodejs_1.make_vkey_witness(_this.txHash, prvKey);
            _this.vkeyWitnesses.add(vkeyWitness);
        });
        scripts.forEach(function (s) {
            _this.nativeScripts.add(s);
        });
    }
    MultisigTransaction.prototype.buildTx = function (txBody, scripts, privateKeys, transactionMetadata) {
        var txHash = cardano_serialization_lib_nodejs_1.hash_transaction(txBody);
        var witnesses = cardano_serialization_lib_nodejs_1.TransactionWitnessSet.new();
        var vkeyWitnesses = cardano_serialization_lib_nodejs_1.Vkeywitnesses.new();
        if (privateKeys) {
            privateKeys.forEach(function (prvKey) {
                // add keyhash witnesses
                var vkeyWitness = cardano_serialization_lib_nodejs_1.make_vkey_witness(txHash, prvKey);
                vkeyWitnesses.add(vkeyWitness);
            });
        }
        witnesses.set_vkeys(vkeyWitnesses);
        if (scripts) {
            var nativeScripts_1 = cardano_serialization_lib_nodejs_1.NativeScripts.new();
            scripts.forEach(function (s) {
                nativeScripts_1.add(s);
            });
            witnesses.set_native_scripts(nativeScripts_1);
        }
        return cardano_serialization_lib_nodejs_1.Transaction.new(txBody, witnesses, transactionMetadata);
    };
    MultisigTransaction.prototype.addKeyWitnesses = function () {
        var _this = this;
        var privateKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            privateKeys[_i] = arguments[_i];
        }
        privateKeys.forEach(function (prvKey) {
            // add keyhash witnesses
            var vkeyWitness = cardano_serialization_lib_nodejs_1.make_vkey_witness(_this.txHash, prvKey);
            _this.vkeyWitnesses.add(vkeyWitness);
        });
    };
    MultisigTransaction.prototype.addScriptWitness = function () {
        var _this = this;
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        scripts.forEach(function (s) {
            _this.nativeScripts.add(s);
        });
    };
    MultisigTransaction.prototype.adjustFee = function () {
        var _this = this;
        var txFee = parseInt(utils_1.Seed.getTransactionFee(this.transaction, this.config).to_str());
        var bodyFee = parseInt(this.txBody.fee().to_str());
        if (txFee < bodyFee) {
            var feeDiff = bodyFee - txFee;
            var feeDiffPerChange_1 = Math.ceil(feeDiff / this.coinSelection.change.length);
            this.coinSelection.change = this.coinSelection.change.map(function (c) {
                c.amount.quantity += feeDiffPerChange_1;
                return c;
            });
            var outputs = this.coinSelection.outputs.map(function (output) {
                var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(output.address);
                var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(output.amount.quantity.toString()));
                // add tx assets
                if (output.assets && output.assets.length > 0) {
                    var multiAsset = utils_1.Seed.buildMultiAssets(output.assets, _this.encoding);
                    amount.set_multiasset(multiAsset);
                }
                return cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
            });
            outputs.push.apply(outputs, this.coinSelection.change.map(function (change) {
                var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(change.address);
                var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(change.amount.quantity.toString()));
                // add tx assets
                if (change.assets && change.assets.length > 0) {
                    var multiAsset = utils_1.Seed.buildMultiAssets(change.assets, _this.encoding);
                    amount.set_multiasset(multiAsset);
                }
                return cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
            }));
            var txOutputs_1 = cardano_serialization_lib_nodejs_1.TransactionOutputs.new();
            outputs.forEach(function (txout) { return txOutputs_1.add(txout); });
            var body = cardano_serialization_lib_nodejs_1.TransactionBody.new(this.txBody.inputs(), txOutputs_1, cardano_serialization_lib_nodejs_1.BigNum.from_str(txFee.toString()), this.txBody.ttl());
            // metadata
            if (this.metadata) {
                var dataHash = cardano_serialization_lib_nodejs_1.hash_auxiliary_data(this.metadata);
                body.set_auxiliary_data_hash(dataHash);
            }
            // mint tokens
            if (this.tokens) {
                var mint = utils_1.Seed.buildTransactionMint(this.tokens);
                body.set_mint(mint);
            }
            // set tx validity start interval
            body.set_validity_start_interval(this.txBody.validity_start_interval());
            this.transaction = cardano_serialization_lib_nodejs_1.Transaction.new(body, this.transaction.witness_set(), this.transaction.auxiliary_data());
        }
    };
    MultisigTransaction.prototype.build = function () {
        // this.adjustFee();
        var witnesses = cardano_serialization_lib_nodejs_1.TransactionWitnessSet.new();
        witnesses.set_vkeys(this.vkeyWitnesses);
        if (this.nativeScripts.len() > 0) {
            witnesses.set_native_scripts(this.nativeScripts);
        }
        var tx = cardano_serialization_lib_nodejs_1.Transaction.new(this.txBody, witnesses, this.metadata);
        return Buffer.from(tx.to_bytes()).toString('hex');
    };
    return MultisigTransaction;
}());
exports.MultisigTransaction = MultisigTransaction;
//# sourceMappingURL=multisig-transaction.js.map