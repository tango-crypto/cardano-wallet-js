import { expect } from 'chai';
import 'mocha';
import { WalletswalletIdpaymentfeesAmountUnitEnum, JsonScript, ScriptTypeEnum } from '../models';
import { CARDANO_CHIMERIC, CARDANO_EXTERNAL, Seed } from '../utils';
import { CoinSelectionWallet } from '../wallet/coin-selection-wallet';
import { NetworkInfo, RewardAddress, StakeCredential, TransactionBody, Bip32PrivateKey, BaseAddress } from '@emurgo/cardano-serialization-lib-nodejs';
import { Testnet } from '../config/network.config';

// let transaction = Transaction.from_bytes(Buffer.from('83a600818258205b895e886b1539ffa7256e5e4dc4fd1f753389718d6a01216b64e8707fa72a02010182825839004781ac588faf62aadda0a584e41bf9776e35f83af080800d8e9505e01e64ae6f8bbd15ae8657c2ed4b5e8ef1f82e2297d7ead4c66782fb131a000f42408258390060576add07f66d5198ecc8a632b0a1c6185fc46a5e8054c897765473342dac9f95ee4f92567f652a736d64bfa0afaa2da795dda8de6585801a3a70c0fc021a0002a5f1031a59527200075820776e39ea313361b6bdc495ceeb6296ab36e5a684c57883541680ca5dc4bef03f0800a10081825820c85b2675611fbaab02089a70465d99ef1c15488d34d64ecfe2f580d846b12d21584004bbefcf1879a1c16ed194fcc609afca05b5d45fd301a75be56707a1c996fbca7e94ac7410c979fd5ddf3f1244085a35261ad6b95dbf4b10898c261133d4920ea5006568656c6c6f01542512a00e9653fe49a44a5886202e24d77eeb998f04830102a16130647472756505a2636b6579646e756c6c616c83036474727565a00669756e646566696e6564', 'hex'));
// let txBody = transaction.body();
// let txHash = hash_transaction(txBody);
// console.log(Buffer.from(txHash.to_bytes()).toString('hex'));
// console.log('Hell yeah!');

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

	it("should build a raw transaction", function(){
		let txBuild = Seed.buildTransaction(coinSelection, 0);
		let txHex = Buffer.from(txBuild.to_bytes()).toString('hex');
		expect(txRawHex).equal(txHex);
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
			"withdrawals": [] as any[],
			"inputs": [
				{
					"amount": {
						"quantity": 20000000,
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9",
					"id": "4b6a8bf960090225c85fbfe13a182cdc4cecdc3416fa02c3e2938d4449ef96f6",
					"assets": [],
					"index": 0
				},
			],
			"deposits": [],
			"change": [
				{
					"amount": {
						"quantity": 18823000, // fee of 180000 initially
						"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
					},
					"address": "addr_test1xqmmnp8sujweq6vc7jkryz9ev96s424e6qhs37mgawkjsaphhxz0peyajp5e3a9vxgytjct4p24tn5p0prak36ad9p6qncrly9",
					"assets": []
				}
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
			]
		};

		const ttl = 445331390;
		const scripts = [script.root]
		let tx = Seed.buildTransactionMultisig(selection, ttl, [], null, [], buildOpts);
		tx.addKeyWitnesses(signingKeys[0]);
		tx.addScriptWitness(...scripts);
		tx.addKeyWitnesses(signingKeys[1]);
		const signed = tx.build();
		expect(signed).not.undefined;
	})
});