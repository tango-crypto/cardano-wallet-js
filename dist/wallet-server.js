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
exports.WalletServer = void 0;
var api_1 = require("./api");
var models_1 = require("./models");
var maintenance_action_wallet_1 = require("./wallet/maintenance-action-wallet");
var shelley_wallet_1 = require("./wallet/shelley-wallet");
var stakepool_wallet_1 = require("./wallet/stakepool-wallet");
var WalletServer = /** @class */ (function () {
    function WalletServer(url) {
        this.url = url;
        this.config = {
            basePath: url
        };
        this.networkApi = new api_1.NetworkApi(this.config);
        this.walletsApi = new api_1.WalletsApi(this.config);
        this.stakePoolsApi = new api_1.StakePoolsApi(this.config);
        this.settingsApi = new api_1.SettingsApi(this.config);
        this.proxyApi = new api_1.ProxyApi(this.config);
    }
    WalletServer.init = function (url) {
        return new WalletServer(url);
    };
    WalletServer.prototype.getNetworkInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkApi.getNetworkInformation()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    WalletServer.prototype.getNetworkClock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkApi.getNetworkClock()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    WalletServer.prototype.getNetworkParameters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkApi.getNetworkParameters()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    WalletServer.prototype.wallets = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsApi.listWallets()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (w) { return shelley_wallet_1.ShelleyWallet.from(w, _this.config); })];
                }
            });
        });
    };
    WalletServer.prototype.createOrRestoreShelleyWallet = function (name, mnemonic_sentence, passphrase, mnemonic_second_factor, address_pool_gap) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, res, apiWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            name: name,
                            mnemonic_sentence: mnemonic_sentence,
                            passphrase: passphrase,
                            mnemonic_second_factor: mnemonic_second_factor,
                            address_pool_gap: address_pool_gap
                        };
                        return [4 /*yield*/, this.walletsApi.postWallet(payload)];
                    case 1:
                        res = _a.sent();
                        apiWallet = res.data;
                        return [2 /*return*/, shelley_wallet_1.ShelleyWallet.from(apiWallet, this.config)];
                }
            });
        });
    };
    WalletServer.prototype.getShelleyWallet = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletsApi.getWallet(id)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, shelley_wallet_1.ShelleyWallet.from(res.data, this.config)];
                }
            });
        });
    };
    WalletServer.prototype.getStakePools = function (stake) {
        if (stake === void 0) { stake = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stakePoolsApi.listStakePools(stake)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (pool) { return stakepool_wallet_1.StakePoolWallet.from(pool); })];
                }
            });
        });
    };
    WalletServer.prototype.stakePoolMaintenanceActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stakePoolsApi.getMaintenanceActions()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, new maintenance_action_wallet_1.MaintenanceActionWallet(res.data.gc_stake_pools)];
                }
            });
        });
    };
    WalletServer.prototype.triggerStakePoolGarbageCollection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            maintenance_action: models_1.ApiMaintenanceActionPostDataMaintenanceActionEnum.Pools
                        };
                        return [4 /*yield*/, this.stakePoolsApi.postMaintenanceAction(payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WalletServer.prototype.updateMetadataSource = function (metadataSource) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            settings: {
                                pool_metadata_source: metadataSource
                            }
                        };
                        return [4 /*yield*/, this.settingsApi.putSettings(payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WalletServer.prototype.getMetadataSource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.settingsApi.getSettings()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.pool_metadata_source];
                }
            });
        });
    };
    WalletServer.prototype.submitTx = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buffer = Buffer.from(tx, 'hex');
                        return [4 /*yield*/, this.proxyApi.postExternalTransaction(buffer)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.id];
                }
            });
        });
    };
    return WalletServer;
}());
exports.WalletServer = WalletServer;
//# sourceMappingURL=wallet-server.js.map