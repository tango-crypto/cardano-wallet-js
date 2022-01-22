const { WalletServer , Seed } = require('cardano-wallet-js');

const data = {
    "type":  "atLeast", //requires at least 2 keys to sing the tx
    "require": 2,
    "scripts":
    [
        {
            "type": "sig",
        },
        {
            "type":  "sig"
        },
        {
            "type":  "sig"
        },
    ]
};
// generate the native script
const script = Seed.buildScript(data);

const jsonScript = Seed.scriptToJson(script);

console.log(jsonScript);

// get native script private keys (all them will be needed to sign the final tx)
const keys = Seed.getScriptKeys(script).map(k => k.to_bech32());
console.log("keys:", keys);

//Generate script address
const address = Seed.getScriptAddress(script, 'testnet').to_bech32();
console.log("address:", address);

// now send some Ada to the generated address