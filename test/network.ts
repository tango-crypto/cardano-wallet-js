import { expect } from 'chai';
import 'mocha';
import { ApiNetworkClockStatusEnum, ApiNetworkParametersActiveSlotCoefficientUnitEnum, ApiNetworkParametersEpochLengthUnitEnum, ApiNetworkParametersSlotLengthUnitEnum, WalletsTipHeightUnitEnum, WalletswalletIdpaymentfeesAmountUnitEnum } from '../models';
import { ApiNetworkInformationNodeEraEnum } from '../models/api-network-information';

import { WalletServer } from '../wallet-server';

import * as dotenv from "dotenv";
dotenv.config();


describe('Cardano wallet network', function() {
	let walletServer: WalletServer;
	let syncProgress = ['syncing', 'ready'];
	let nodeEras = [ApiNetworkInformationNodeEraEnum.Allegra, ApiNetworkInformationNodeEraEnum.Byron, ApiNetworkInformationNodeEraEnum.Mary, ApiNetworkInformationNodeEraEnum.Shelley, ApiNetworkInformationNodeEraEnum.Alonzo];
	let clockStatus = [ApiNetworkClockStatusEnum.Available, ApiNetworkClockStatusEnum.Unavailable, ApiNetworkClockStatusEnum.Pending];

	let serverSettings = {
    "pool_metadata_source": "direct"
	};

	before('Initializing test cluster', async function(){
		walletServer = WalletServer.init(`http://${process.env.TEST_WALLET_HOST}:${process.env.TEST_WALLET_PORT}/v2`);
	});

	it("should get network information", async function() {
		let information = await walletServer.getNetworkInformation();
		
		expect(information).have.property('network_tip').with.property('time').be.a('string');
		expect(information).have.property('network_tip').with.property('epoch_number').be.a('number');
		expect(information).have.property('network_tip').with.property('absolute_slot_number').be.a('number');
		expect(information).have.property('network_tip').with.property('slot_number').be.a('number');

		expect(information).have.property('node_tip').with.property('time').be.a('string');
		expect(information).have.property('node_tip').with.property('epoch_number').be.a('number');
		expect(information).have.property('node_tip').with.property('absolute_slot_number').be.a('number');
		expect(information).have.property('node_tip').with.property('slot_number').be.a('number');
		expect(information).have.property('node_tip').with.property('height').with.property('quantity').be.a('number');
		expect(information).have.property('node_tip').with.property('height').with.property('unit').equal('block');

		expect(information).have.property('next_epoch').with.property('epoch_start_time').be.a('string');
		expect(information).have.property('next_epoch').with.property('epoch_number').be.a('number');

		expect(syncProgress).include(information.sync_progress.status);
		if (information.sync_progress.status === syncProgress[0]) {
			expect(information.sync_progress).have.property('progress').with.property('quantity').be.a('number');
			expect(information.sync_progress).have.property('progress').with.property('unit').equal('percent');
		}
		expect(nodeEras).include(information.node_era);
	});

	it('should get network clock', async function() {
		let clock = await walletServer.getNetworkClock();

		expect(clockStatus).include(clock.status);
		expect(clock).have.property('offset').with.property('quantity').be.a('number');
		expect(clock).have.property('offset').with.property('unit').equal('microsecond');
	});

	
	it('should get network parameters', async function() {
			let slotLengthUnits = [ApiNetworkParametersSlotLengthUnitEnum.Second];
			let coefficientUnits = [ApiNetworkParametersActiveSlotCoefficientUnitEnum.Percent];
			let epochLengthUnits = [ApiNetworkParametersEpochLengthUnitEnum.Slot];
			let heightUnits = [WalletsTipHeightUnitEnum.Block];
			let amountUnits = [WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace];
			let parameters = await walletServer.getNetworkParameters();

			expect(parameters).have.property('slot_length').with.property('quantity').be.a('number');
			expect(slotLengthUnits).include(parameters.slot_length.unit);

			expect(parameters).have.property('decentralization_level').with.property('quantity').be.a('number');
			expect(coefficientUnits).include(parameters.decentralization_level.unit);

			expect(parameters).have.property('genesis_block_hash').lengthOf(64);
			expect(parameters).have.property('blockchain_start_time').be.a('string');
			expect(parameters).have.property('desired_pool_number').be.a('number');

			expect(parameters).have.property('epoch_length').with.property('quantity').be.a('number');
			expect(epochLengthUnits).include(parameters.epoch_length.unit);

			let shelley = parameters.eras.shelley;
			let mary = parameters.eras.mary;
			let byron = parameters.eras.byron;
			let allegra = parameters.eras.allegra;
			expect(mary).have.property('epoch_start_time').be.a('string');
			expect(mary).have.property('epoch_number').be.a('number');
			expect(shelley).have.property('epoch_start_time').be.a('string');
			expect(shelley).have.property('epoch_number').be.a('number');
			expect(byron).have.property('epoch_start_time').be.a('string');
			expect(byron).have.property('epoch_number').be.a('number');
			expect(allegra).have.property('epoch_start_time').be.a('string');
			expect(allegra).have.property('epoch_number').be.a('number');

			expect(parameters).have.property('active_slot_coefficient').with.property('quantity').be.a('number');
			expect(coefficientUnits).include(parameters.active_slot_coefficient.unit);

			expect(parameters).have.property('security_parameter').with.property('quantity').be.a('number');
			expect(heightUnits).include(parameters.security_parameter.unit);

			expect(parameters).have.property('minimum_utxo_value').with.property('quantity').be.a('number');
			expect(amountUnits).include(parameters.minimum_utxo_value.unit);
	});

	it("should update metadata source", async function(){
		let poolMetadataSource = "direct";
		await walletServer.updateMetadataSource(poolMetadataSource);
	});

	it("should get metadata source", async function(){
		let metadataSource = await walletServer.getMetadataSource();
		expect(serverSettings.pool_metadata_source).equal(metadataSource);
	});

});