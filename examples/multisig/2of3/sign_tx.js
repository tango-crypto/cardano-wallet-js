const { WalletServer , Seed , Config, Bip32PrivateKey } = require('cardano-wallet-js');

const scriptKeys = [
    'xprv13pg4p80uwhcgugkkepraakpf7lc556w9j6ejcx4rrqc0re88cep96s4df96sz4xhprtuk440uf9fstv4y5jkaxhtmckhhq0fe56s3hzukf4w0t6uqax7fyq0mevhmram49fa6ndz0ld6lyawl5adhv073s99utcc',
    'xprv1czu6a0asmlmcen65cjft0z9yrry36365vtjfatfxkxkp0jhjr9w5smhe69zgshg27te896xw3scfa6c784wq43lmnc3ra577nl05wgnhxkdgnnqlx48f0vln20tptywqupdehnm2m42ec9gdnnlc2zk8yshknqyl',
    'xprv1wztp07qymhkx0t047ngh8uf57mk3yndh67ng5ds0pxysehe594z5fzfza4z3hm24dc50dyqfy6a7500k3dg7cnv9j4fp3k8mymw078dhxm77nk5cv0can8dry4smcyd6gmqeqd68hnhzvmrtdc5qt55005dpchqd'
  ];

const signingKeys = scriptKeys.map(key => Bip32PrivateKey.from_bech32(key).to_raw_key());

// get native script (this is the SAME SCRIPT, we're just "loading" it back)
const jsonScript = {
    type: 'atLeast',
    require: 2,
    scripts: [
      {
        type: 'sig',
        keyHash: '8007621a87d888fce3e84c3b6a6846758cfe8dfdb4979899434fe905'
      },
      {
        type: 'sig',
        keyHash: 'dade6048bf128bb15bb9135d9f8b4fcc970945d5a3cf8cf2165e641a'
      },
      {
        type: 'sig',
        keyHash: '030cffb68bf2f15364259ea8484f7ab6a978abf60a95d601e8ff0d97'
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
            "address": "addr_test1xzfyhp0089dlvcvqg2gq3grwd6uu0yfhxpaxa0np4smwjavjfwz77w2m7escqs5spzsxum4ec7gnwvr6d6lxrtpka96ssvtdj5", // script address
            "id": "796aa5ca37d19193f837940ab8845b4808fb10aa34f40c9bc62584cd17b1622d",
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
            "address": "addr_test1xzfyhp0089dlvcvqg2gq3grwd6uu0yfhxpaxa0np4smwjavjfwz77w2m7escqs5spzsxum4ec7gnwvr6d6lxrtpka96ssvtdj5",
            "assets": []
        }
    ],
    "outputs": [
        {
            "amount": {
                "quantity": 1000000,
                "unit": "lovelace"
            },
            "address": "addr_test1qznup567ujylt54wecqtknc2tlp5htaw2ywghh0dcxtxtz6r5gtdwq4yajng57kje93tt3fkc5k8cvvem7vl8yql2mcsn3hwwk",
            "assets": []
        }
    ]
};

const script = Seed.buildScript(jsonScript);
// for the script witnesses we only need to specify the native script root
const scripts = [script.root];

// build the tx (you can include signingkeys here, eg: let tx = Seed.buildTransactionMultisig(selection, ttl, scripts, null, signingKeys, buildOpts);)
let tx = Seed.buildTransactionMultisig(CoinSelectionWallet, ttl, scripts, null, [], buildOpts);
// add witness
tx.addKeyWitnesses(signingKeys[0]);

// encode/decode multisig tx
const encode = tx.toBytes();
tx = MultisigTransaction.fromBytes(encode);

// add witness
tx.addKeyWitnesses(signingKeys[1]);


const signed = tx.build();
console.log(signed)