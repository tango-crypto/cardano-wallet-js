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

## Useful operations

### Generate Recovery Phrases
   
    const { Seed } = require('cardano-wallet-js');
    
    // generate a recovery phrase of 15 words (default)
    let recoveryPhrase = Seed.generateRecoveryPhrase();
    console.log(recoveryPhrase);
   
    Output:
    >> "hip dust material keen buddy fresh thank program stool ill regret honey multiply venture imitate"
> **IMPORTANT:** The recovery phrase is the only way you can restore you wallet and you **SHOULD KEEP IT SECURE AND PRIVATE**. You'll get a complete different recovery phrase each time you execute the method. 

For convinience you can convert the recovery phrase into an array using this:

    let words = Seed.toMnemonicList(recoveryPhrase);
    console.log(words);
    
    Output:
    >> ['hip', 'dust', 'material', 'keen', 'buddy', 'fresh', 'thank', 'program', 'stool', 'ill', 'regret', 'honey', 'multiply', 'venture', 'imitate']

### Wallet

Create/restore a wallet:

    const { Seed, WalletServer } = require('cardano-wallet-js');
    
    let walletServer = WalletServer.init('http://you.server.com');
    let recoveryPhrase = Seed.generateRecoveryPhrase();
    let mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
    let passphrase = 'tangocrypto';
    let name = 'tangocrypto-wallet';
    
    let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_sentence, passphrase);
    
List wallets:
    
    let wallets = await walletServer.wallets();
    
Get wallet by Id:

    let wallets = await walletServer.wallets();
    let id = wallets[0].id;
    let wallet = await walletServer.getShelleyWallet(id);

Get wallet's utxo statistics:

    let statistics = await wallet.getUtxoStatistics();
    
Statistics will contain the UTxOs distribution across the whole wallet, in the form of a histogram similar to the one below.
<pre><code>     │
 <span class="token number">100</span> ─
     │
     │                                 ┌───┐
  <span class="token number">10</span> ─                         ┌───┐   │   │                   ┌───┐
     │                 ┌───┐   │   │   │   │                   │   │
     │                 │   │   │   │   │   │   ┌───┐           │   │
   <span class="token number">1</span> ─ ┌───┐           │   │   │   │   │   │   │   │           │   │
     │ │   │           │   │   │   │   │   │   │   │           │   │
     │ │   │ │       │ │   │ │ │   │ ╷ │   │ ╷ │   │ ╷       ╷ │   │
     └─┘   └─│───────│─┘   └─│─┘   └─│─┘   └─│─┘   └─│───────│─┘   └────
           <span class="token number">10</span>μ₳    <span class="token number">100</span>μ₳   <span class="token number">1000</span>μ₳   <span class="token number">0.1</span>₳    <span class="token number">1</span>₳      <span class="token number">10</span>₳     <span class="token number">100</span>₳</code></pre>
           
Remove wallet:

    await wallet.delete();
    
Rename wallet:

    let newName = 'new-name';
    wallet = await wallet.rename(newName);

Change wallet passphrase:

    let oldPassphrase = 'tangocrypto';
    let newPassphrase = 'new-passphrase';
    wallet = await wallet.updatePassphrase(oldPassphrase, newPassphrase);
> **NOTE**: the wallet itself doesn't hold the passphrase, you can check it's correctly updated trying to call a method needing the passphrase e.g: `sendPayment`

### Wallet addresses
Cardano wallets are Multi-Account Hierarchy Deterministic that follow a variation of BIP-44 described [here](https://github.com/input-output-hk/implementation-decisions/blob/e2d1bed5e617f0907bc5e12cf1c3f3302a4a7c42/text/1852-hd-chimeric.md). All the addresses are derived from a root key (is like a key factory) which you can get from the recovery phrase. Also the wallets will always have 20 "consecutive" unused address, so anytime you use one of them new address will be "discovered" to keep the rule.

    let addresses = await wallet.getAddresses(); // list will contain at least 20 address

Get unused addresses:

    let unusedAddresses = await wallet.getUnusedAddresses();
    
Get used addresses:

    let usedAddresses = await wallet.getUsedAddresses();

You can create/discover next unused address:

    // you'll get the n-th address where n is the current addresses list length 
    let address = await wallet.getNextAddress();    
    
    // you can also pass the specific index
     let address = await wallet.getAddressAt(45);  

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
