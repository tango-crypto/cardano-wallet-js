import { expect } from 'chai';
import 'mocha';
import { WalletswalletIdpaymentfeesAmountUnitEnum } from '../models';
import { Seed } from '../utils';
import { CoinSelectionWallet } from '../wallet/coin-selection-wallet';
import { Bip32PrivateKey, NetworkInfo, RewardAddress, StakeCredential, TransactionBody } from '@emurgo/cardano-serialization-lib-nodejs';
import { mnemonicToEntropy } from 'bip39';

describe('Wallet utilities', function(){
	let phrase = ["joy","private","elder","ocean","mobile","orient","arrest","assume","monkey","once","thought","like","warfare","spread","stable"];
	let root = "xprv15p57eahg2mx0araax2tlc5gulvs20sta28m5f7mj4qs38c7ltpthdxgd4kssvun4frvdraln6ggcu0xmmn3f24z8nf0fvq9sel68qsvxxjny4yawzlwte6ac27yy3ve3vdkykgt082vvjjvqfa2w7kutryxrlgd2"; 
	let prvKey = "ed25519e_sk1rzkp85k5m6afj7es8n3n2nzxd8hrljs7rpat9zv8d9r54a7ltpt398m7vxqr2dkvjdy8y99uxy5f58je735pjv9nf4mhngmll3vcezcrackx0";
	let stakeAddress = "stake1uxqchn4lrh63epprnqzm3ges668ahs7qglqjhdxrzuktjwg9mra90";

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

	let txRawHex = 'a400828258206b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e377008258202316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927000182825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e84808258390010a1a61833e7bcc819437cce3362c6434e9a44b73c238f76917fecf0818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a0020e6a2021a0002ab9d0300';
	let signedKey = "83a400828258206b4b99362d807c31a251a575809ac535f4d6440b560d82bc120d07ae10b6e377008258202316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927000182825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e84808258390010a1a61833e7bcc819437cce3362c6434e9a44b73c238f76917fecf0818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a0020e6a2021a0002ab9d0300a10082825820d12ee631220ea5a99639918a21ed9f69e6f611c47a3ecfaf3c41f9d63ce763ae584061333e2191802b5b197eaed26f1fdc80da1bed7389ff331e728eb792360f111634083ecd1d1063735891eb1acf84ff39a7f32283c4cf6a9fe4bdab59976e1e0382582079992cb28ed8b96d8aa4501d46006d95b0f7679b618499336dd9fa7ddb8db05d58402d1a0b91dd8f6894e022ff31f3390739c46a24734294f06dc6d93412b0e3d7630fc95106181e5e8e58bea85059e191539ac69dbe3c16b9bdf28650352940a006f6";

	it('should generate a recovery phrase string', function(){
		let recoveryPhrase = Seed.generateRecoveryPhrase();
		expect(recoveryPhrase).be.a('string');
	});

	it('should generate a recovery phrase string', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
		expect(words).lengthOf(15);
	});

	it('should return root key from recovery phrase', function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let bech32 = rootKey.to_bech32();
		expect(root).equal(bech32);
	});

	it("should return derive private/signing key from root", function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let privateKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','0','0'])
		.to_bech32();
		expect(prvKey).equal(privateKey);
	});

	it("should return derive stake address from root", function(){
		let rootKey = Seed.deriveRootKey(phrase);
		let stakePrvKey = Seed.deriveKey(rootKey, ['1852H','1815H','0H','2','0']);
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
			let privateKey = Seed.deriveKey(rootKey, i.derivation_path);
			return privateKey;
		});
		let txBody = Seed.sign(txBuild, signingKeys);
		let signed = Buffer.from(txBody.to_bytes()).toString('hex');
		expect(signedKey).deep.equal(signed);
	});

	it("should sing and verify a message", function(){
		let message = Buffer.from(`I'm staking on this pool with address: ${stakeAddress}`);
		const entropy = mnemonicToEntropy(phrase.join(' '));

		const rootKey = Bip32PrivateKey.from_bip39_entropy(
			Buffer.from(entropy, 'hex'),
  		Buffer.from(''),
		);

		const accountKey = rootKey
			.derive(harden(1852)) // purpose
			.derive(harden(1815)) // coin type
			.derive(harden(0)); // account #0

		const stakePrvKey = accountKey
			.derive(2) // chimeric
			.derive(0);

		const privateKey = stakePrvKey.to_raw_key();
		const publicKey = privateKey.to_public();

		const signed = privateKey.sign(message);
		const verify_result = publicKey.verify(message, signed);
		expect(verify_result).equal(true);
	});

	function harden(num: number) {
		return 0x80000000 + num; 
	}
	
});