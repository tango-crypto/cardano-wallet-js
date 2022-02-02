"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCluster = exports.Testnet = exports.Mainnet = void 0;
var ByronGenesis = require("./mainnet-byron-genesis.json");
var ShelleyGenesis = require("./mainnet-shelley-genesis.json");
var AlonzoGenesis = require("./mainnet-alonzo-genesis.json");
var Protocols = require("./mainnet-protocol.json");
var TestnetByronGenesis = require("./testnet-byron-genesis.json");
var TestnetShelleyGenesis = require("./testnet-shelley-genesis.json");
var TestnetAlonzoGenesis = require("./testnet-alonzo-genesis.json");
var TestnetProtocols = require("./testnet-protocol.json");
var LocalClusterByronGenesis = require("./local-cluster-byron-genesis.json");
var LocalClusterShelleyGenesis = require("./local-cluster-shelley-genesis.json");
var LocalClusterAlonzoGenesis = require("./local-cluster-alonzo-genesis.json");
var LocalClusterProtocols = require("./local-cluster-protocol.json");
exports.Mainnet = {
    byron: ByronGenesis,
    shelley: ShelleyGenesis,
    alonzo: AlonzoGenesis,
    protocols: Protocols
};
exports.Testnet = {
    byron: TestnetByronGenesis,
    shelley: TestnetShelleyGenesis,
    alonzo: TestnetAlonzoGenesis,
    protocols: TestnetProtocols
};
exports.LocalCluster = {
    byron: LocalClusterByronGenesis,
    shelley: LocalClusterShelleyGenesis,
    alonzo: LocalClusterAlonzoGenesis,
    protocols: LocalClusterProtocols
};
//# sourceMappingURL=network.config.js.map