import { AssertionError, expect } from 'chai';
import 'mocha';
import { WalletswalletIdpaymentfeesAmountUnitEnum, JsonScript, ScriptTypeEnum } from '../models';
import { CARDANO_CHIMERIC, CARDANO_EXTERNAL, Seed } from '../utils';
import { CoinSelectionWallet } from '../wallet/coin-selection-wallet';
import { NetworkInfo, RewardAddress, StakeCredential, TransactionBody, Bip32PrivateKey, BaseAddress, TransactionWitnessSet } from '@emurgo/cardano-serialization-lib-nodejs';
import { Testnet } from '../config/network.config';
import * as cardanoAddresses from 'cardano-addresses';
import { MultisigTransaction } from '../models/multisig-transaction';

describe('Wallet utilities', function(){
	const phrase = ["joy","private","elder","ocean","mobile","orient","arrest","assume","monkey","once","thought","like","warfare","spread","stable"];
	const root = "xprv15p57eahg2mx0araax2tlc5gulvs20sta28m5f7mj4qs38c7ltpthdxgd4kssvun4frvdraln6ggcu0xmmn3f24z8nf0fvq9sel68qsvxxjny4yawzlwte6ac27yy3ve3vdkykgt082vvjjvqfa2w7kutryxrlgd2"; 
	const prvKey = "ed25519e_sk1rzkp85k5m6afj7es8n3n2nzxd8hrljs7rpat9zv8d9r54a7ltpt398m7vxqr2dkvjdy8y99uxy5f58je735pjv9nf4mhngmll3vcezcrackx0";
	const stakeAddress = "stake1uxqchn4lrh63epprnqzm3ges668ahs7qglqjhdxrzuktjwg9mra90";

	const coinSelection: CoinSelectionWallet = {
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

	const txRawHex = 'a500828258206b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e377008258202316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927000182825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e84808258390010a1a61833e7bcc819437cce3362c6434e9a44b73c238f76917fecf0818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a0020e6a2021a0002ab9d03000800';
	const signedKey = "84a500828258206b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e377008258202316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927000182825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e84808258390010a1a61833e7bcc819437cce3362c6434e9a44b73c238f76917fecf0818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a0020e6a2021a0002ab9d03000800a10082825820d12ee631220ea5a99639918a21ed9f69e6f611c47a3ecfaf3c41f9d63ce763ae5840951a1c0356a6ab006efb53abe2e21e23b833b209527611e37740411b2a873e10ce92c21c14d34a462d76d59538195c8dae1dab8300236f4d30fca164bb146d0582582079992cb28ed8b96d8aa4501d46006d95b0f7679b618499336dd9fa7ddb8db05d584080cad468af19f61a188f80350bf6bbd1d9ce698d1b1cf31a594128129ee1755e9e6f8a6217ed8e95f35750dbc41add12c8a5b6a6e965e338d713029747945303f5f6";

	const jsonScript: any = {
		"type": "all",
		"scripts": [
			{
				"type": "sig",
				"keyHash": "1bc93be5dc2d3e97a7d1394cc166450d3e57955290d93ca4209a7ddb"
			},
			{
				"type": "sig",
				"keyHash": "135c1e26588d9f0c8da6b2e548564d172a7629ea133b454074df97d1"
			}
		]
	};

	const scriptKeys = [
		'xprv1mzthaawdhmjqlvfsurcwe68cshsrm7ma4dgdnvennkmffqku2af9esq4r6gqs47xwj36z7q5ezv5cwt5qw3ngknm2cezttd45kn7cutxr9cp7r0qrzulqj72x34hucdp3tsqtvulk4xxyyxsnxk7zh57sc3jar6z',
		'xprv1yqhkn7psk47tpxgpurgzf4kg8p9elvldjh6634r98qdgnms9mdqrqjwj42c82pzytefwjtkju0895xe5kaq7d7sldpr6tqs8skyyqm8hw7gwrxdwyvgp4zmt2gd5xy42tlm4c5phc555aazel4dw4vml5yl33juw'
	];


	// const k = Bip32PrivateKey.from_bech32(scriptKeys[1]);
	// console.log(k.to_bech32());
	// const hex = Buffer.from(k.to_raw_key().as_bytes()).toString('hex');
	// const cborHex = "5880" + Buffer.from(k.to_128_xprv()).toString('hex');
	// console.log(cborHex);
	// console.log(hex);

	it("should derive base address from root", function(){
		//const phr = "dignity barrel hand wreck cliff retreat pass unit girl design either armed finish mercy sword much dice vault best main end secret resist capable"
		const phr = "snack skirt gown wage space priority vendor taste diamond calm pulp fatal under swap marble mention gorilla fat debate useless mimic clap curtain orient"
		const rootKey = Seed.deriveRootKey(phr);
		const accountKey = Seed.deriveAccountKey(rootKey, 0); // 1852H/1815H/0H
		for (let index = 0; index <= 0; index++) {
			
			//const index = 2;
			const paymentPuKey = accountKey
			.derive(CARDANO_EXTERNAL) // 0
			.derive(index)
			.to_raw_key()
			.to_public();
	
			const stakePubKey = accountKey
			.derive(CARDANO_CHIMERIC)
			.derive(index)
			.to_raw_key()
			.to_public();
	
			const baseAddr = BaseAddress.new(
					NetworkInfo.testnet().network_id(),
					StakeCredential.from_keyhash(paymentPuKey.hash()),
					StakeCredential.from_keyhash(stakePubKey.hash()),
				)
				.to_address()
				.to_bech32();
				console.log('index:', index, baseAddr)
		}
		console.log('end');
		// addr_test1qppaztp3qjuw999vd5qqv9gw6ucez3s326ta9qgdc4dzrh8xctla6xt8jlpmug7v0sde99c6lewhqx34yzvdk5lxtpmsmf54rc
		// expect(baseAddr).equal("addr_test1qp082geljhs9dlwhwqwzd0utypd7xetkshxw6z32vyjzvyhxqzgnxcpyqv8v5mwwnpg7r7hupdv0c9z2z2xnyvh57tas3hp890");
	});

	it('should generate a recovery phrase string', function(){
		let recoveryPhrase = Seed.generateRecoveryPhrase();
		expect(recoveryPhrase).be.a('string');
	});

	it('should generate a recovery phrase array of size 15', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
		expect(words).lengthOf(15);
	});

	it('should generate a recovery phrase array of size 24', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase(24));
		expect(words).lengthOf(24);
	});

	it('should return root key from recovery phrase', function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let bech32 = rootKey.to_bech32();
		expect(root).equal(bech32);
	});

	it("should return derive private/signing key from root", function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let privateKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','0','0']).to_raw_key()
		.to_bech32();
		expect(prvKey).equal(privateKey);
	});

	it("should return derive stake address from root", function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let stakePrvKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','2','0']).to_raw_key();
		const stakePubKey = stakePrvKey
			.to_public();

		const rewardAddr = RewardAddress.new(
				NetworkInfo.mainnet().network_id(),
				StakeCredential.from_keyhash(stakePubKey.hash())
			)
			.to_address()
			.to_bech32();
		expect(stakeAddress).equal(rewardAddr);
	});

	it("should return an enterprise address (no staking)", function() {
		const prvKey = Seed.generateBip32PrivateKey();
		const address = Seed.getEnterpriseAddress(prvKey.to_public(), 'testnet').to_bech32();

		console.log(prvKey.to_bech32());
		console.log(address);
		expect(address.startsWith('addr')).to.be.true;
	});

	it("should build and sign tx from enterprise address", function() {
		const prvKey = Bip32PrivateKey.from_bech32('xprv14qx5tsmmzyxtlw2tc5g7glc0frkc46nyzgul4yky9keujfk55drjen3s3ley734eg8wldty4e8dgwnxjguu7pra26d3px525ks0q4g38maws6cps6ndck8z8xjkxa2qpmvxq5p68ljy2q5uxmlcxasn57vyz3ppp');
		const coinSelection: CoinSelectionWallet = {
			"withdrawals": [] as any[],
			"inputs": [
				{
					"amount": {
						"quantity": 1250000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1vq38ywnzapcuxf3k9a6xrqerwfazjmyhq6kvx49h0lsddmc8f3v6v",
					"id": "75d19103fafaef92ece667fdacf745f83fa75d0d826f31d862d6be652f0525e5",
					"assets": [],
					"index": 0
				},
				{
					"amount": {
						"quantity": 2000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1vq38ywnzapcuxf3k9a6xrqerwfazjmyhq6kvx49h0lsddmc8f3v6v",
					"id": "150f60b538feb311b81071c99512a1974b221a68d53d5b23e95870c6f5b5e7ae",
					"assets": [],
					"index": 0
				},
			],
			"deposits": [],
			"change": [
				// {
				// 	"amount": {
				// 		"quantity": 18823000, // fee of 180000 initially
				// 		"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
				// 	},
				// 	"address": "addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9",
				// 	"assets": []
				// }
			],
			"outputs": [
				{
					"amount": {
						"quantity": 3000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1qzp3893hmksaxxkhd75wmftfjwucgeqlyne4cl9az0n0ghnazcna98r9s350vpnyghfsuqk2y29yq88tdcvwm8j0p5dqe0vjam",
					"assets": []
				}
			]
		};
		let buildOpts = {
            startSlot: 0, 
            config: Testnet,
        };
		let txBuild = Seed.buildTransaction(coinSelection, 445331390, buildOpts);

		let txBody = Seed.sign(txBuild, [prvKey.to_raw_key()]);
		let signed = Buffer.from(txBody.to_bytes()).toString('hex');

		console.log(signed);
		expect(signed).not.be.undefined;
	})

	it("should build a raw transaction", function(){
		let txBuild = Seed.buildTransaction(coinSelection, 0);
		let txHex = Buffer.from(txBuild.to_bytes()).toString('hex');
		expect(txRawHex).equal(txHex);
	});

	it('should inspect Shelley payment w/stake mainnet address (type 0)', async function () {
		const addr = 'addr1qxmdeseh5urn2yeehaz48haeqvyhhvtzu5hkdypukhkatcm4q5ymgqwfdyzuws8fkce3gwgf65rclqc63ftatcjp6j7scwjlm2';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 0,
			network_tag: 1, // mainnet
			spending_key_hash: "b6dcc337a707351339bf4553dfb903097bb162e52f66903cb5edd5e3",
			spending_key_hash_bech32: "addr_vkh1kmwvxda8qu63xwdlg4falwgrp9amzch99anfq094ah27xm6hjuq",
			stake_key_hash: "750509b401c96905c740e9b633143909d5078f831a8a57d5e241d4bd",
			stake_key_hash_bech32: "stake_vkh1w5zsndqpe95st36qaxmrx9pep82s0rurr299040zg82t63dk2yv",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment w/stake testnet address (type 0)', async function () {
		const addr = 'addr_test1qpmtp5t0t5y6cqkaz7rfsyrx7mld77kpvksgkwm0p7en7qum7a589n30e80tclzrrnj8qr4qvzj6al0vpgtnmrkkksnqd8upj0';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 0,
			network_tag: 0, // testnet
			spending_key_hash: "76b0d16f5d09ac02dd1786981066f6fedf7ac165a08b3b6f0fb33f03",
			spending_key_hash_bech32: "addr_vkh1w6cdzm6apxkq9hghs6vpqehklm0h4st95z9nkmc0kvlsxe7jvdf",
			stake_key_hash: "9bf76872ce2fc9debc7c431ce4700ea060a5aefdec0a173d8ed6b426",
			stake_key_hash_bech32: "stake_vkh1n0mksukw9lyaa0rugvwwguqw5ps2tthaas9pw0vw666zvnrrh52",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script w/stake mainnet address (type 1)', async function () {
		const addr = 'addr1z8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gten0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgs9yc0hh';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 1,
			network_tag: 1, // mainnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_key_hash: "337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
			stake_key_hash_bech32: "stake_vkh1xdak9nllvsp6q636e0p5lrzxqq7xnlne5d3gemafc3e9z3v4vud",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script w/stake testnet address (type 1)', async function () {
		const addr = 'addr_test1zrphkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gten0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgsxj90mg';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 1,
			network_tag: 0, // testnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_key_hash: "337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
			stake_key_hash_bech32: "stake_vkh1xdak9nllvsp6q636e0p5lrzxqq7xnlne5d3gemafc3e9z3v4vud",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment w/script mainnet address (type 2)', async function () {
		const addr = 'addr1yx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerkr0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shs2z78ve';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 2,
			network_tag: 1, // mainnet
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
			stake_script_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_script_hash_bech32: "stake_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7ps3qsu",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment w/script testnet address (type 2)', async function () {
		const addr = 'addr_test1yz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerkr0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shsf5r8qx';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 2,
			network_tag: 0, // testnet
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
			stake_script_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_script_hash_bech32: "stake_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7ps3qsu",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script mainnet address (type 3)', async function () {
		const addr = 'addr1x8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gt7r0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shskhj42g';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 3,
			network_tag: 1, // mainnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_script_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_script_hash_bech32: "stake_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7ps3qsu",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script testnet address (type 3)', async function () {
		const addr = 'addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 3,
			network_tag: 0, // testnet
			spending_shared_hash: "37b984f0e49d906998f4ac3208b961750aaab9d02f08fb68ebad2874",
			spending_shared_hash_bech32: "addr_shared_vkh1x7ucfu8ynkgxnx854seq3wtpw5924wws9uy0k68t4558gdx2kmq",
			stake_script_hash: "37b984f0e49d906998f4ac3208b961750aaab9d02f08fb68ebad2874",
			stake_script_hash_bech32: "stake_vkh1x7ucfu8ynkgxnx854seq3wtpw5924wws9uy0k68t4558grmapjy",
			stake_shared_hash: "37b984f0e49d906998f4ac3208b961750aaab9d02f08fb68ebad2874",
			stake_shared_hash_bech32: "stake_shared_vkh1x7ucfu8ynkgxnx854seq3wtpw5924wws9uy0k68t4558gr3qm8s",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment w/pointer mainnet address (type 4)', async function () {
		const addr = 'addr1gx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrzqf96k';
		const pointerInfo = {
			stake_reference: "by pointer",
			address_style: "Shelley",
			address_type: 4,
			network_tag: 1, // mainnet
			pointer: {
				output_index: 3,
				slot_num: 2498243,
				transaction_index: 27,
			},
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment w/pointer testnet address (type 4)', async function () {
		const addr = 'addr_test1gz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrdw5vky';
		const pointerInfo = {
			stake_reference: "by pointer",
			address_style: "Shelley",
			address_type: 4,
			network_tag: 0, // testnet
			pointer: {
				output_index: 3,
				slot_num: 2498243,
				transaction_index: 27,
			},
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script w/pointer mainnet address (type 5)', async function () {
		const addr = 'addr128phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtupnz75xxcrtw79hu';
		const pointerInfo = {
			stake_reference: "by pointer",
			address_style: "Shelley",
			address_type: 5,
			network_tag: 1, // mainnet
			pointer: {
				output_index: 3,
				slot_num: 2498243,
				transaction_index: 27,
			},
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script w/pointer testnet address (type 5)', async function () {
		const addr = 'addr_test12rphkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtupnz75xxcryqrvmw';
		const pointerInfo = {
			stake_reference: "by pointer",
			address_style: "Shelley",
			address_type: 5,
			network_tag: 0, // testnet
			pointer: {
				output_index: 3,
				slot_num: 2498243,
				transaction_index: 27,
			},
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment wo/stake mainnet address (type 6)', async function () {
		const addr = 'addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8';
		const pointerInfo = {
			stake_reference: "none",
			address_style: "Shelley",
			address_type: 6,
			network_tag: 1, // mainnet
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley payment wo/stake testnet address (type 6)', async function () {
		const addr = 'addr_test1vz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerspjrlsz';
		const pointerInfo = {
			stake_reference: "none",
			address_style: "Shelley",
			address_type: 6,
			network_tag: 0, // testnet
			spending_key_hash: "9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
			spending_key_hash_bech32: "addr_vkh1jjfnzhxe966a33psfenm0ct2udkkr569qf55v4uprgkgu8zsvmg",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script wo/stake mainnet address (type 7)', async function () {
		const addr = 'addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx';
		const pointerInfo = {
			stake_reference: "none",
			address_style: "Shelley",
			address_type: 7,
			network_tag: 1, // mainnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley script wo/stake testnet address (type 7)', async function () {
		const addr = 'addr_test1wrphkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcl6szpr';
		const pointerInfo = {
			stake_reference: "none",
			address_style: "Shelley",
			address_type: 7,
			network_tag: 0, // testnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley stake mainnet address (type 14)', async function () {
		const addr = 'stake1uyehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 14,
			network_tag: 1, // mainnet
			stake_key_hash: "337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
			stake_key_hash_bech32: "stake_vkh1xdak9nllvsp6q636e0p5lrzxqq7xnlne5d3gemafc3e9z3v4vud"
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley stake testnet address (type 14)', async function () {
		const addr = 'stake_test1uqehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gssrtvn';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 14,
			network_tag: 0, // testnet
			stake_key_hash: "337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
			stake_key_hash_bech32: "stake_vkh1xdak9nllvsp6q636e0p5lrzxqq7xnlne5d3gemafc3e9z3v4vud"
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley stake w/script mainnet address (type 15)', async function () {
		const addr = 'stake178phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcccycj5';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 15,
			network_tag: 1, // mainnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Shelley stake w/script testnet address (type 15)', async function () {
		const addr = 'stake_test17rphkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcljw6kf';
		const pointerInfo = {
			stake_reference: "by value",
			address_style: "Shelley",
			address_type: 15,
			network_tag: 0, // testnet
			spending_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			spending_shared_hash_bech32: "addr_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z70dxhec",
			stake_shared_hash: "c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
			stake_shared_hash_bech32: "stake_shared_vkh1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7p6v69g",
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(pointerInfo);
	});

	it('should inspect Byron mainnet address (type 8)', async function () {
		const addr = 'DdzFFzCqrht8CHL4tkQy82G6iPk8rsNSpFtqHT6HgR727PrD4meHJAa5z8JkHUHAt3uL1kmtgxUNitnUUomqwmdjgHM3wfzmhDsTf4YT';
		const byronInfo = {
			stake_reference: 'none',
			address_style: 'Byron',
			address_type: 8,
			network_tag: null as any,
			address_root: 'd930ed98887868bac2567b8af10ec2d61bf5113bf3a4ed4b109a0762',
			derivation_path: '581c4dd5b9b8042c24a1dbfb484ba577d24651557fb77bf6a8fdeed3be72',
		  };

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(byronInfo);
	});

	it('should inspect Byron testnet address (type 8)', async function () {
		const addr = '37btjrVyb4KEB2STADSsj3MYSAdj52X5FrFWpw2r7Wmj2GDzXjFRsHWuZqrw7zSkwopv8Ci3VWeg6bisU9dgJxW5hb2MZYeduNKbQJrqz3zVBsu9nT';
		const byronInfo = {
			stake_reference: 'none',
			address_style: 'Byron',
			address_type: 8,
			network_tag: 1097911063,
			address_root: '9c708538a763ff27169987a489e35057ef3cd3778c05e96f7ba9450e',
			derivation_path: '581c9c1722f7e446689256e1a30260f3510d558d99d0c391f2ba89cb6977',
		  };

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(byronInfo);
	});

	it('should inspect Icarus mainnet address (type 8)', async function () {
		const addr = 'Ae2tdPwUPEZ6xYrxCgRDM2NQFM5oajHEoJN3i9ZVV2AbsbvxoJBjVu3yP7W';
		const icarusInfo = {
			stake_reference: 'none',
			address_style: 'Icarus',
			address_type: 8,
			network_tag: null as any,
			address_root: '65bd23b9aa1cdf36afa1f5ab2d604d463e335bde5602b563bd62969f',
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(icarusInfo);
	});

	it('should inspect Icarus testnet address (type 8)', async function () {
		const addr = '2cWKMJemoBahmgvHu12VNW64Z65qMJfhyqaUbNNpjntXMzMpRCwPJkZvia4TzhzYFsZhn';
		const icarusInfo = {
			stake_reference: 'none',
			address_style: 'Icarus',
			address_type: 8,
			network_tag: 1097911063,
			address_root: '26829a19eafbaabfa581a8faded52cdaa45fafae1e684c9ff071fb27',
		};

		const info = await cardanoAddresses.inspectAddress(addr);
		expect(info).deep.equal(icarusInfo);
	});

	it('should throw invalid address', async function () {
		const addr = '2cWKMJemoBahmgvHu12VNW64Z65qMJfhyqaUbNNpjpepetXMzMpRCwPJkZvia4TzhzYFsZhn';

		await expect(cardanoAddresses.inspectAddress(addr)).to.eventually.rejected;
	
	});

	it("should sign a tx", function(){
		let txBuild = TransactionBody.from_bytes(Buffer.from(txRawHex, 'hex'));
		let rootKey = Seed.deriveRootKey(phrase); 
		let signingKeys = coinSelection.inputs.map(i => {
			let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
			return privateKey;
		});
		let txBody = Seed.sign(txBuild, signingKeys);
		let signed = Buffer.from(txBody.to_bytes()).toString('hex');
		expect(signedKey).equal(signed);
	});

	it("should sing and verify a message", function(){
		let message = `I'm staking on this pool with address: ${stakeAddress}`;

		const rootKey = Seed.deriveRootKey(phrase);
		const accountKey = Seed.deriveAccountKey(rootKey);

		const stakePrvKey = accountKey
			.derive(CARDANO_CHIMERIC) // chimeric
			.derive(0);

		const privateKey = stakePrvKey.to_raw_key();
		const publicKey = privateKey.to_public();
		
		const signed = Seed.signMessage(privateKey, message);
		const verify_result = Seed.verifyMessage(publicKey, message, signed);
		expect(verify_result).equal(true);
	});

	it("should build multisig script", function(){
		const data: JsonScript = {
			"type": ScriptTypeEnum.All, // "all"
			"scripts":
			[
				{
				"type": ScriptTypeEnum.Sig, // "sig"
				// "keyHash": "e09d36c79dec9bd1b3d9e152247701cd0bb860b5ebfd1de8abb6735a"
				},
				{
				"type":  ScriptTypeEnum.Sig, // "sig"
				// "keyHash": "a687dcc24e00dd3caafbeb5e68f97ca8ef269cb6fe971345eb951756"
				}
			]
		};

		const script = Seed.buildScript(data);
		const json = Seed.scriptToJson(script);
		const keys = Seed.getScriptKeys(script).map(k => k.to_bech32());
		const keyHashes = keys.map(k => Buffer.from(Seed.getKeyHash(Bip32PrivateKey.from_bech32(k).to_public()).to_bytes()).toString('hex'));
		const jsonHashes = json.scripts.map((s:any) => s.keyHash);
		// console.log(keys);
		// console.log(json);
		expect(keyHashes).deep.equal(jsonHashes);
	});

	it("should get script address", function(){
		const script = Seed.buildScript(jsonScript);
		const address = Seed.getScriptAddress(script, 'testnet').to_bech32();
		expect(address).to.be.equal('addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9');
	});

	it('should match script key hash and signing key hash', function() {
		const hash = Buffer.from(Seed.getKeyHash(Bip32PrivateKey.from_bech32(scriptKeys[0]).to_public()).to_bytes()).toString('hex');
		const jsonHash = jsonScript.scripts[0].keyHash;

		expect(hash).to.be.equal(jsonHash);
	})

	it("should build a multisig tx", function(){
		const signingKeys = scriptKeys.map(key => Bip32PrivateKey.from_bech32(key).to_raw_key()); 
		const script = Seed.buildScript(jsonScript);
		let buildOpts = {
            startSlot: 0, 
            config: Testnet,
        };
		const selection: CoinSelectionWallet = {
			"inputs": [
				{
					"amount": {
						"quantity": 16471582,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9",
					"id": "76721f8f89c041dfdc84e9069a3304bffb47fdafaf1d3b0ca5db66c62e6dffcc",
					"assets": [],
					"index": 1
				},
			],
			"outputs": [
				{
					"amount": {
						"quantity": 1000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1qpc6srdq6jjt6eetstw6t4elmypvepa6ykxcps3dvvv4fr5ca6s0m36w9nlk7ntwdhvhxeyz9u4lngn97fcv4ykjqc2sk4hrgy",
					"assets": []
				}
			],
			"change": [
				{
					"amount": {
						"quantity": 15471582, // fee of 1ADA initially
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9",
					"assets": []
				}
			]
		};

		const ttl = 445331390;
		const scripts = [script.root]
		let tx = Seed.buildTransactionMultisig(selection, ttl, scripts, null, [], buildOpts);
		tx.addKeyWitnesses(signingKeys[0]);
		const encode = tx.toBytes();
		const tx1 = MultisigTransaction.fromBytes(encode);
		tx1.addKeyWitnesses(signingKeys[1]);
		const signed = tx1.build();
		console.log(signed);
		expect(signed).not.undefined;
	});

	it("should build a 2/3 multisig tx", function(){
		const keys = [
			'xprv13pg4p80uwhcgugkkepraakpf7lc556w9j6ejcx4rrqc0re88cep96s4df96sz4xhprtuk440uf9fstv4y5jkaxhtmckhhq0fe56s3hzukf4w0t6uqax7fyq0mevhmram49fa6ndz0ld6lyawl5adhv073s99utcc',
			'xprv1czu6a0asmlmcen65cjft0z9yrry36365vtjfatfxkxkp0jhjr9w5smhe69zgshg27te896xw3scfa6c784wq43lmnc3ra577nl05wgnhxkdgnnqlx48f0vln20tptywqupdehnm2m42ec9gdnnlc2zk8yshknqyl',
			'xprv1wztp07qymhkx0t047ngh8uf57mk3yndh67ng5ds0pxysehe594z5fzfza4z3hm24dc50dyqfy6a7500k3dg7cnv9j4fp3k8mymw078dhxm77nk5cv0can8dry4smcyd6gmqeqd68hnhzvmrtdc5qt55005dpchqd'
		  ];
		
		const signingKeys = keys.map(key => Bip32PrivateKey.from_bech32(key).to_raw_key());
		
		// get native script (this is the SAME SCRIPT, we're just "loading" it back)
		const jsonScript: any = {
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
		
		const script = Seed.buildScript(jsonScript);
		
		// set network configuration
		let buildOpts = {
			startSlot: 0, 
			config: Testnet,
		};
		
		const selection: CoinSelectionWallet = {
			"inputs": [
				{
					"amount": {
						"quantity": 10000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xzfyhp0089dlvcvqg2gq3grwd6uu0yfhxpaxa0np4smwjavjfwz77w2m7escqs5spzsxum4ec7gnwvr6d6lxrtpka96ssvtdj5", // script address
					"id": "0e688e4e6f8a1040103362fcd4a26d4034ec4429323776b2928af1cc0b70a65d",
					"assets": [],
					"index": 0
				},
			],
			"change": [
				{
					"amount": {
						"quantity": 9000000, // fee of 0 ADA initially
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xzfyhp0089dlvcvqg2gq3grwd6uu0yfhxpaxa0np4smwjavjfwz77w2m7escqs5spzsxum4ec7gnwvr6d6lxrtpka96ssvtdj5",
					"assets": []
				}
			],
			"outputs": [
				{
					"amount": {
						"quantity": 1000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1qznup567ujylt54wecqtknc2tlp5htaw2ywghh0dcxtxtz6r5gtdwq4yajng57kje93tt3fkc5k8cvvem7vl8yql2mcsn3hwwk",
					"assets": []
				}
			]
		};

		const ttl = 445331390;
		const scripts = [script.root]
		let tx = Seed.buildTransactionMultisig(selection, ttl, scripts, null, [], buildOpts);
		tx.addKeyWitnesses(signingKeys[0]);
		const encode = tx.toBytes();
		const tx1 = MultisigTransaction.fromBytes(encode);
		tx1.addKeyWitnesses(signingKeys[1]);
		const signed = tx1.build();
		console.log(signed);
		expect(signed).not.undefined;
	});

	it('should parse transaction witness set',  function() {
		const cbor = 'a10082825820c7ef7d39e59a5a88cd4187a71f6909f04919a9df05bed33e4688acff28bb8c4c5840111fc129551b4b98c2f22cb12e952f2cbb4c6661b83629fe66c5f72a374f02f4e6e08c1d883e90f4c7c94402fcd24c61ccfe8dfd7be40d1e1cb15e93bb692102825820f0d8999641bdeb957202d69a0a057f9f1d039b5f1d8440510ba6639fe538c3b458400e868c922c6267b5f52d25a46c5862cc1ee17d0a5ca331c3b1f91057ac8ce0a3e9e288404dcab7c644cea5952084e70f07c549b45c34433a66c2004d1115090d';

		const tx = Buffer.from([132,167,0,130,130,88,32,70,8,50,173,127,146,0,13,118,128,150,111,100,205,188,100,215,202,102,43,239,37,115,169,225,55,177,122,105,142,167,0,0,130,88,32,123,28,24,174,128,129,244,135,24,208,175,145,21,29,40,170,52,142,24,29,135,111,105,80,143,164,193,156,183,65,172,3,0,1,132,130,88,57,0,19,169,105,86,185,250,111,76,99,159,146,72,101,225,30,158,178,241,94,118,33,231,37,161,80,104,205,102,193,84,81,65,13,112,226,246,64,128,170,197,239,153,182,227,47,170,108,209,171,56,209,46,96,160,43,246,130,26,0,22,155,8,161,88,28,241,11,57,200,158,161,140,209,243,39,215,228,6,246,135,151,43,253,108,9,243,2,151,34,51,0,10,208,161,80,84,97,110,103,111,99,114,121,112,116,111,67,73,80,51,48,1,130,88,57,0,75,185,121,147,204,205,86,20,183,119,132,180,129,241,159,155,189,242,65,66,254,68,202,247,207,202,237,122,118,242,185,15,255,25,114,158,121,233,228,217,106,108,5,105,26,8,190,18,157,11,131,77,80,202,60,145,26,0,23,43,184,130,88,57,0,113,168,13,160,212,164,189,103,43,130,221,165,215,63,217,2,204,135,186,37,141,128,194,45,99,25,84,142,152,238,160,253,199,78,44,255,111,77,110,109,217,115,100,130,47,43,249,162,101,242,112,202,146,210,6,21,26,0,30,132,128,130,88,57,0,19,169,105,86,185,250,111,76,99,159,146,72,101,225,30,158,178,241,94,118,33,231,37,161,80,104,205,102,193,84,81,65,13,112,226,246,64,128,170,197,239,153,182,227,47,170,108,209,171,56,209,46,96,160,43,246,26,65,65,53,75,2,26,0,3,42,117,3,26,2,209,245,83,7,88,32,2,158,30,250,194,98,181,224,56,6,79,225,254,201,153,69,34,236,159,160,144,237,189,143,139,250,48,176,231,48,68,231,8,0,9,161,88,28,241,11,57,200,158,161,140,209,243,39,215,228,6,246,135,151,43,253,108,9,243,2,151,34,51,0,10,208,161,88,32,53,52,54,49,54,101,54,55,54,102,54,51,55,50,55,57,55,48,55,52,54,102,52,51,52,57,53,48,51,51,51,48,1,162,0,131,130,88,32,199,239,125,57,229,154,90,136,205,65,135,167,31,105,9,240,73,25,169,223,5,190,211,62,70,136,172,255,40,187,140,76,88,64,17,31,193,41,85,27,75,152,194,242,44,177,46,149,47,44,187,76,102,97,184,54,41,254,102,197,247,42,55,79,2,244,230,224,140,29,136,62,144,244,199,201,68,2,252,210,76,97,204,254,141,253,123,228,13,30,28,177,94,147,187,105,33,2,130,88,32,240,216,153,150,65,189,235,149,114,2,214,154,10,5,127,159,29,3,155,95,29,132,64,81,11,166,99,159,229,56,195,180,88,64,14,134,140,146,44,98,103,181,245,45,37,164,108,88,98,204,30,225,125,10,92,163,49,195,177,249,16,87,172,140,224,163,233,226,136,64,77,202,183,198,68,206,165,149,32,132,231,15,7,197,73,180,92,52,67,58,102,194,0,77,17,21,9,13,130,88,32,29,133,18,243,208,20,91,138,4,65,73,194,58,27,198,142,82,201,197,93,24,141,101,18,72,41,97,212,179,130,144,155,88,64,168,94,163,55,14,175,150,132,183,225,103,6,146,194,7,45,192,173,12,191,126,114,106,118,172,189,114,221,141,50,11,246,105,230,208,75,67,135,22,44,158,121,227,201,71,92,104,150,237,245,221,144,253,125,212,198,51,133,59,122,206,168,79,10,1,129,130,1,130,130,0,88,28,11,203,172,203,241,167,56,6,206,251,239,192,13,115,220,20,185,43,49,225,27,87,147,141,229,247,49,34,130,5,26,12,23,67,99,245,161,25,2,209,162,120,56,102,49,48,98,51,57,99,56,57,101,97,49,56,99,100,49,102,51,50,55,100,55,101,52,48,54,102,54,56,55,57,55,50,98,102,100,54,99,48,57,102,51,48,50,57,55,50,50,51,51,48,48,48,97,100,48,161,112,84,97,110,103,111,99,114,121,112,116,111,67,73,80,51,48,175,101,105,109,97,103,101,120,53,105,112,102,115,58,47,47,81,109,89,57,103,121,100,83,99,88,119,81,65,52,119,122,104,70,111,49,118,113,86,112,68,107,103,105,55,115,80,52,103,72,53,84,70,109,122,56,71,89,80,70,57,56,105,99,111,112,121,114,105,103,104,116,112,84,97,110,103,111,99,114,121,112,116,111,32,50,48,50,49,101,99,111,108,111,114,100,66,108,117,101,102,97,114,116,105,115,116,107,84,97,110,103,111,99,114,121,112,116,111,107,100,101,115,99,114,105,112,116,105,111,110,120,34,68,101,115,99,114,105,112,116,105,111,110,32,102,111,114,32,84,97,110,103,111,99,114,121,112,116,111,32,67,73,80,32,51,48,105,109,101,100,105,97,84,121,112,101,99,112,110,103,106,99,111,108,108,101,99,116,105,111,110,118,84,97,110,103,111,99,114,121,112,116,111,32,67,111,108,108,101,99,116,105,111,110,100,98,111,100,121,103,82,111,117,110,100,101,100,100,101,121,101,115,102,60,101,121,101,115,62,100,102,97,99,101,102,60,102,97,99,101,62,103,116,119,105,116,116,101,114,120,32,104,116,116,112,115,58,47,47,116,119,105,116,116,101,114,46,99,111,109,47,116,97,110,103,111,95,99,114,121,112,116,111,100,110,97,109,101,112,84,97,110,103,111,99,114,121,112,116,111,67,73,80,51,48,105,97,99,99,101,115,115,111,114,121,100,78,111,110,101,100,112,101,112,101,102,103,114,105,108,108,111,102,114,97,114,105,116,121,97,49,103,118,101,114,115,105,111,110,99,49,46,48]).toString('hex');
		const asset = Buffer.from([53,52,54,49,54,101,54,55,54,102,54,51,55,50,55,57,55,48,55,52,54,102,52,51,52,57,53,48,51,51,51,48]).toString()
		const witnessSet = TransactionWitnessSet.from_bytes(Buffer.from(cbor, 'hex'));
		console.log(witnessSet.vkeys().len());
		for (let i = 0; i < witnessSet.vkeys().len(); i++) {
			const witness = witnessSet.vkeys().get(i);
			console.log(witness.vkey().public_key().to_bech32());
			
		}
		// console.log(witnessSet.native_scripts().len());
		expect(witnessSet).not.undefined;
	})
});