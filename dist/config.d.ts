export declare const Config: {
    Mainnet: {
        activeSlotsCoeff: number;
        protocolParams: {
            protocolVersion: {
                minor: number;
                major: number;
            };
            decentralisationParam: number;
            eMax: number;
            extraEntropy: {
                tag: string;
            };
            maxTxSize: number;
            maxBlockBodySize: number;
            maxBlockHeaderSize: number;
            minFeeA: number;
            minFeeB: number;
            minUTxOValue: number;
            poolDeposit: number;
            minPoolCost: number;
            keyDeposit: number;
            nOpt: number;
            rho: number;
            tau: number;
            a0: number;
        };
        genDelegs: {
            ad5463153dc3d24b9ff133e46136028bdc1edbb897f5a7cf1b37950c: {
                delegate: string;
                vrf: string;
            };
            b9547b8a57656539a8d9bc42c008e38d9c8bd9c8adbb1e73ad529497: {
                delegate: string;
                vrf: string;
            };
            "60baee25cbc90047e83fd01e1e57dc0b06d3d0cb150d0ab40bbfead1": {
                delegate: string;
                vrf: string;
            };
            f7b341c14cd58fca4195a9b278cce1ef402dc0e06deb77e543cd1757: {
                delegate: string;
                vrf: string;
            };
            "162f94554ac8c225383a2248c245659eda870eaa82d0ef25fc7dcd82": {
                delegate: string;
                vrf: string;
            };
            "2075a095b3c844a29c24317a94a643ab8e22d54a3a3a72a420260af6": {
                delegate: string;
                vrf: string;
            };
            "268cfc0b89e910ead22e0ade91493d8212f53f3e2164b2e4bef0819b": {
                delegate: string;
                vrf: string;
            };
        };
        updateQuorum: number;
        networkId: string;
        initialFunds: {};
        maxLovelaceSupply: number;
        networkMagic: number;
        epochLength: number;
        systemStart: string;
        slotsPerKESPeriod: number;
        slotLength: number;
        maxKESEvolutions: number;
        securityParam: number;
    };
    Testnet: {
        activeSlotsCoeff: number;
        protocolParams: {
            protocolVersion: {
                minor: number;
                major: number;
            };
            decentralisationParam: number;
            eMax: number;
            extraEntropy: {
                tag: string;
            };
            maxTxSize: number;
            maxBlockBodySize: number;
            maxBlockHeaderSize: number;
            minFeeA: number;
            minFeeB: number;
            minUTxOValue: number;
            poolDeposit: number;
            minPoolCost: number;
            keyDeposit: number;
            nOpt: number;
            rho: number;
            tau: number;
            a0: number;
        };
        genDelegs: {
            "2f56e87d67b8e5216582cfeb95dbdc9083110a3ef68faaa51bef3a80": {
                delegate: string;
                vrf: string;
            };
            "514e81afb082fce01678809eebd90eda4f7918354ec7d0433ad16274": {
                delegate: string;
                vrf: string;
            };
            "2fca486b4d8f1a0432f5bf18ef473ee4294c795a1a32e3132bc6b90f": {
                delegate: string;
                vrf: string;
            };
            "4ee98623920698b77c1c7f77288cbdac5f9011ff8970b1f507567d0d": {
                delegate: string;
                vrf: string;
            };
            "0d06d2547ed371fdf95fb5c4c735eecdd53e6a5bb831561bd0fcfd3d": {
                delegate: string;
                vrf: string;
            };
            "581e23030b6038bae716e5d64b9e053db10541b12e6b0b4eff485454": {
                delegate: string;
                vrf: string;
            };
            e5f27655371b54aed91cc916b2569060978be80056768fee2cc5ce1b: {
                delegate: string;
                vrf: string;
            };
        };
        updateQuorum: number;
        networkId: string;
        initialFunds: {};
        maxLovelaceSupply: number;
        networkMagic: number;
        epochLength: number;
        systemStart: string;
        slotsPerKESPeriod: number;
        slotLength: number;
        maxKESEvolutions: number;
        securityParam: number;
    };
    LocalCluster: {
        activeSlotsCoeff: number;
        protocolParams: {
            poolDeposit: number;
            protocolVersion: {
                minor: number;
                major: number;
            };
            minUTxOValue: number;
            decentralisationParam: number;
            maxTxSize: number;
            minPoolCost: number;
            minFeeA: number;
            maxBlockBodySize: number;
            minFeeB: number;
            eMax: number;
            extraEntropy: {
                tag: string;
            };
            maxBlockHeaderSize: number;
            keyDeposit: number;
            keyDecayRate: number;
            nOpt: number;
            rho: number;
            poolMinRefund: number;
            tau: number;
            a0: number;
        };
        protocolMagicId: number;
        genDelegs: {
            "8ae01cab15f6235958b1147e979987bbdb90788f7c4e185f1632427a": {
                delegate: string;
                vrf: string;
            };
        };
        updateQuorum: number;
        networkId: string;
        maxMajorPV: number;
        initialFunds: {};
        maxLovelaceSupply: number;
        networkMagic: number;
        epochLength: number;
        staking: any;
        systemStart: string;
        slotsPerKESPeriod: number;
        slotLength: number;
        maxKESEvolutions: number;
        securityParam: number;
    };
};
