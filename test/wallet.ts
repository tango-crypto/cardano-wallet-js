   // "axios": "^0.19.2",
import { expect } from 'chai';
import 'mocha';
import { ApiAddressStateEnum, ApiTransactionDirectionEnum, ApiTransactionStatusEnum, WalletsTipHeightUnitEnum, WalletswalletIdpaymentfeesAmountUnitEnum, WalletswalletIdtransactionsAmountUnitEnum, WalletswalletIdtransactionsDepthUnitEnum } from '../models';

import { WalletServer } from '../wallet-server';
import { KeyRoleEnum } from '../wallet/key-wallet';

describe('Cardano wallet API', function() {
	let walletServer = WalletServer.init('http://localhost:8090/v2');
	describe('wallet', function() {
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

	describe('transaction', function(){
		it('should get tx details', async function() {
			let id = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			//let tx = '2d7928a59fcba5bf71c40fe6428a301ffda4d2fa681e5357051970436462b894';
			let tx = '2316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927';
			let heightUnits = [WalletsTipHeightUnitEnum.Block];
			let txStatus = [ApiTransactionStatusEnum.Expired, ApiTransactionStatusEnum.InLedger, ApiTransactionStatusEnum.Pending];
			let amountUnits = [WalletswalletIdtransactionsAmountUnitEnum.Lovelace];
			let txDirections = [ApiTransactionDirectionEnum.Incoming, ApiTransactionDirectionEnum.Outgoing];
			let depthUnits = [WalletswalletIdtransactionsDepthUnitEnum.Block];
			
			let wallet = await walletServer.getShelleyWallet(id);
			let transaction = await wallet.getTransaction(tx);

			expect(transaction).have.property('id').equal(tx);

			expect(transaction.inserted_at).have.property('height').with.property('quantity').be.a('number');
			expect(transaction.inserted_at).have.property('time').be.a('string');
			expect(transaction.inserted_at).have.property('epoch_number').be.a('number');
			expect(transaction.inserted_at).have.property('absolute_slot_number').be.a('number');
			expect(transaction.inserted_at).have.property('slot_number').be.a('number');
			expect(heightUnits).include(transaction.inserted_at.height.unit);

			expect(txStatus).include(transaction.status);

			expect(transaction).have.property('withdrawals').be.a('array');
			expect(transaction).have.property('amount').with.property('quantity').be.a('number');
			expect(amountUnits).include(transaction.amount.unit);

			expect(transaction).have.property('inputs').be.a('array');

			expect(txDirections).include(transaction.direction);

			expect(transaction).have.property('fee').with.property('quantity').be.a('number');
			expect(amountUnits).include(transaction.fee.unit);

			expect(transaction).have.property('outputs').be.a('array');
			
			expect(transaction).have.property('depth').with.property('quantity').be.a('number');
			expect(depthUnits).include(transaction.depth.unit);

			expect(transaction).have.property('deposit').with.property('quantity').be.a('number');
			expect(amountUnits).include(transaction.deposit.unit);

			expect(transaction).have.property('mint').be.a('array');
		});

		it('should get payment fee', async function(){
			let receiver = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
			let payeer = '4157603597d008fd8fe88b84f72696809e9a6a06';
			let amountUnits = [WalletswalletIdtransactionsAmountUnitEnum.Lovelace];


			let rWallet = await walletServer.getShelleyWallet(receiver);
			let addresses = (await rWallet.getUnusedAddresses()).slice(0,1);
			let amounts = [1200000];

			let wallet = await walletServer.getShelleyWallet(payeer);
			let estimatedFees = await wallet.estimateFee(addresses, amounts);
			
			expect(estimatedFees).have.property('deposit').with.property('quantity').be.a('number');
			expect(amountUnits).include(estimatedFees.deposit.unit);

			expect(estimatedFees).have.property('estimated_max').with.property('quantity').be.a('number');
			expect(amountUnits).include(estimatedFees.estimated_max.unit);

			expect(estimatedFees).have.property('estimated_min').with.property('quantity').be.a('number');
			expect(amountUnits).include(estimatedFees.estimated_min.unit);

			expect(estimatedFees).have.property('minimum_coins').be.a('array');
		});

		// it('should send a payment transfer', async function(){
		// 	// let txId = '2316b6510634f4f1bb24c6fa3eef03f49fa0e780ace23266e3013fc019fec927';
		// 	let receiver = '16f129e025b97f907a760a4cf7b0740d7b4e7993';
		// 	let payeer = '4157603597d008fd8fe88b84f72696809e9a6a06';
		// 	let passphrase = '1234567890';
		// 	let amountUnits = [WalletswalletIdtransactionsAmountUnitEnum.Lovelace];
		// 	let txDirections = [ApiTransactionDirectionEnum.Incoming, ApiTransactionDirectionEnum.Outgoing];
		// 	let txStatus = [ApiTransactionStatusEnum.Expired, ApiTransactionStatusEnum.InLedger, ApiTransactionStatusEnum.Pending];


		// 	let rWallet = await walletServer.getShelleyWallet(receiver);
		// 	let addresses = (await rWallet.getUnusedAddresses()).slice(0,1);
		// 	let amounts = [1500000];

		// 	let wallet = await walletServer.getShelleyWallet(payeer);
		// 	let transaction = await wallet.sendPayment(passphrase, addresses, amounts);
			
		// 	// transaction.amount.quantity;
		// 	// transaction.amount.unit;
		// 	expect(transaction).have.property('amount').with.property('quantity').be.a('number');
		// 	expect(amountUnits).include(transaction.amount.unit);

		// 	expect(transaction).have.property('fee').with.property('quantity').be.a('number');
		// 	expect(amountUnits).include(transaction.fee.unit);

		// 	expect(transaction).have.property('deposit').with.property('quantity').be.a('number');
		// 	expect(amountUnits).include(transaction.deposit.unit);

		// 	expect(txDirections).include(transaction.direction);

		// 	expect(transaction).have.property('inputs').be.a('array');
		// 	transaction.inputs.forEach(input => {
		// 		expect(input).have.property('id').lengthOf(64);
		// 		expect(input).have.property('index').least(0);
		// 	});

		// 	expect(transaction).have.property('outputs').be.a('array');
		// 	transaction.outputs.forEach(output => {
		// 		expect(output).have.property('address').be.a('string');
		// 		expect(output.amount).have.property('quantity').least(0);
		// 		expect(amountUnits).include(output.amount.unit);
		// 	});

		// 	expect(transaction).have.property('withdrawals').be.a('array');
		// 	transaction.withdrawals.forEach(withdrawal => {
		// 		expect(withdrawal).have.property('stake_address').be.a('string');
		// 		expect(withdrawal.amount).have.property('quantity').least(0);
		// 		expect(amountUnits).include(withdrawal.amount.unit);
		// 	});

		// 	expect(transaction).have.property('mint').be.a('array');
		// 	transaction.mint.forEach(mint => {
		// 		expect(mint).have.property('policy_id').lengthOf(56);
		// 		expect(mint).have.property('asset_name').lengthOf(64);
		// 		expect(mint).have.property('quantity').be.a('number');
		// 	});

		// 	expect(txStatus).include(transaction.status);
		// });
	})
});