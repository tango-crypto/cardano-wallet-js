"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelleyWallet = void 0;
var utils_1 = require("../utils");
var api_1 = require("../api");
var models_1 = require("../models");
var address_wallet_1 = require("./address-wallet");
var coin_selection_wallet_1 = require("./coin-selection-wallet");
var fee_wallet_1 = require("./fee-wallet");
var key_wallet_1 = require("./key-wallet");
var transaction_wallet_1 = require("./transaction-wallet");
var utxo_statistics_wallet_1 = require("./utxo-statistics-wallet");
var ShelleyWallet = /** @class */ (function () {
    function ShelleyWallet(id, address_pool_gap, balance, assets, delegation, name, passphrase, state, tip, config) {
        this.id = id;
        this.address_pool_gap = address_pool_gap;
        this.balance = balance;
        this.assets = assets;
        this.delegation = delegation;
        this.name = name;
        this.passphrase = passphrase;
        this.state = state;
        this.tip = tip;
        this.config = config;
        this.addressesApi = new api_1.AddressesApi(config);
        this.keysApi = new api_1.KeysApi(config);
        this.transactionsApi = new api_1.TransactionsApi(config);
        this.walletsApi = new api_1.WalletsApi(config);
        this.stakePoolApi = new api_1.StakePoolsApi(config);
        this.coinSelectionsApi = new api_1.CoinSelectionsApi(config);
    }
    ShelleyWallet.from = function (wallet, config) {
        return new this(wallet.id, wallet.address_pool_gap, wallet.balance, wallet.assets, wallet.delegation, wallet.name, wallet.passphrase, wallet.state, wallet.tip, config);
    };
    ShelleyWallet.prototype.rename = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            name: name
                        };
                        return [4 /*yield*/, this.walletsApi.putWallet(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        this.updateData(res.data);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    ShelleyWallet.prototype.updatePassphrase = function (oldPassphrase, newPassphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var paylaod, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paylaod = {
                            old_passphrase: oldPassphrase,
                            new_passphrase: newPassphrase
                        };
                        return [4 /*yield*/, this.walletsApi.putWalletPassphrase(paylaod, this.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.walletsApi.getWallet(this.id)];
                    case 2:
                        res = _a.sent();
                        this.updateData(res.data);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    ShelleyWallet.prototype.getUtxoStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsApi.getUTxOsStatistics(this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, utxo_statistics_wallet_1.UtxoStatisticsWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getTotalBalance = function () {
        return this.balance.total.quantity;
    };
    ShelleyWallet.prototype.getAvailableBalance = function () {
        return this.balance.available.quantity;
    };
    ShelleyWallet.prototype.getRewardBalance = function () {
        return this.balance.reward.quantity;
    };
    ShelleyWallet.prototype.getDelegation = function () {
        return this.delegation;
    };
    ShelleyWallet.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsApi.getWallet(this.id)];
                    case 1:
                        res = _a.sent();
                        this.updateData(res.data);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    ShelleyWallet.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsApi.deleteWallet(this.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ShelleyWallet.prototype.getAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressesApi.listAddresses(this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (addr) { return new address_wallet_1.AddressWallet(addr.id, addr.state); })];
                }
            });
        });
    };
    ShelleyWallet.prototype.getUnusedAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressesApi.listAddresses(this.id, models_1.ApiAddressStateEnum.Unused)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (addr) { return new address_wallet_1.AddressWallet(addr.id, addr.state); })];
                }
            });
        });
    };
    ShelleyWallet.prototype.getUsedAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressesApi.listAddresses(this.id, models_1.ApiAddressStateEnum.Used)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (addr) { return new address_wallet_1.AddressWallet(addr.id, addr.state); })];
                }
            });
        });
    };
    ShelleyWallet.prototype.getAddressAt = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var addressVk, stakeVk, payload, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAddressExternalVerificationKey(index)];
                    case 1:
                        addressVk = _a.sent();
                        return [4 /*yield*/, this.getStakeVerificationKey(0)];
                    case 2:
                        stakeVk = _a.sent();
                        payload = {
                            payment: addressVk.key,
                            stake: stakeVk.key
                        };
                        return [4 /*yield*/, this.addressesApi.postAnyAddress(payload)];
                    case 3:
                        next = _a.sent();
                        return [2 /*return*/, new address_wallet_1.AddressWallet(next.data.address)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getNextAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAddresses()];
                    case 1:
                        index = (_a.sent()).length;
                        return [2 /*return*/, this.getAddressAt(index)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getAddressExternalVerificationKey = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.keysApi.getWalletKey(this.id, key_wallet_1.KeyRoleEnum.AddressExternal, index.toString())];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, new key_wallet_1.KeyWallet(account.data, key_wallet_1.KeyRoleEnum.AddressExternal)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getStakeVerificationKey = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.keysApi.getWalletKey(this.id, key_wallet_1.KeyRoleEnum.Stake, index.toString())];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, new key_wallet_1.KeyWallet(account.data, key_wallet_1.KeyRoleEnum.Stake)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getTransactions = function (start, end) {
        return __awaiter(this, void 0, void 0, function () {
            var startdate, enddate, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startdate = start ? start.toISOString() : undefined;
                        enddate = end ? end.toISOString() : undefined;
                        return [4 /*yield*/, this.transactionsApi.listTransactions(this.id, startdate, enddate)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (data) { return transaction_wallet_1.TransactionWallet.from(data); })];
                }
            });
        });
    };
    ShelleyWallet.prototype.getTransaction = function (txId) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.transactionsApi.getTransaction(this.id, txId)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, transaction_wallet_1.TransactionWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.forgetTransaction = function (txId) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.transactionsApi.deleteTransaction(this.id, txId)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.status == 204];
                }
            });
        });
    };
    ShelleyWallet.prototype.estimateFee = function (addresses, amounts, data, assets) {
        if (assets === void 0) { assets = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var metadata, payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = data ? utils_1.Seed.constructMetadata(data) : undefined;
                        payload = {
                            payments: addresses.map(function (addr, i) {
                                var _a;
                                var amount = { unit: models_1.WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
                                var payment = {
                                    address: addr.address,
                                    amount: amount,
                                    assets: (_a = assets[addr.id]) === null || _a === void 0 ? void 0 : _a.map(function (a) {
                                        var asset = {
                                            policy_id: a.policy_id,
                                            asset_name: Buffer.from(a.asset_name).toString('hex'),
                                            quantity: a.quantity
                                        };
                                        return asset;
                                    })
                                };
                                return payment;
                            }),
                            metadata: metadata
                        };
                        return [4 /*yield*/, this.transactionsApi.postTransactionFee(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, fee_wallet_1.FeeWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.sendPayment = function (passphrase, addresses, amounts, data, assets, ttl) {
        if (assets === void 0) { assets = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var metadata, time_to_leave, payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = data ? utils_1.Seed.constructMetadata(data) : undefined;
                        time_to_leave = ttl ? { quantity: ttl, unit: models_1.WalletswalletIdpaymentfeesTimeToLiveUnitEnum.Second } : undefined;
                        payload = {
                            passphrase: passphrase,
                            payments: addresses.map(function (addr, i) {
                                var _a;
                                var amount = { unit: models_1.WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
                                var payment = {
                                    address: addr.address,
                                    amount: amount,
                                    assets: (_a = assets[addr.id]) === null || _a === void 0 ? void 0 : _a.map(function (a) {
                                        var asset = {
                                            policy_id: a.policy_id,
                                            asset_name: a.asset_name,
                                            quantity: a.quantity
                                        };
                                        return asset;
                                    })
                                };
                                return payment;
                            }),
                            metadata: metadata,
                            time_to_live: time_to_leave
                        };
                        return [4 /*yield*/, this.transactionsApi.postTransaction(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, transaction_wallet_1.TransactionWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.estimateDelegationFee = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stakePoolApi.getDelegationFee(this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, fee_wallet_1.FeeWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.delegate = function (poolId, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            passphrase: passphrase
                        };
                        return [4 /*yield*/, this.stakePoolApi.joinStakePool(payload, poolId, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, transaction_wallet_1.TransactionWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.withdraw = function (passphrase, addresses, amounts) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            passphrase: passphrase,
                            payments: addresses.map(function (addr, i) {
                                var amount = { unit: models_1.WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] };
                                var payment = {
                                    address: addr.address,
                                    amount: amount
                                };
                                return payment;
                            }),
                            withdrawal: models_1.ApiPostTransactionDataWithdrawalEnum.Self
                        };
                        return [4 /*yield*/, this.transactionsApi.postTransaction(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, transaction_wallet_1.TransactionWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.stopDelegation = function (passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            passphrase: passphrase
                        };
                        return [4 /*yield*/, this.stakePoolApi.quitStakePool(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, transaction_wallet_1.TransactionWallet.from(res.data)];
                }
            });
        });
    };
    ShelleyWallet.prototype.getCoinSelection = function (addresses, amounts, data, assets) {
        if (assets === void 0) { assets = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var metadata, payload, res, err_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        metadata = data ? utils_1.Seed.constructMetadata(data) : undefined;
                        payload = {
                            payments: addresses.map(function (addr, i) {
                                var _a;
                                var amount = amounts[i] ? { unit: models_1.WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace, quantity: amounts[i] } : undefined;
                                var payment = {
                                    address: addr.address,
                                    amount: amount,
                                    assets: (_a = assets[addr.id]) === null || _a === void 0 ? void 0 : _a.map(function (a) {
                                        var asset = {
                                            policy_id: a.policy_id,
                                            asset_name: Buffer.from(a.asset_name).toString('hex'),
                                            quantity: a.quantity
                                        };
                                        return asset;
                                    })
                                };
                                return payment;
                            }),
                            metadata: metadata
                        };
                        return [4 /*yield*/, this.coinSelectionsApi.selectCoins(payload, this.id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, coin_selection_wallet_1.CoinSelectionWallet.from(res.data)];
                    case 2:
                        err_1 = _a.sent();
                        error = err_1;
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShelleyWallet.prototype.updateData = function (data) {
        this.address_pool_gap = data.address_pool_gap;
        this.balance = data.balance;
        this.assets = data.assets;
        this.delegation = data.delegation;
        this.name = data.name;
        this.passphrase = data.passphrase;
        this.state = data.state;
        this.tip = data.tip;
    };
    return ShelleyWallet;
}());
exports.ShelleyWallet = ShelleyWallet;
//# sourceMappingURL=shelley-wallet.js.map