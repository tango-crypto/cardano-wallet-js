import { expect } from 'chai';
import 'mocha';
import { Seed } from '../utils';

describe('Wallet utilities', function(){
	let phrase = ["joy","private","elder","ocean","mobile","orient","arrest","assume","monkey","once","thought","like","warfare","spread","stable"];
	let root = "root_xsk15p57eahg2mx0araax2tlc5gulvs20sta28m5f7mj4qs38c7ltpthdxgd4kssvun4frvdraln6ggcu0xmmn3f24z8nf0fvq9sel68qsvxxjny4yawzlwte6ac27yy3ve3vdkykgt082vvjjvqfa2w7kutrydwktu5"; 
	let privateK = "addr_xsk1rzkp85k5m6afj7es8n3n2nzxd8hrljs7rpat9zv8d9r54a7ltpt398m7vxqr2dkvjdy8y99uxy5f58je735pjv9nf4mhngmll3vcezle96kke9e3gupjra0cga730ds64qzr4kq5jltxz9awrt0shcg87yp3mpgc";
	let signingKey = {
    "type": "PaymentExtendedSigningKeyShelley_ed25519_bip32",
    "description": "",
    "cborHex": "588018ac13d2d4deba997b303ce3354c4669ee3fca1e187ab2898769474af7df5857129f7e61803536cc93487214bc31289a1e59f4681930b34d7779a37ffc598c8b73dd733cc50d594cb89d3ac67287b02dae00982fc800e9c9c9d1bb282b561225f92ead6c9731470321f5f8477d17b61aa8043ad81497d66117ae1adf0be107f1"
	};

	it('should generate a recovery phrase string', function(){
		let recoverPhrase = Seed.generateRecoveryPhrase();
		expect(recoverPhrase).be.a('string');
	});

	it('should generate a recovery phrase string', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
		expect(words).lengthOf(15);
	});

	it('should return root key from recovery phrase', function(){
		let rootKey = Seed.rootKeyFromRecoveryPhrase(phrase);
		expect(root).equal(rootKey);
	});

	it("should return derive private key from root", function(){
		let privateKey = Seed.derivePrivateKey(root, '1852H/1815H/0H/0/0');
		expect(privateK).equal(privateKey);
	});

	it("should convert private key (cardano-address format) to signing key (cardano-cli format)", function(){
		let signing = Seed.convertPrivateKeyToSigningKey(privateK);
		expect(signingKey).deep.equal(signing);
	});
	
});