const { WalletServer , Seed , Config, Bip32PrivateKey } = require('cardano-wallet-js');

const scriptKeys = [
    'xprv1squ6k24vhx4qrfy97qwk8wjf8rmp7ssf9n89h5u2k4kazqt20p2r2sc06jgg9z5ylvl2m3l4mf7pq4fhfcycs98h9yjweecyh7vtsjrjae9k4t5cnvllxju5pvmxegsd692tcp7tep02r97fdddlmmk0ps60c6v5',
    'xprv1cqcnfm0j09rtxevtt2s5axr5868cudt6rstarus3azvd7f3u8et4j7qk2awfa4hn9cn6hxjjx7xrkzy8s6tdvzl8sqdsavw7n32meu70wsu0afmc95vnujagmdvnxc75hta43pg60akq6h3rdzvl5e0r7u3su462'
  ];

const signingKeys = scriptKeys.map(key => Bip32PrivateKey.from_bech32(key).to_raw_key());

// get native script (this is the SAME SCRIPT, we're just "loading" it back)
const jsonScript = {
    type: 'all',
    scripts: [
      {
        type: 'sig',
        keyHash: '95e0f148bb270133239464baf72090dcf033764522ec269436652eac'
      },
      {
        type: 'sig',
        keyHash: 'bb53505355d502570d6e0c04277e1dc05fe3fb568b803f8bac33577e'
      }
    ]
  };

// set network configuration
let buildOpts = {
    startSlot: 0, 
    config: Config.Testnet,
};

const ttl = 445331390; // slot before the tx should be processed

const CoinSelectionWallet = {
    "inputs": [
        {
            "amount": {
                "quantity": 10000000,
                "unit": "lovelace"
            },
            "address": "addr_test1xphfwgceqnr7mv8tfwwu09xhptae8nldwew0fywns3vd08twju33jpx8akcwkjuac72dwzhmj0876aju7jga8pzc67wsuvddag", // script address
            "id": "7aec77f1940ba97b68eae3b2525694e4f0c801b97493e15031f29beebc4ec72e",
            "assets": [],
            "index": 0
        },
    ],
    "change": [
        {
            "amount": {
                "quantity": 8820000, // fee of 180000 initially
                "unit": "lovelace"
            },
            "address": "addr_test1xphfwgceqnr7mv8tfwwu09xhptae8nldwew0fywns3vd08twju33jpx8akcwkjuac72dwzhmj0876aju7jga8pzc67wsuvddag",
            "assets": []
        }
    ],
    "outputs": [
        {
            "amount": {
                "quantity": 1000000,
                "unit": "lovelace"
            },
            "address": "addr_test1qqk7ut3k5z3fc62s8yjse8s5j76aedazf9rmyz9es4cd4mzr5gtdwq4yajng57kje93tt3fkc5k8cvvem7vl8yql2mcstr83d7",
            "assets": []
        }
    ]
};

const script = Seed.buildScript(jsonScript);
// for the script witnesses we only need to specify the native script root
const scripts = [script.root];

// build the tx (you can include signingkeys here, eg: let tx = Seed.buildTransactionMultisig(selection, ttl, scripts, 2, null, sigingKeys, buildOpts);)
let tx = Seed.buildTransactionMultisig(CoinSelectionWallet, ttl, scripts, 2, null, [], buildOpts);
// add witness
tx.addKeyWitnesses(signingKeys[0]);

// add witness
tx.addKeyWitnesses(signingKeys[1]);

const signed = tx.build();
console.log(signed)
