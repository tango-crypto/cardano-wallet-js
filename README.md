# cardano-wallet-js (powered by TANGO stake pool)
cardano-wallet is a javascript/typescript client for the official [cardano-wallet](https://github.com/input-output-hk/cardano-wallet)

## Introduction
The cardano-wallet exposes a REST api/CLI interface which allows
clients to perform common tasks on the cardano-blockchain, such as:
 - creating or restoring a wallet
 - submitting a transaction with or without [metadata](https://github.com/input-output-hk/cardano-wallet/wiki/TxMetadata) 
 - checking on the status of the node
 - listing transactions
 - listing wallets

Our project aims to provide an easy to use API for programmers, instead of
exposing the raw REST structure to you. 

Finally, it helps you to build desktop wallet clients - like [Daedalus](https://daedaluswallet.io/) - with
embedded cardano-wallet binaries, so you don't necessarily have to 
connect to a remote cardano-wallet server.

## Warning
The `cardano-wallet` backend was not designed to be exposed as a 
public web service. The use case for it is close to 1 server <-> 1 client 
(or a few clients). Don't try creating and 
managing wallets if it's not running locally.

# Requirements
Before start using the library you will need a `cardano-wallet` server running. If you have docker available you can just
download the `docker-composer.yml` they provide and start it using `docker-compose`:

    wget https://raw.githubusercontent.com/input-output-hk/cardano-wallet/master/docker-compose.yml
    NETWORK=testnet docker-compose up

> **NOTE:** You can find more information about different options to start the cardano-wallet server [here](https://github.com/input-output-hk/cardano-wallet)

## Installation
Using npm:

    npm i cardano-wallet-js

## Usage
To begin, start with a `WalletServer`. It allows you to connect to some remote `cardano-wallet` service.

### Connecting to a cardano-wallet service

    const { WalletServer } = require('cardano-wallet-js');
    let walletServer = WalletServer.init('http://you.server.com');
    
### Blockchain Information
First you can try is getting some blockchain information like: (network parameters, information and clock)

Get network information

    let information = await walletServer.getNetworkInformation();
    console.log(information);
This will print out something like this:

    {
        "network_tip": {
            "time": "2021-04-12T21:59:25Z",
            "epoch_number": 125,
            "absolute_slot_number": 23895549,
            "slot_number": 265149
        },
        "node_era": "mary",
        "node_tip": {
            "height": {
                "quantity": 0,
                "unit": "block"
            },
            "time": "2019-07-24T20:20:16Z",
            "epoch_number": 0,
            "absolute_slot_number": 0,
            "slot_number": 0
        },
        "sync_progress": {
            "status": "syncing",
            "progress": {
                "quantity": 0,
                "unit": "percent"
            }
        },
        "next_epoch": {
            "epoch_start_time": "2021-04-14T20:20:16Z",
            "epoch_number": 126
        }
    }

Get network parameters

    let parameters = await walletServer.getNetworkParameters();
    console.log(parameters);
This will print out something like this:
    
    {
        "slot_length": {
            "quantity": 1,
            "unit": "second"
        },
        "decentralization_level": {
            "quantity": 100,
            "unit": "percent"
        },
        "genesis_block_hash": "96fceff972c2c06bd3bb5243c39215333be6d56aaf4823073dca31afe5038471",
        "blockchain_start_time": "2019-07-24T20:20:16Z",
        "desired_pool_number": 500,
        "epoch_length": {
            "quantity": 432000,
            "unit": "slot"
        },
        "eras": {
            "shelley": {
                "epoch_start_time": "2020-07-28T20:20:16Z",
                "epoch_number": 74
            },
            "mary": {
                "epoch_start_time": "2021-02-03T20:20:16Z",
                "epoch_number": 112
            },
            "byron": {
                "epoch_start_time": "2019-07-24T20:20:16Z",
                "epoch_number": 0
            },
            "allegra": {
                "epoch_start_time": "2020-12-15T20:20:16Z",
                "epoch_number": 102
            }
        },
        "active_slot_coefficient": {
            "quantity": 5,
            "unit": "percent"
        },
        "security_parameter": {
            "quantity": 2160,
            "unit": "block"
        },
        "minimum_utxo_value": {
            "quantity": 1000000,
            "unit": "lovelace"
        }
    }
    
Get network clock

    let clock = await walletServer.getNetworkClock();
    console.log(clock);
This will print out something like this:

    {
        "status": "available",
        "offset": {
            "quantity": 405623,
            "unit": "microsecond"
        }
    }


# Test

## Stack
you'll need to install stak >= 1.9.3
you can find it here: https://docs.haskellstack.org/en/stable/README/
You may need to install the libsodium-dev, libghc-hsopenssl-dev, gmp, sqlite and systemd development libraries for the build to succeed.

The setup steps are quite simple:
clone: `cardano-wallet`
execute: `stack install cardano-wallet:exe:local-cluster`
Set a specific port `export CARDANO_WALLET_PORT=7355` so the wallet always start at the same port.
run `~/.local/bin/local-cluster`
