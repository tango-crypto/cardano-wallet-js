"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARDANO_CHIMERIC = exports.CARDANO_CHANGE = exports.CARDANO_EXTERNAL = exports.CARDANO_COIN_TYPE = exports.CARDANO_PUROPOSE = exports.MetadateTypesEnum = exports.Bip32KeyPair = exports.Seed = void 0;
var bip39_1 = require("bip39");
var cardano_serialization_lib_nodejs_1 = require("@emurgo/cardano-serialization-lib-nodejs");
var network_config_1 = require("./config/network.config");
var json_script_model_1 = require("./models/json-script.model");
var payment_extended_signing_key_1 = require("./models/payment-extended-signing-key");
var multisig_transaction_1 = require("./models/multisig-transaction");
var phrasesLengthMap = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256
};
var Seed = /** @class */ (function () {
    function Seed() {
    }
    Seed.generateRecoveryPhrase = function (size) {
        if (size === void 0) { size = 15; }
        var strength = phrasesLengthMap[size] || phrasesLengthMap[15];
        return bip39_1.generateMnemonic(strength).trim();
    };
    Seed.toMnemonicList = function (phrase) {
        return phrase.trim().split(/\s+/g);
    };
    Seed.deriveRootKey = function (phrase) {
        var mnemonic = Array.isArray(phrase) ? phrase.join(" ") : phrase;
        var entropy = bip39_1.mnemonicToEntropy(mnemonic);
        var rootKey = cardano_serialization_lib_nodejs_1.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''));
        return rootKey;
    };
    Seed.deriveAccountKey = function (key, index) {
        if (index === void 0) { index = 0; }
        return key
            .derive(Seed.harden(exports.CARDANO_PUROPOSE)) // purpose
            .derive(Seed.harden(exports.CARDANO_COIN_TYPE)) // coin type
            .derive(Seed.harden(index)); // account #0
    };
    Seed.deriveKey = function (key, path) {
        var result = key;
        path.forEach(function (p) {
            result = result.derive(p.endsWith('H') || p.endsWith("'")
                ? Seed.harden(Number.parseInt(p.substr(0, p.length - 1)))
                : Number.parseInt(p));
        });
        return result;
    };
    Seed.buildTransaction = function (coinSelection, ttl, opts) {
        var _a, _b;
        if (opts === void 0) { opts = { changeAddress: "", metadata: null, startSlot: 0, config: network_config_1.Mainnet }; }
        var config = opts.config || network_config_1.Mainnet;
        var metadata = opts.metadata;
        var startSlot = opts.startSlot || 0;
        var txBuilder = cardano_serialization_lib_nodejs_1.TransactionBuilder.new(
        // all of these are taken from the mainnet genesis settings
        // linear fee parameters (a*size + b)
        cardano_serialization_lib_nodejs_1.LinearFee.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.txFeePerByte.toString()), cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.txFeeFixed.toString())), 
        // minimum utxo value
        cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.minUTxOValue.toString()), 
        // pool deposit
        cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.stakePoolDeposit.toString()), 
        // key deposit
        cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.stakeAddressDeposit.toString()), config.protocols.maxValueSize, config.protocols.maxTxSize);
        // add tx inputs
        coinSelection.inputs.forEach(function (input, i) {
            var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(input.address);
            var txInput = cardano_serialization_lib_nodejs_1.TransactionInput.new(cardano_serialization_lib_nodejs_1.TransactionHash.from_bytes(Buffer.from(input.id, 'hex')), input.index);
            var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(input.amount.quantity.toString()));
            txBuilder.add_input(address, txInput, amount);
        });
        // add tx outputs
        coinSelection.outputs.forEach(function (output) {
            var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(output.address);
            var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(output.amount.quantity.toString()));
            // add tx assets
            if (output.assets && output.assets.length > 0) {
                var multiAsset = Seed.buildMultiAssets(output.assets);
                amount.set_multiasset(multiAsset);
            }
            var txOutput = cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
            txBuilder.add_output(txOutput);
        });
        // add tx change
        coinSelection.change.forEach(function (change) {
            var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(change.address);
            var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(change.amount.quantity.toString()));
            // add tx assets
            if (change.assets && change.assets.length > 0) {
                var multiAsset = Seed.buildMultiAssets(change.assets);
                amount.set_multiasset(multiAsset);
            }
            var txOutput = cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
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
            var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(opts.changeAddress);
            txBuilder.add_change_if_needed(address);
        }
        else {
            var fee = opts.fee || coinSelection.inputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                + (((_a = coinSelection.withdrawals) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)) || 0)
                - coinSelection.outputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                - coinSelection.change.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                - (((_b = coinSelection.deposits) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, c) { return c.quantity + acc; }, 0)) || 0);
            txBuilder.set_fee(cardano_serialization_lib_nodejs_1.BigNum.from_str(fee.toString()));
        }
        var txBody = txBuilder.build();
        return txBody;
    };
    Seed.buildTransactionWithToken = function (coinSelection, ttl, tokens, signingKeys, opts, encoding) {
        var _a, _b;
        if (opts === void 0) { opts = { changeAddress: "", data: null, startSlot: 0, config: network_config_1.Mainnet }; }
        if (encoding === void 0) { encoding = 'hex'; }
        var metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
        opts.config = opts.config || network_config_1.Mainnet;
        // set maximun fee first
        var fee = parseInt(opts.config.protocols.maxTxSize * opts.config.protocols.txFeePerByte + opts.config.protocols.txFeeFixed); // 16384 * 44 + 155381 = 876277
        if (!opts.fee) {
            opts.fee = fee;
            // adjust change if there is any
            if (coinSelection.change && coinSelection.change.length > 0) {
                var selectionfee = coinSelection.inputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                    + (((_a = coinSelection.withdrawals) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)) || 0)
                    - coinSelection.outputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                    - coinSelection.change.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
                    - (((_b = coinSelection.deposits) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, c) { return c.quantity + acc; }, 0)) || 0);
                var feePerChange_1 = Math.ceil((opts.fee - selectionfee) / coinSelection.change.length);
                coinSelection.change = coinSelection.change.map(function (change) {
                    change.amount.quantity -= feePerChange_1;
                    return change;
                });
            }
        }
        var buildOpts = Object.assign({}, __assign({ metadata: metadata }, opts));
        // create mint token data
        var mint = Seed.buildTransactionMint(tokens, encoding);
        // get token's scripts 
        var scripts = tokens.map(function (t) { return t.script; });
        // set mint into tx
        var txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
        txBody.set_mint(mint);
        // sign to calculate the real tx fee;
        var tx = Seed.sign(txBody, signingKeys, metadata, scripts);
        // NOTE: txFee should be <= original fee = maxTxSize * txFeePerByte + txFeeFixed
        // Also after rearrange the outputs will decrease along with fee field, so new tx fee won't increase because tx's size (bytes) will be smaller;
        var txFee = parseInt(Seed.getTransactionFee(tx, opts.config).to_str());
        // if (txFee > fee) throw new Error(`expected tx size less than ${opts.config.protocols.maxTxSize} but got: ${(txFee - opts.config.protocols.txFeeFixed)/opts.config.protocols.txFeePerByte}`)
        var finalFee = txFee;
        // const finalFee = Math.min(txFee, (fee || Number.MAX_SAFE_INTEGER)); // we'll use the min fee on final tx
        opts.fee = finalFee;
        // adjust change UTXO
        var feeDiff = fee - finalFee;
        if (coinSelection.change && coinSelection.change.length > 0) {
            var feeDiffPerChange_1 = Math.ceil(feeDiff / coinSelection.change.length);
            coinSelection.change = coinSelection.change.map(function (c) {
                c.amount.quantity += feeDiffPerChange_1;
                return c;
            });
        }
        // after signing the metadata is cleaned so we need to create it again
        metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
        buildOpts = Object.assign({}, __assign({ metadata: metadata }, opts));
        txBody = Seed.buildTransaction(coinSelection, ttl, buildOpts);
        txBody.set_mint(mint);
        return txBody;
    };
    Seed.buildTransactionMultisig = function (coinSelection, ttl, scripts, tokens, signingKeys, opts, encoding) {
        var _a, _b;
        if (tokens === void 0) { tokens = null; }
        if (signingKeys === void 0) { signingKeys = null; }
        if (opts === void 0) { opts = { changeAddress: "", data: null, startSlot: 0, config: network_config_1.Mainnet }; }
        if (encoding === void 0) { encoding = 'hex'; }
        var config = opts.config || network_config_1.Mainnet;
        var metadata = opts.data ? Seed.buildTransactionMetadata(opts.data) : null;
        var startSlot = opts.startSlot || 0;
        // const fee = parseInt(config.protocols.maxTxSize * config.protocols.txFeePerByte + config.protocols.txFeeFixed); // 16384 * 44 + 155381 = 876277
        var selectionfee = coinSelection.inputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
            + (((_a = coinSelection.withdrawals) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)) || 0)
            - coinSelection.outputs.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
            - coinSelection.change.reduce(function (acc, c) { return c.amount.quantity + acc; }, 0)
            - (((_b = coinSelection.deposits) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, c) { return c.quantity + acc; }, 0)) || 0);
        // add tx inputs
        var inputs = coinSelection.inputs.map(function (input, i) {
            return cardano_serialization_lib_nodejs_1.TransactionInput.new(cardano_serialization_lib_nodejs_1.TransactionHash.from_bytes(Buffer.from(input.id, 'hex')), input.index);
        });
        // add tx outputs
        var outputs = coinSelection.outputs.map(function (output) {
            var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(output.address);
            var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(output.amount.quantity.toString()));
            // add tx assets
            if (output.assets && output.assets.length > 0) {
                var multiAsset = Seed.buildMultiAssets(output.assets, encoding);
                amount.set_multiasset(multiAsset);
            }
            return cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
        });
        // adjust changes to match maximum fee
        if (coinSelection.change && coinSelection.change.length > 0) {
            outputs.push.apply(outputs, coinSelection.change.map(function (change) {
                var address = cardano_serialization_lib_nodejs_1.Address.from_bech32(change.address);
                var amount = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(change.amount.quantity.toString()));
                // add tx assets
                if (change.assets && change.assets.length > 0) {
                    var multiAsset = Seed.buildMultiAssets(change.assets, encoding);
                    amount.set_multiasset(multiAsset);
                }
                return cardano_serialization_lib_nodejs_1.TransactionOutput.new(address, amount);
            }));
        }
        var txInputs = cardano_serialization_lib_nodejs_1.TransactionInputs.new();
        inputs.forEach(function (txin) { return txInputs.add(txin); });
        var txOutputs = cardano_serialization_lib_nodejs_1.TransactionOutputs.new();
        outputs.forEach(function (txout) { return txOutputs.add(txout); });
        var txBody = cardano_serialization_lib_nodejs_1.TransactionBody.new(txInputs, txOutputs, cardano_serialization_lib_nodejs_1.BigNum.from_str(selectionfee.toString()), ttl);
        // add tx metadata
        if (metadata) {
            var dataHash = cardano_serialization_lib_nodejs_1.hash_auxiliary_data(metadata);
            txBody.set_auxiliary_data_hash(dataHash);
        }
        if (tokens) {
            // create mint token data
            var mint = Seed.buildTransactionMint(tokens, encoding);
            txBody.set_mint(mint);
        }
        // set tx validity start interval
        txBody.set_validity_start_interval(startSlot);
        return new multisig_transaction_1.MultisigTransaction(coinSelection, txBody, scripts, signingKeys, config, encoding, metadata, tokens);
    };
    Seed.buildMultiAssets = function (assets, encoding) {
        if (encoding === void 0) { encoding = 'hex'; }
        var multiAsset = cardano_serialization_lib_nodejs_1.MultiAsset.new();
        var groups = assets.reduce(function (dict, asset) {
            (dict[asset.policy_id] = dict[asset.policy_id] || []).push(asset);
            return dict;
        }, {});
        for (var policy_id in groups) {
            var scriptHash = Seed.getScriptHashFromPolicy(policy_id);
            var asset = cardano_serialization_lib_nodejs_1.Assets.new();
            var assetGroups = groups[policy_id].reduce(function (dict, asset) {
                dict[asset.asset_name] = (dict[asset.asset_name] || 0) + +asset.quantity;
                return dict;
            }, {});
            for (var asset_name in assetGroups) {
                var quantity = assetGroups[asset_name];
                var assetName = cardano_serialization_lib_nodejs_1.AssetName.new(Buffer.from(asset_name, encoding));
                asset.insert(assetName, cardano_serialization_lib_nodejs_1.BigNum.from_str(quantity.toString()));
            }
            multiAsset.insert(scriptHash, asset);
        }
        return multiAsset;
    };
    Seed.buildTransactionMint = function (tokens, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        var mint = cardano_serialization_lib_nodejs_1.Mint.new();
        var groups = tokens.reduce(function (dict, asset) {
            (dict[asset.asset.policy_id] = dict[asset.asset.policy_id] || []).push(asset);
            return dict;
        }, {});
        for (var policy_id in groups) {
            var scriptHash = Seed.getScriptHashFromPolicy(policy_id);
            var mintAssets = cardano_serialization_lib_nodejs_1.MintAssets.new();
            var assetGroups = groups[policy_id].reduce(function (dict, asset) {
                dict[asset.asset.asset_name] = (dict[asset.asset.asset_name] || 0) + +asset.asset.quantity;
                return dict;
            }, {});
            for (var asset_name in assetGroups) {
                var quantity = assetGroups[asset_name];
                var assetName = cardano_serialization_lib_nodejs_1.AssetName.new(Buffer.from(asset_name, encoding));
                mintAssets.insert(assetName, cardano_serialization_lib_nodejs_1.Int.new_i32(quantity));
            }
            mint.insert(scriptHash, mintAssets);
        }
        return mint;
    };
    Seed.getTransactionFee = function (tx, config) {
        if (config === void 0) { config = network_config_1.Mainnet; }
        return cardano_serialization_lib_nodejs_1.min_fee(tx, cardano_serialization_lib_nodejs_1.LinearFee.new(cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.txFeePerByte.toString()), cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.txFeeFixed.toString())));
    };
    Seed.addKeyWitness = function (transaction, prvKey) {
        var vkeyWitnesses = cardano_serialization_lib_nodejs_1.Vkeywitnesses.new();
        var txBody = transaction.body();
        var txHash = cardano_serialization_lib_nodejs_1.hash_transaction(txBody);
        var vkeyWitness = cardano_serialization_lib_nodejs_1.make_vkey_witness(txHash, prvKey);
        vkeyWitnesses.add(vkeyWitness);
        var witnesses = transaction.witness_set();
        witnesses.set_vkeys(vkeyWitnesses);
        return cardano_serialization_lib_nodejs_1.Transaction.new(txBody, witnesses, transaction.auxiliary_data());
    };
    Seed.addScriptWitness = function (transaction, script) {
        var txBody = transaction.body();
        var nativeScripts = cardano_serialization_lib_nodejs_1.NativeScripts.new();
        nativeScripts.add(script);
        var witnesses = transaction.witness_set();
        witnesses.set_native_scripts(nativeScripts);
        return cardano_serialization_lib_nodejs_1.Transaction.new(txBody, witnesses, transaction.auxiliary_data());
    };
    Seed.sign = function (txBody, privateKeys, transactionMetadata, scripts) {
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
        var transaction = cardano_serialization_lib_nodejs_1.Transaction.new(txBody, witnesses, transactionMetadata);
        return transaction;
    };
    Seed.signMessage = function (key, message) {
        return key.sign(Buffer.from(message)).to_hex();
    };
    Seed.verifyMessage = function (key, message, signed) {
        return key.verify(Buffer.from(message), cardano_serialization_lib_nodejs_1.Ed25519Signature.from_hex(signed));
    };
    Seed.getTxId = function (transaction) {
        var txBody = transaction.body();
        var txHash = cardano_serialization_lib_nodejs_1.hash_transaction(txBody);
        var txId = Buffer.from(txHash.to_bytes()).toString('hex');
        return txId;
    };
    Seed.convertPrivateKeyToSignKey = function (prkKey) {
        // const k = Bip32PrivateKey.from_bech32(scriptKeys[1]);
        console.log(prkKey.to_bech32());
        // const hex = Buffer.from(prkKey.to_raw_key().as_bytes()).toString('hex');
        var cborHex = "5880" + Buffer.from(prkKey.to_128_xprv()).toString('hex');
        return new payment_extended_signing_key_1.ExtendedSigningKey(cborHex);
        // console.log(hex);
    };
    Seed.harden = function (num) {
        return 0x80000000 + num;
    };
    Seed.constructMetadata = function (data) {
        var metadata = {};
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                metadata[i] = Seed.getMetadataObject(value);
            }
        }
        else {
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (this.isInteger(key)) {
                    var index = parseInt(key);
                    metadata[index] = Seed.getMetadataObject(data[key]);
                }
            }
        }
        return metadata;
    };
    Seed.getMetadataObject = function (data) {
        var _this = this;
        var result = {};
        var type = typeof data;
        if (type == "number") {
            result[MetadateTypesEnum.Number] = data;
        }
        else if (type == "string" && Buffer.byteLength(data, 'utf-8') <= 64) {
            result[MetadateTypesEnum.String] = data;
        }
        else if (Buffer.isBuffer(data) && Buffer.byteLength(data, "hex") <= 64) {
            result[MetadateTypesEnum.Bytes] = data.toString("hex");
        }
        else if (type == "boolean") {
            result[MetadateTypesEnum.String] = data.toString();
        }
        else if (type == "undefined") {
            result[MetadateTypesEnum.String] = "undefined";
        }
        else if (Array.isArray(data)) {
            result[MetadateTypesEnum.List] = data.map(function (a) { return _this.getMetadataObject(a); });
        }
        else if (type == "object") {
            if (data) {
                result[MetadateTypesEnum.Map] = Object.keys(data).map(function (k) {
                    return {
                        "k": _this.getMetadataObject(k),
                        "v": _this.getMetadataObject(data[k])
                    };
                });
            }
            else {
                result[MetadateTypesEnum.String] = "null";
            }
        }
        return result;
    };
    Seed.reverseMetadata = function (data, type) {
        if (type === void 0) { type = "object"; }
        if (!data) {
            return null;
        }
        var metadata = type == "object" ? {} : [];
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var index = parseInt(key);
            metadata[index] = Seed.reverseMetadataObject(data[key]);
        }
        return metadata;
    };
    Seed.reverseMetadataObject = function (data) {
        var result = [];
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            if (key == "string") {
                result.push(value);
            }
            else if (key == "int") {
                result.push(new Number(value));
            }
            else if (key == "bytes") {
                result.push(Buffer.from(value, 'hex'));
            }
            else if (key == "list") {
                result.push(value.map(function (d) { return Seed.reverseMetadataObject(d); }));
            }
            else if (key == "map") {
                var map = value.reduce(function (acc, obj) {
                    var k = Seed.reverseMetadataObject(obj["k"]);
                    var v = Seed.reverseMetadataObject(obj["v"]);
                    acc[k] = v;
                    return acc;
                }, {});
                result.push(map);
            }
            else {
                result.push(null);
            }
        }
        return result.length == 1 ? result[0] : result;
    };
    Seed.buildTransactionMetadata = function (data) {
        var metadata = Seed.constructMetadata(data);
        var generalMetatada = cardano_serialization_lib_nodejs_1.GeneralTransactionMetadata.new();
        for (var key in metadata) {
            var value = metadata[key];
            generalMetatada.insert(cardano_serialization_lib_nodejs_1.BigNum.from_str(key), Seed.getTransactionMetadatum(value));
        }
        var auxiliaryData = cardano_serialization_lib_nodejs_1.AuxiliaryData.new();
        auxiliaryData.set_metadata(generalMetatada);
        return auxiliaryData;
    };
    Seed.getTransactionMetadatum = function (value) {
        if (value.hasOwnProperty(MetadateTypesEnum.Number)) {
            return cardano_serialization_lib_nodejs_1.TransactionMetadatum.new_int(cardano_serialization_lib_nodejs_1.Int.new_i32(value[MetadateTypesEnum.Number]));
        }
        if (value.hasOwnProperty(MetadateTypesEnum.String)) {
            return cardano_serialization_lib_nodejs_1.TransactionMetadatum.new_text(value[MetadateTypesEnum.String]);
        }
        if (value.hasOwnProperty(MetadateTypesEnum.Bytes)) {
            return cardano_serialization_lib_nodejs_1.TransactionMetadatum.new_bytes(Buffer.from(value[MetadateTypesEnum.Bytes], 'hex'));
        }
        if (value.hasOwnProperty(MetadateTypesEnum.List)) {
            var list = value[MetadateTypesEnum.List];
            var metalist = cardano_serialization_lib_nodejs_1.MetadataList.new();
            for (var i = 0; i < list.length; i++) {
                metalist.add(Seed.getTransactionMetadatum(list[i]));
            }
            return cardano_serialization_lib_nodejs_1.TransactionMetadatum.new_list(metalist);
        }
        if (value.hasOwnProperty(MetadateTypesEnum.Map)) {
            var map = value[MetadateTypesEnum.Map];
            var metamap = cardano_serialization_lib_nodejs_1.MetadataMap.new();
            for (var i = 0; i < map.length; i++) {
                var _a = map[i], k = _a.k, v = _a.v;
                metamap.insert(Seed.getTransactionMetadatum(k), Seed.getTransactionMetadatum(v));
            }
            return cardano_serialization_lib_nodejs_1.TransactionMetadatum.new_map(metamap);
        }
    };
    Seed.generateKeyPair = function () {
        var prvKey = cardano_serialization_lib_nodejs_1.Bip32PrivateKey.generate_ed25519_bip32();
        var pubKey = prvKey.to_public();
        var pair = {
            privateKey: prvKey,
            publicKey: pubKey
        };
        return pair;
    };
    // enterprise address without staking ability, for use by exchanges/etc
    Seed.generateEnterpriseAddress = function (pubKey, network) {
        if (network === void 0) { network = 'mainnet'; }
        var networkId = network == 'mainnet' ? cardano_serialization_lib_nodejs_1.NetworkInfo.mainnet().network_id() : cardano_serialization_lib_nodejs_1.NetworkInfo.testnet().network_id();
        return cardano_serialization_lib_nodejs_1.EnterpriseAddress.new(networkId, cardano_serialization_lib_nodejs_1.StakeCredential.from_keyhash(pubKey.to_raw_key().hash())).to_address();
    };
    Seed.getKeyHash = function (key) {
        return key.to_raw_key().hash();
    };
    Seed.buildSingleIssuerScript = function (keyHash) {
        var scriptPubKey = cardano_serialization_lib_nodejs_1.ScriptPubkey.new(keyHash);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_script_pubkey(scriptPubKey);
    };
    Seed.buildMultiIssuerAllScript = function (scripts) {
        var nativeScripts = this.buildNativeScripts(scripts);
        var scriptAll = cardano_serialization_lib_nodejs_1.ScriptAll.new(nativeScripts);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_script_all(scriptAll);
    };
    Seed.buildMultiIssuerAnyScript = function (scripts) {
        var nativeScripts = this.buildNativeScripts(scripts);
        var scriptAny = cardano_serialization_lib_nodejs_1.ScriptAny.new(nativeScripts);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_script_any(scriptAny);
    };
    Seed.buildMultiIssuerAtLeastScript = function (n, scripts) {
        var nativeScripts = this.buildNativeScripts(scripts);
        var scriptAtLeast = cardano_serialization_lib_nodejs_1.ScriptNOfK.new(n, nativeScripts);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_script_n_of_k(scriptAtLeast);
    };
    // you need to set validity range on transcation builder to check on a deterministic way
    Seed.buildAfterScript = function (slot) {
        var scriptAfter = cardano_serialization_lib_nodejs_1.TimelockStart.new(slot);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_timelock_start(scriptAfter);
    };
    // you need to set validity range on transcation builder to check on a deterministic way
    Seed.buildBeforeScript = function (slot) {
        var scriptBefore = cardano_serialization_lib_nodejs_1.TimelockExpiry.new(slot);
        return cardano_serialization_lib_nodejs_1.NativeScript.new_timelock_expiry(scriptBefore);
    };
    Seed.getNativeScripts = function (script) {
        var result = [];
        var kind = script.root.kind();
        if (kind == 0) { // sig
            result.push(script.root);
        }
        else if (kind == 1 || kind == 2 || kind == 3) { // all, any and atLeast respectivetly
            result.push.apply(// all, any and atLeast respectivetly
            result, script.scripts.map(function (s) { return s.root; }));
        }
        return result;
    };
    Seed.buildNativeScripts = function (scripts) {
        var nativeScripts = cardano_serialization_lib_nodejs_1.NativeScripts.new();
        scripts.forEach(function (script) {
            nativeScripts.add(script);
        });
        return nativeScripts;
    };
    Seed.getScriptHash = function (script) {
        var keyHash = script.hash(cardano_serialization_lib_nodejs_1.ScriptHashNamespace.NativeScript);
        var scriptHash = cardano_serialization_lib_nodejs_1.ScriptHash.from_bytes(keyHash.to_bytes());
        return scriptHash;
        // let credential = StakeCredential.from_keyhash(keyHash);
        // return credential.to_scripthash();
    };
    Seed.getPolicyId = function (scriptHash) {
        return Buffer.from(scriptHash.to_bytes()).toString('hex');
    };
    Seed.getScriptHashFromPolicy = function (policyId) {
        return cardano_serialization_lib_nodejs_1.ScriptHash.from_bytes(Buffer.from(policyId, 'hex'));
    };
    Seed.getMinUtxoValueWithAssets = function (tokenAssets, config, encoding) {
        if (config === void 0) { config = network_config_1.Mainnet; }
        if (encoding === void 0) { encoding = 'utf8'; }
        var assets = cardano_serialization_lib_nodejs_1.Value.new(cardano_serialization_lib_nodejs_1.BigNum.from_str('1000000'));
        var multiAsset = cardano_serialization_lib_nodejs_1.MultiAsset.new();
        var groups = tokenAssets.reduce(function (dict, asset) {
            (dict[asset.policy_id] = dict[asset.policy_id] || []).push(asset);
            return dict;
        }, {});
        var _loop_1 = function (policy_id) {
            var scriptHash = Seed.getScriptHashFromPolicy(policy_id);
            var asset = cardano_serialization_lib_nodejs_1.Assets.new();
            groups[policy_id].forEach(function (a) {
                asset.insert(cardano_serialization_lib_nodejs_1.AssetName.new(Buffer.from(a.asset_name, encoding)), cardano_serialization_lib_nodejs_1.BigNum.from_str(a.quantity.toString()));
            });
            multiAsset.insert(scriptHash, asset);
        };
        for (var policy_id in groups) {
            _loop_1(policy_id);
        }
        assets.set_multiasset(multiAsset);
        var min = cardano_serialization_lib_nodejs_1.min_ada_required(assets, cardano_serialization_lib_nodejs_1.BigNum.from_str(config.protocols.minUTxOValue.toString()));
        return Number.parseInt(min.to_str());
    };
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
    Seed.buildScript = function (json, currentSlot) {
        if (json.type === json_script_model_1.ScriptTypeEnum.Sig) { // Single Issuer
            var keyPair = void 0; // needed to get the signing keys when export (e.g toJSON)
            var keyHash = void 0;
            if (!json.keyHash) {
                keyPair = Seed.generateKeyPair();
                keyHash = Seed.getKeyHash(keyPair.publicKey);
            }
            else {
                keyHash = cardano_serialization_lib_nodejs_1.Ed25519KeyHash.from_bytes(Buffer.from(json.keyHash, 'hex'));
            }
            return { root: Seed.buildSingleIssuerScript(keyHash), keyHash: Buffer.from(keyHash.to_bytes()).toString('hex'), keyPair: keyPair, scripts: [] };
        }
        if (json.type === json_script_model_1.ScriptTypeEnum.All) { // Multiple Issuer All
            var scripts = json.scripts.map(function (s) { return Seed.buildScript(s, currentSlot); });
            return { root: Seed.buildMultiIssuerAllScript(scripts.map(function (s) { return s.root; })), scripts: scripts };
        }
        if (json.type === json_script_model_1.ScriptTypeEnum.Any) { // Multiple Issuer Any
            var scripts = json.scripts.map(function (s) { return Seed.buildScript(s, currentSlot); });
            return { root: Seed.buildMultiIssuerAnyScript(scripts.map(function (s) { return s.root; })), scripts: scripts };
        }
        if (json.type === json_script_model_1.ScriptTypeEnum.AtLeast) { // Multiple Issuer At least
            var scripts = json.scripts.map(function (s) { return Seed.buildScript(s, currentSlot); });
            var n = json.require;
            return { root: Seed.buildMultiIssuerAtLeastScript(n, scripts.map(function (s) { return s.root; })), scripts: scripts };
        }
        if (json.type === json_script_model_1.ScriptTypeEnum.After) { // After
            var slot = 0;
            if (!json.slot) {
                slot = currentSlot; // after now
                var lockTime = json.lockTime;
                if (lockTime != 'now') {
                    var now = Date.now();
                    var datetime = new Date(lockTime).getTime();
                    slot = currentSlot + Math.floor((datetime - now) / 1000);
                }
            }
            else {
                slot = json.slot;
            }
            return { root: Seed.buildAfterScript(slot), slot: slot, scripts: [] };
        }
        if (json.type === json_script_model_1.ScriptTypeEnum.Before) { // Before
            var slot = 0;
            if (!json.slot) {
                var lockTime = json.lockTime;
                slot = currentSlot + 180; // only 3 min to mint tokens
                if (lockTime != 'now') {
                    var now = Date.now();
                    var datetime = new Date(lockTime).getTime();
                    slot = currentSlot + Math.floor((datetime - now) / 1000);
                }
            }
            else {
                slot = json.slot;
            }
            return { root: Seed.buildBeforeScript(slot), slot: slot, scripts: [] };
        }
    };
    Seed.scriptToJson = function (script) {
        var result = {};
        result.type = json_script_model_1.scriptTypes[script.root.kind()];
        if (script.keyHash) {
            result.keyHash = script.keyHash;
        }
        if (result.type === 'atLeast') { // Multiple Issuer At least)
            result.require = script.root.as_script_n_of_k().n();
        }
        if (result.type === 'after' || result.type === 'before') {
            result.slot = script.slot;
        }
        if (script.scripts && script.scripts.length > 0) {
            result.scripts = script.scripts.map(function (s) { return Seed.scriptToJson(s); });
        }
        return result;
    };
    Seed.getScriptKeys = function (script) {
        var result = [];
        if (script.keyPair) {
            // let prvKey = Bip32PrivateKey.from_bech32(script.signingKey);
            // let pubKey = prvKey.to_public();
            // result.push({ publicKey: pubKey, privateKey: prvKey});
            result.push(script.keyPair.privateKey);
        }
        script.scripts.forEach(function (s) {
            result.push.apply(result, Seed.getScriptKeys(s));
        });
        return result;
    };
    Seed.getScriptAddress = function (script, network) {
        if (network === void 0) { network = 'mainnet'; }
        var networkId = network == 'mainnet' ? cardano_serialization_lib_nodejs_1.NetworkInfo.mainnet().network_id() : cardano_serialization_lib_nodejs_1.NetworkInfo.testnet().network_id();
        var scriptHash = this.getScriptHash(script.root);
        var credential = cardano_serialization_lib_nodejs_1.StakeCredential.from_scripthash(scriptHash);
        return cardano_serialization_lib_nodejs_1.BaseAddress.new(networkId, credential, credential).to_address();
    };
    Seed.getPolicyScriptId = function (script) {
        var scriptHash = Seed.getScriptHash(script.root);
        return Buffer.from(scriptHash.to_bytes()).toString('hex');
    };
    Seed.findSlots = function (script) {
        var result = {};
        var type = script.root.kind();
        if (type === 4) { //after
            result.start = script.slot;
        }
        else if (type === 5) { //before
            result.end = script.slot;
        }
        else {
            var slots = script.scripts.map(function (s) { return Seed.findSlots(s); });
            result.start = slots.reduce(function (max, act) { return !act.start && !max ? max : Math.max(act.start, max); }, result.start);
            result.end = slots.reduce(function (min, act) { return !act.end ? min : !min ? act.end : Math.min(act.end, min); }, result.end);
        }
        return result;
    };
    Seed.isInteger = function (value) {
        return Number.isInteger(Number(value));
    };
    return Seed;
}());
exports.Seed = Seed;
var Bip32KeyPair = /** @class */ (function () {
    function Bip32KeyPair() {
    }
    return Bip32KeyPair;
}());
exports.Bip32KeyPair = Bip32KeyPair;
var MetadateTypesEnum;
(function (MetadateTypesEnum) {
    MetadateTypesEnum["Number"] = "int";
    MetadateTypesEnum["String"] = "string";
    MetadateTypesEnum["Bytes"] = "bytes";
    MetadateTypesEnum["List"] = "list";
    MetadateTypesEnum["Map"] = "map";
})(MetadateTypesEnum = exports.MetadateTypesEnum || (exports.MetadateTypesEnum = {}));
exports.CARDANO_PUROPOSE = 1852;
exports.CARDANO_COIN_TYPE = 1815;
exports.CARDANO_EXTERNAL = 0;
exports.CARDANO_CHANGE = 1;
exports.CARDANO_CHIMERIC = 2;
//# sourceMappingURL=utils.js.map