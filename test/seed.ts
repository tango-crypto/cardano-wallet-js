import { expect } from 'chai';
import 'mocha';
import { Seed } from '../utils';

describe('Wallet utilities', function(){
	it('should generate a recovery phrase string', function(){
		let recoverPhrase = Seed.generateRecoveryPhrase();
		expect(recoverPhrase).be.a('string');
	});

	it('should generate a recovery phrase string', function(){
		let words = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
		expect(words).lengthOf(15);
	});
	
});