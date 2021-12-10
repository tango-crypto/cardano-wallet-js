import * as ByronGenesis from './mainnet-byron-genesis.json';
import * as ShelleyGenesis from './mainnet-shelley-genesis.json';
import * as AlonzoGenesis from './mainnet-alonzo-genesis.json';
import * as Protocols from './mainnet-protocol.json';

import * as TestnetByronGenesis from './testnet-byron-genesis.json';
import * as TestnetShelleyGenesis from './testnet-shelley-genesis.json';
import * as TestnetAlonzoGenesis from './testnet-alonzo-genesis.json';
import * as TestnetProtocols from './testnet-protocol.json';

import * as LocalClusterByronGenesis from './local-cluster-byron-genesis.json';
import * as LocalClusterShelleyGenesis from './local-cluster-shelley-genesis.json';
import * as LocalClusterAlonzoGenesis from './local-cluster-alonzo-genesis.json';
import * as LocalClusterProtocols from './local-cluster-protocol.json';

export const Mainnet = {
    byron: ByronGenesis,
    shelley: ShelleyGenesis,
    alonzo: AlonzoGenesis,
    protocols: Protocols

}

export const Testnet = {
    byron: TestnetByronGenesis,
    shelley: TestnetShelleyGenesis,
    alonzo: TestnetAlonzoGenesis,
    protocols: TestnetProtocols
}

export const LocalCluster = {
    byron: LocalClusterByronGenesis,
    shelley: LocalClusterShelleyGenesis,
    alonzo: LocalClusterAlonzoGenesis,
    protocols: LocalClusterProtocols
}