import { expect } from 'chai';
import 'mocha';
import { ApiNetworkClockStatusEnum } from '../models';
import { ApiNetworkInformationNodeEraEnum } from '../models/api-network-information';

import { WalletServer } from '../wallet-server';

describe('Cardano wallet network', function() {
	let walletServer = WalletServer.init('http://localhost:8090/v2');
	it("should get network information", async function() {
		let sync_progress = ['syncing', 'ready'];
		let eras = [ApiNetworkInformationNodeEraEnum.Allegra, ApiNetworkInformationNodeEraEnum.Byron, ApiNetworkInformationNodeEraEnum.Mary, ApiNetworkInformationNodeEraEnum.Shelley];
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

		expect(sync_progress).include(information.sync_progress.status);
		if (information.sync_progress.status === sync_progress[0]) {
			expect(information.sync_progress).have.property('progress').with.property('quantity').be.a('number');
			expect(information.sync_progress).have.property('progress').with.property('unit').equal('percent');
		}
		expect(eras).include(information.node_era);
	});

	it('should get network clock', async function() {
		let status = [ApiNetworkClockStatusEnum.Available, ApiNetworkClockStatusEnum.Unavailable, ApiNetworkClockStatusEnum.Pending];
		let clock = await walletServer.getNetworkClock();

		expect(status).include(clock.status);
		expect(clock).have.property('offset').with.property('quantity').be.a('number');
		expect(clock).have.property('offset').with.property('unit').equal('microsecond');
	});

});