export const Config = {
		Mainnet: {
			"activeSlotsCoeff": 0.05,
			"protocolParams": {
				"protocolVersion": {
					"minor": 0,
					"major": 2
				},
				"decentralisationParam": 1,
				"eMax": 18,
				"extraEntropy": {
					"tag": "NeutralNonce"
				},
				"maxTxSize": 16384,
				"maxBlockBodySize": 65536,
				"maxBlockHeaderSize": 1100,
				"minFeeA": 44,
				"minFeeB": 155381,
				"minUTxOValue": 1000000,
				"poolDeposit": 500000000,
				"minPoolCost": 340000000,
				"keyDeposit": 2000000,
				"nOpt": 150,
				"rho": 0.003,
				"tau": 0.20,
				"a0": 0.3
			},
			"genDelegs": {
				"ad5463153dc3d24b9ff133e46136028bdc1edbb897f5a7cf1b37950c": {
					"delegate": "d9e5c76ad5ee778960804094a389f0b546b5c2b140a62f8ec43ea54d",
					"vrf": "64fa87e8b29a5b7bfbd6795677e3e878c505bc4a3649485d366b50abadec92d7"
				},
				"b9547b8a57656539a8d9bc42c008e38d9c8bd9c8adbb1e73ad529497": {
					"delegate": "855d6fc1e54274e331e34478eeac8d060b0b90c1f9e8a2b01167c048",
					"vrf": "66d5167a1f426bd1adcc8bbf4b88c280d38c148d135cb41e3f5a39f948ad7fcc"
				},
				"60baee25cbc90047e83fd01e1e57dc0b06d3d0cb150d0ab40bbfead1": {
					"delegate": "7f72a1826ae3b279782ab2bc582d0d2958de65bd86b2c4f82d8ba956",
					"vrf": "c0546d9aa5740afd569d3c2d9c412595cd60822bb6d9a4e8ce6c43d12bd0f674"
				},
				"f7b341c14cd58fca4195a9b278cce1ef402dc0e06deb77e543cd1757": {
					"delegate": "69ae12f9e45c0c9122356c8e624b1fbbed6c22a2e3b4358cf0cb5011",
					"vrf": "6394a632af51a32768a6f12dac3485d9c0712d0b54e3f389f355385762a478f2"
				},
				"162f94554ac8c225383a2248c245659eda870eaa82d0ef25fc7dcd82": {
					"delegate": "4485708022839a7b9b8b639a939c85ec0ed6999b5b6dc651b03c43f6",
					"vrf": "aba81e764b71006c515986bf7b37a72fbb5554f78e6775f08e384dbd572a4b32"
				},
				"2075a095b3c844a29c24317a94a643ab8e22d54a3a3a72a420260af6": {
					"delegate": "6535db26347283990a252313a7903a45e3526ec25ddba381c071b25b",
					"vrf": "fcaca997b8105bd860876348fc2c6e68b13607f9bbd23515cd2193b555d267af"
				},
				"268cfc0b89e910ead22e0ade91493d8212f53f3e2164b2e4bef0819b": {
					"delegate": "1d4f2e1fda43070d71bb22a5522f86943c7c18aeb4fa47a362c27e23",
					"vrf": "63ef48bc5355f3e7973100c371d6a095251c80ceb40559f4750aa7014a6fb6db"
				}
			},
			"updateQuorum": 5,
			"networkId": "Mainnet",
			"initialFunds": {},
			"maxLovelaceSupply": 45000000000000000,
			"networkMagic": 764824073,
			"epochLength": 432000,
			"systemStart": "2017-09-23T21:44:51Z",
			"slotsPerKESPeriod": 129600,
			"slotLength": 1,
			"maxKESEvolutions": 62,
			"securityParam": 2160
		},
		Testnet: {
			"activeSlotsCoeff": 0.05,
			"protocolParams": {
				"protocolVersion": {
					"minor": 0,
					"major": 2
				},
				"decentralisationParam": 1,
				"eMax": 18,
				"extraEntropy": {
					"tag": "NeutralNonce"
				},
				"maxTxSize": 16384,
				"maxBlockBodySize": 65536,
				"maxBlockHeaderSize": 1100,
				"minFeeA": 44,
				"minFeeB": 155381,
				"minUTxOValue": 1000000,
				"poolDeposit": 500000000,
				"minPoolCost": 340000000,
				"keyDeposit": 2000000,
				"nOpt": 150,
				"rho": 0.003,
				"tau": 0.20,
				"a0": 0.3
			},
			"genDelegs": {
				"2f56e87d67b8e5216582cfeb95dbdc9083110a3ef68faaa51bef3a80": {
					"delegate": "bd5933d3c5417f17a64c7214711a26abc3bc03e2c90dc1bb38e0c39f",
					"vrf": "9a0b0f537874d089cedfa9e250150405e47ea29acee87c40a223ae0a175d26f8"
				},
				"514e81afb082fce01678809eebd90eda4f7918354ec7d0433ad16274": {
					"delegate": "eff1b5b26e65b791d6f236c7c0264012bd1696759d22bdb4dd0f6f56",
					"vrf": "e6f70fb10c7523aa76648e20d17e65fd9b2ed53960fbd20b308f223b703f2e23"
				},
				"2fca486b4d8f1a0432f5bf18ef473ee4294c795a1a32e3132bc6b90f": {
					"delegate": "de665a71064706f946030505eae950583f08c316f0f58997961092b1",
					"vrf": "c3fde629add60e30142cd7ef3c680610975208b08aee42203a5c40ad5992e8f6"
				},
				"4ee98623920698b77c1c7f77288cbdac5f9011ff8970b1f507567d0d": {
					"delegate": "bf07107c6f632de95e34af7e009d2aafa19916c7ba89b944fbedcd72",
					"vrf": "9d7d12e3d6b02835be3e76cfc6ae93d937035ee0e006d04a0eef9dea19754e21"
				},
				"0d06d2547ed371fdf95fb5c4c735eecdd53e6a5bb831561bd0fcfd3d": {
					"delegate": "6df3e1b4b8a84c63c805076a85e5aa00924997a4eae85fddf0aee3ca",
					"vrf": "0774e5810fe02a014ec97ef424797172f2b8c5dcfb6e4cfc98b411c31d5096d8"
				},
				"581e23030b6038bae716e5d64b9e053db10541b12e6b0b4eff485454": {
					"delegate": "b0dca078b823cde627da136200d6618c49ad712b77972a1c5e135763",
					"vrf": "16a4e883b72ddbd09a4f8a1170fc346ab11e4202f814faa73e9d2433ee03e7b0"
				},
				"e5f27655371b54aed91cc916b2569060978be80056768fee2cc5ce1b": {
					"delegate": "b3873a254459f506e47b9a252ee7912e538b364447f31576a170db65",
					"vrf": "cc5c897fdf5db0017326656fe35aeb20c72b175540793f9b9b8dc9ade001bbc4"
				}
			},
			"updateQuorum": 5,
			"networkId": "Testnet",
			"initialFunds": {},
			"maxLovelaceSupply": 45000000000000000,
			"networkMagic": 1097911063,
			"epochLength": 432000,
			"systemStart": "2019-07-24T20:20:16Z",
			"slotsPerKESPeriod": 129600,
			"slotLength": 1,
			"maxKESEvolutions": 62,
			"securityParam": 2160
		},
		LocalCluster: {
			"activeSlotsCoeff": 0.5,
			"protocolParams": {
				"poolDeposit": 0,
				"protocolVersion": {
					"minor": 0,
					"major": 0
				},
				"minUTxOValue": 1000000,
				"decentralisationParam": 0.25,
				"maxTxSize": 16384,
				"minPoolCost": 0,
				"minFeeA": 100,
				"maxBlockBodySize": 239857,
				"minFeeB": 100000,
				"eMax": 1000000,
				"extraEntropy": {
					"tag": "NeutralNonce"
				},
				"maxBlockHeaderSize": 217569,
				"keyDeposit": 1000000,
				"keyDecayRate": 0,
				"nOpt": 3,
				"rho": 0.178650067,
				"poolMinRefund": 0,
				"tau": 0.0,
				"a0": 0.1
			},
			"protocolMagicId": 764824073,
			"genDelegs": {
				"8ae01cab15f6235958b1147e979987bbdb90788f7c4e185f1632427a": {
					"delegate": "b7bf59bb963aa785afe220f5b0d3deb826fd0bcaeeee58cb81ab443d",
					"vrf": "4ebcf8b4c13c24d89144d72f544d1c425b4a3aa1ace30af4eb72752e75b40d3e"
				}
			},
			"updateQuorum": 1,
			"networkId": "Mainnet",
			"maxMajorPV": 25446,
			"initialFunds": {},
			"maxLovelaceSupply": 1000000000000000000,
			"networkMagic": 764824073,
			"epochLength": 50,
			"staking": null as any,
			"systemStart": "2021-06-09T21:25:40Z",
			"slotsPerKESPeriod": 86400,
			"slotLength": 0.2,
			"maxKESEvolutions": 90,
			"securityParam": 5
		}
}