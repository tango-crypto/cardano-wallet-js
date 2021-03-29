   // "axios": "^0.19.2",
import { expect } from 'chai';
import 'mocha';
import { ApiAddressStateEnum } from '../models';

import { WalletServer } from '../wallet-server';
import { KeyRoleEnum } from '../wallet/key-wallet';

describe('Cardano wallet API', function() {
	describe('wallet', function() {
		let walletServer = WalletServer.init('http://localhost:8090/v2');
		it("should create/resotre a wallet", async function() {
			let name = "empty-balance";
			let passphrase = '1234567890';
			let recoverPhrase = ["joy","private","elder","ocean","mobile","orient","arrest","assume","monkey","once","thought","like","warfare","spread","stable",];
			
			let wallet = await walletServer.createOrGetShelleyWallet(name, recoverPhrase, passphrase);
			expect(wallet).be.a("object");
			expect(wallet).have.property('id').lengthOf(40);
			expect(wallet).have.property('passphrase').with.property('last_updated_at').be.a('string');
			expect(wallet).have.property('name').equal(name);
		});

		it("should get a wallet", async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			
			let wallet = await walletServer.getShelleyWallet(id);
			expect(wallet).be.a("object");
			expect(wallet).have.property('id').equal(id);
			expect(wallet).have.property('name').be.a('string');
			expect(wallet).have.property('passphrase').with.property('last_updated_at').be.a('string');
		});

		it('should get wallet addresses', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let addresses = await wallet.getAddresses();

			expect(addresses).be.an('array');
		});

		it('should get wallet unused addresses', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let addresses = await wallet.getUnusedAddresses();

			expect(addresses).be.an('array');
			expect(addresses).lengthOf.at.least(wallet.address_pool_gap);
		});

		it('should get wallet used addresses', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let addresses = await wallet.getUsedAddresses();

			expect(addresses).be.an('array');
		});

		it('should get first wallet\'s address external verification key', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			let addr = 'addr_vk1w0whx0x9p4v5ewya8tr89pas9khqpxp0eqqwnjwf6xajs26kzgjsrs7nv7';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let address = await wallet.getAddressExternalVerificationKey(0);

			expect(address).have.property('key').equal(addr);
			expect(address).have.property('role').equal(KeyRoleEnum.AddressExternal);
		});

		it('should get first wallet\'s stake verification key', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			let addr = 'stake_vk10xsk0q93qpul3nv0jylrve4xfj6kc9gksf75k9jgwd0namzufxqswg47kr';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let stake = await wallet.getStakeVerificationKey(0);

			expect(stake).have.property('key').equal(addr);
			expect(stake).have.property('role').equal(KeyRoleEnum.Stake);
		});

		it('should get wallet next unused address', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			
			let wallet = await walletServer.getShelleyWallet(id);
			let addresses = (await wallet.getAddresses()).map(addr => addr.address);
			let address = await wallet.getNextAddress();

			expect(address).have.property('id').be.a('string');
			expect(address).have.property('state').equal(ApiAddressStateEnum.Unused);
			expect(address.used()).equal(false);
			expect(addresses).not.include(address.address);
		});

	
	});
});