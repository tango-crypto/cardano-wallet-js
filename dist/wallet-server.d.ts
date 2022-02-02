import { WalletsApi, NetworkApi, StakePoolsApi, SettingsApi, ProxyApi } from './api';
import { Configuration } from './configuration';
import { MaintenanceActionWallet } from './wallet/maintenance-action-wallet';
import { ShelleyWallet } from './wallet/shelley-wallet';
import { StakePoolWallet } from './wallet/stakepool-wallet';
export declare class WalletServer {
    protected url: string;
    networkApi: NetworkApi;
    walletsApi: WalletsApi;
    config: Configuration;
    stakePoolsApi: StakePoolsApi;
    settingsApi: SettingsApi;
    proxyApi: ProxyApi;
    private constructor();
    static init(url: string): WalletServer;
    getNetworkInformation(): Promise<import("./models").ApiNetworkInformation>;
    getNetworkClock(): Promise<import("./models").ApiNetworkClock>;
    getNetworkParameters(): Promise<import("./models").ApiNetworkParameters>;
    wallets(): Promise<ShelleyWallet[]>;
    createOrRestoreShelleyWallet(name: string, mnemonic_sentence: string[], passphrase: string, mnemonic_second_factor?: string[], address_pool_gap?: string): Promise<ShelleyWallet>;
    getShelleyWallet(id: any): Promise<ShelleyWallet>;
    getStakePools(stake?: number): Promise<StakePoolWallet[]>;
    stakePoolMaintenanceActions(): Promise<MaintenanceActionWallet>;
    triggerStakePoolGarbageCollection(): Promise<void>;
    updateMetadataSource(metadataSource: string): Promise<void>;
    getMetadataSource(): Promise<any>;
    submitTx(tx: string): Promise<string>;
}
