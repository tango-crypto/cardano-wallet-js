import { expect } from 'chai';
import 'mocha';
import { WalletswalletIdpaymentfeesAmountUnitEnum, WalletsAssetsAvailable } from '../models';
import { Seed } from '../utils';
import { CoinSelectionWallet } from '../wallet/coin-selection-wallet';

describe('Wallet utilities', function(){
	let phrase = ["joy","private","elder","ocean","mobile","orient","arrest","assume","monkey","once","thought","like","warfare","spread","stable"];
	let root = "root_xsk15p57eahg2mx0araax2tlc5gulvs20sta28m5f7mj4qs38c7ltpthdxgd4kssvun4frvdraln6ggcu0xmmn3f24z8nf0fvq9sel68qsvxxjny4yawzlwte6ac27yy3ve3vdkykgt082vvjjvqfa2w7kutrydwktu5"; 
	let privateK = "addr_xsk1rzkp85k5m6afj7es8n3n2nzxd8hrljs7rpat9zv8d9r54a7ltpt398m7vxqr2dkvjdy8y99uxy5f58je735pjv9nf4mhngmll3vcezle96kke9e3gupjra0cga730ds64qzr4kq5jltxz9awrt0shcg87yp3mpgc";
	let signingKey = {
    "type": "PaymentExtendedSigningKeyShelley_ed25519_bip32",
    "description": "",
    "cborHex": "588018ac13d2d4deba997b303ce3354c4669ee3fca1e187ab2898769474af7df5857129f7e61803536cc93487214bc31289a1e59f4681930b34d7779a37ffc598c8b73dd733cc50d594cb89d3ac67287b02dae00982fc800e9c9c9d1bb282b561225f92ead6c9731470321f5f8477d17b61aa8043ad81497d66117ae1adf0be107f1"
	};

	let coinSelection: CoinSelectionWallet = {
    "withdrawals": [] as any[],
    "inputs": [
        {
            "amount": {
                "quantity": 2831199,
                "unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
            },
            "address": "addr_test1qrqw3p554dtf7sj986u4p76wc9xt2r6dt5n2eqlaask9qhvp308t7804rjzz8xq9hz3np450m0puq37p9w6vx9evhyus0fldvl",
            "id": "6b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e377",
            "derivation_path": [
                "1852H",
                "1815H",
                "0H",
                "1",
                "0"
            ],
            "assets": [],
            "index": 0
        },
        {
            "amount": {
                "quantity": 1500000,
                "unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
            },
            "address": "addr_test1qrwwqf0yj50uzxx8yr6gv6lzdcwn8azkfcql4umt5ftty4yp308t7804rjzz8xq9hz3np450m0puq37p9w6vx9evhyusz9fhph",
            "id": "2316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927",
            "derivation_path": [
                "1852H",
                "1815H",
                "0H",
                "0",
                "1"
            ],
            "assets": [],
            "index": 0
        }
    ],
    "deposits": [],
    "change": [
        {
            "amount": {
                "quantity": 2156194,
                "unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
            },
            "address": "addr_test1qqg2rfscx0nmejqegd7vuvmzcep5axjyku7z8rmkj9l7euyp308t7804rjzz8xq9hz3np450m0puq37p9w6vx9evhyuslem9qg",
            "derivation_path": [
                "1852H",
                "1815H",
                "0H",
                "1",
                "1"
            ],
            "assets": []
        }
    ],
    "outputs": [
        {
            "amount": {
                "quantity": 2000000,
                "unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
            },
            "address": "addr_test1qq7jm88trfrmcxmzkaycefykk948kjaucmvhah5ph2rzr67km9rcwh70fpz77wjlprw42gjcrnmdu7uuqefhnjanw4xsupazrx",
            "assets": []
        }
    ]
	};

	let txRawOther = {
    "type": "TxBodyMary",
    "description": "",
    "cborHex": "82a400828258202316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927008258206b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e3770001828258390010a1a61833e7bcc819437cce3362c6434e9a44b73c238f76917fecf0818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a0020e6a2825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e848002000300f6"
	};

	let txRaw = {
    "type": "TxBodyMary",
    "description": "",
    "cborHex": "82a400818258202d7928a59fcba5bf71c40fe6428a301ffda4d2fa681e5357051970436462b89400018282583900c0e88694ab569f42453eb950fb4ec14cb50f4d5d26ac83fdec2c505d818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a002b335f825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e8480021a00029361031a01672b7ef6"
	};

	let signedKey = {
    "type": "Tx MaryEra",
    "description": "",
    "cborHex": "83a400818258202d7928a59fcba5bf71c40fe6428a301ffda4d2fa681e5357051970436462b89400018282583900c0e88694ab569f42453eb950fb4ec14cb50f4d5d26ac83fdec2c505d818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a002b335f825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e8480021a00029361031a01672b7ea1008182582073dd733cc50d594cb89d3ac67287b02dae00982fc800e9c9c9d1bb282b56122558404d0cb4e4f1cc415ddcf546871f075d0ca6e0c2620cd784b06c21c9b86e4403cb7a115038487576dcb20e7820e9d0dc93ab2a737ed9d0a71a77bc1e12f7c4dd0ef6"
	};

	it('should generate a recovery phrase string', function(){
		let recoveryPhrase = Seed.generateRecoveryPhrase();
		expect(recoveryPhrase).be.a('string');
	});

	it('should generate a recovery phrase string', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
		expect(words).lengthOf(15);
	});

	it('should return root key from recovery phrase', function(){
		let rootKey = Seed.rootKeyFromRecoveryPhrase(phrase);
		expect(root).equal(rootKey);
	});

	it("should return derive private/signing key from root", function(){
		let privateKey = Seed.derivePrivateKey(root, '1852H/1815H/0H/0/0');
		expect(privateK).equal(privateKey);
	});

	it("should convert private key (cardano-address format) to signing key (cardano-cli format)", function(){
		let signing = Seed.convertPrivateKeyToSigningKey(privateK);
		expect(signingKey).deep.equal(signing);
	});

	it("should build a raw transaction", function(){
		let txBuild = Seed.buildTransaction(coinSelection, 0, 0);
		expect(txRawOther).deep.equal(txBuild);
	});

	it("should sign a tx", function(){
		let signed = Seed.sign(txRaw, [signingKey], '--testnet-magic', '1097911063');
		expect(signedKey).deep.equal(signed);
	})

	
});