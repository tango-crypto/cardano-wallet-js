import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

import 'mocha';

import { ApiTransactionStatusEnum, WalletsAssetsAvailable, WalletswalletIdpaymentfeesAmountUnitEnum } from '../models';
import { Seed } from '../utils';
import { WalletServer } from '../wallet-server';
import * as dotenv from "dotenv";
import { AssetWallet } from '../wallet/asset-wallet';
import { CoinSelectionWallet } from '../wallet/coin-selection-wallet';
import { TokenWallet } from '../wallet/token-wallet';
import { Testnet, LocalCluster } from '../config/network.config';
import { ShelleyWallet } from '../wallet/shelley-wallet';
dotenv.config();

describe('Cardano asset tokens', function () {
	this.timeout(0);
	let walletServer: WalletServer;
	let tangoPolicyId = '';

	let wallets = [
		{
			"passphrase": "shellley-no-delegation",
			"mnemonic_sentence": ["over", "decorate", "flock", "badge", "beauty", "stamp", "chest", "owner", "excess", "omit", "bid", "raccoon", "spin", "reduce", "rival"],
			"address_pool_gap": 20,
			"state": {
				"status": "ready"
			},
			"balance": {
				"reward": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"total": {
					"quantity": 100000000000,
					"unit": "lovelace"
				},
				"available": {
					"quantity": 100000000000,
					"unit": "lovelace"
				}
			},
			"name": "shelley-no-delegation",
			"delegation": {
				"next": [] as any[],
				"active": {
					"status": "not_delegating"
				}
			},
			"id": "2a793eb367d44a42f658eb02d1004f50c14612fd",
			"tip": {
				"height": {
					"quantity": 15010,
					"unit": "block"
				},
				"time": "2021-03-31T14:17:56.2Z",
				"epoch_number": 590,
				"absolute_slot_number": 29511,
				"slot_number": 11
			},
			"assets": {
				"total": [] as any[],
				"available": [] as any[]
			},
			"txs": [
				{
					"inserted_at": {
						"height": {
							"quantity": 9,
							"unit": "block"
						},
						"time": "2021-03-31T22:28:15.2Z",
						"epoch_number": 1,
						"absolute_slot_number": 66,
						"slot_number": 16
					},
					"status": "in_ledger",
					"withdrawals": [] as any[],
					"amount": {
						"quantity": 100000000000,
						"unit": "lovelace"
					},
					"inputs": [
						{
							"id": "1669654d59d76084dfd7c14a0960d3de56f81d24e5a19351853ea0be434b3ed1",
							"index": 0
						}
					],
					"direction": "incoming",
					"fee": {
						"quantity": 0,
						"unit": "lovelace"
					},
					"outputs": [
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9m7qqkehg8y08wkw0p8qrnkrsqdj4tew78r7vqt0e4rfyg6e628h",
							"assets": [] as any[]
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxk7zajwxrj7d63d857leyr5xjns5eqwu90t7av9s3qansgy3n03h",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxzfrx9fqmr9rksy3d3p5dt4s7kuzvxecptp4g6k6jyjf0c4wqrqv",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9fgg22y8zg9ew0sr8zecem3awlp8y2nkz06pj9rp0jze2g8yaz8s",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxqxrkn4m9gkkw9zjxv0ucclakl9yk0mf58szfnexv6gp4cqd8lmc",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxyh67eruv8lk7j5cd4uxxlwzhh5s37agmq82g8yly8d6ysgvf36v",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8fh0twhfl8asg2umdrghc0atawtlsvgtn4w2em5cdka5nq9htxna",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9jxt6pyruyjp09hcgmfz842cewgd76rft7kc2th7xaq74qfcrflh",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vynncsy67q5gzuextklwhgg7fqesm28lk7k3tryy4j9cmfsepfas7",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxwghnp98zdnqwxhsjccm4w7kcz5u5cazhe6f3dyes4g7pgf6f5lp",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8kjvptz7htc03uck4a6s78cvuetqgwhqyt5kf7mtleta8ce94xxu",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxy82rpx84s58vy74y34gy88lw0x0hvttuap6599nujp3cgdqvwsh",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8twacd3svulf74kxg4us59yrvp3lt4ajvl90w3u8vdjx2cajgkgy",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxwz08f2nd28eagctmpfxzcv8xn5lg8d4wjpx20ypfn93zcs8uucg",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vx9n2zkkgc6gqy2j3kkyfxjf27mtm98lx0vnwhj5jz5uasq9yl5hk",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9zsagjclpwam9p6humeg87x7r8r268kf5k8h5kun0sh3rgs7536w",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vyjqralj63q5xyw03sxxeyc8svfk3ymrw2gwj79p0p00lxcapajam",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vx7r3cy4uanwjgqjyttnymqkqsrt448ezylrkkdvqrjzxzssn75lu",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vydvk9kl2tqf5wkxajalkgf8kemjak3glhrm4d5l99jwhysfqx5ts",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy7qf5ctc8ydaz0d0g8dwy05eq8d4mtenlz377mzpec45sgk3f5q0",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9c36pmak8t8a8ra8jz347rmv3vxxq4mvc3ccmn9aez9glgq5mwq6",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy3f4vhj8xt9x8t93np94uak2kptltuw2spr0a7jy0jnftgzskwy5",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8y20cs4h8n4jcf6fgpkf9yea35r8sawazk7r7rktf9w2hssz5yu7",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v94ywg549gh0zs4g9fmty4tgm0cq5a95lsm29lccpezks3qf9w3hg",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v876apusu8nfs6d6apgmj6vp5lcjjxmlvlc2sj9y98wtv5c7qc2yq",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxyht88xde2nj25wfm63a0c24tvs2xulzpcvvhm4z4sjxsc0rfvah",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v95k6agq60kjdpf9uh68nz32wayqdf7m9zgqzeqc64mdefstkmfj8",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vyshpxd63rwpg7l9qt3atsfnf2mgw749zuz9sk5ytk5jtxctw66gt",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy2qapgq2m8f6rawzlh9f9e4haz0h6rxsk4rul6xec29rsc96c9nt",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v946mhp66he3x8vwltpakf9m3k4nrs85k6gpxg8pprhmhyq5n8erd",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vyzngcwg46eemhu9uduvu7nwmjhzc5grnzl9dtftmhjf9fc8vqq7a",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8qfgyumu7n0tsje3m9aednwgm9vut79h8l02dr99rtjvssps5qr5",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vyhcdseax6mjcrxz2c64p2czmgqtpvzptgtjhdlykm0ppmg8emn7s",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8qafj5c5yms4wcquvq6mznnhv9qdtpemr5y0dw9m885rqs2cjg7e",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v92gawsmqg5qguugclyearf2qrv6m9sjhsy20qdxp7a76dsg6yn5f",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxwpcgf27r7nnwf983zzc8zgh0mgh3jgdhugps7cvuy0mcgyzs9sa",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxe02c3trl78295wmdymgc02ep4l299t80msq4zk70dxtuckl9k29",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8kt5a9fu6emsqwn9pmkzxwf5cws8nnyk72nsseqldt7r2cc40gw2",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxzh0n0kleyazj8uvla92vvxhydwrpmfnsnuq5paa45lk9smr9pxc",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9rw4mn2hlgcvhw96p25r98vgppk2xpyq78f3mrkufwhxncw6a0qs",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy02rescazffxy9447eh3pcgvy22kywdwatmp4ehu2cy5dgtwd2fr",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v9csrpk0l9rh5y3xx0qwjpq97ag00cp3qunlgdwmzwfd0nqrqtqny",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxed6d24ug6h5xsvr5prnzsyur5ux38l2cw6rva84a4e9ccm42vm2",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vyqysc73p93ecrnea6jx98u09ueuq39kk52z0f57vzl5vjqqzdw3p",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v89tyleg3qxqg00u9qsvmykyy3dfutcl2qsu5wnsm2fj33q5rdr5m",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vxq95kjh5yf6t4uy9ytlu5mzp6kgxa3wvszv5fzx99k92hc0d248y",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8mpmyf5fj2hgvfapgwc3g2tvw4revnpn4xy6ezrprsjencrsaudf",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1v8qmyqyacms90zr5npww4zl3gh5sxe4afmzdzr6temtcw4surwdhx",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy074kt6eytqra6gh58ju70u76n5gujm09q6ej3hqpcw5gc9vhktm",
							"assets": []
						},
						{
							"amount": {
								"quantity": 1000000,
								"unit": "lovelace"
							},
							"address": "addr1vy3qlm7k4chn3p9zh37u0mpny420n5r7854yujc30lsyf7gk2ppyf",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vxv60se24f26v2xex66nnuqa2s2nrr0v3094uk0vwxhkjkc3mwljs",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vyuxc75xmzzy7sy955pyz4tqg0ycgttjcv2u39ay929q2yq8h7umy",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vx7hsxtpw3vae52avvwy24j4xj7kpcvpxqzs4m24h0r8ngc9e6rd6",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v9qw9xflglesswd8prfagn3e3rauu7hyn7cnd6fw7y2ht3gdah3qf",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vxu5sa6effs76vgayk9n5wfdaprmwt96g6wrfxaz7nhynncl3a9j2",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vym7k0fkzfr6q6ykvd7wfdn35aqyx6mnewsh0ws2zdh7l5spt00my",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v99wq77g6t2jvmy420r22hqd028s7079p8ssgz45ehxnexqjg5qwx",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vy7ptj37j2j09agtqa822fdqpf82e5ws2xtzd0xn8xeygpqu6pvqu",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vxztq9lhj9k7v7r3ye930uvpwarc8cps53qjcq0q35t4glcx9a3m7",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vy97tuy34tz42jg60dyft9qp89msyn9vsdd730nmemk5s4qzu5tjf",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v9qhhts5p86qj9ursda7y22rv5m0mcjsuqdct7gulnfkhps9ysqeg",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vy835wr2cgu7ypff304hana5j9c8nuald28ktldn53wzedsxxzwkv",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vx8uckm9s4ty0ste2mk6tj77h0pcrfystmrmthns5nls8rqallrvy",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v8jdrahgwxyc26ptdtfgm2qrrpath6p5wdhcrqtcj94vkts72czsg",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vyx0myhmrd7dj3l6zkyhmag7shmdd48yhylm34u2lud3pdcehesq2",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vy6sqevluqp7lftl88hup6h4pu3ggeexnwrmqkfvewtvuvsn9ftn5",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vxtk0aguznvjqqatj9cfdx0xhmtp52hqxky87yusjsn34cc7kh3k6",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vx48m9dn30hgm840g9s30yyjlv5dsqfh429xn89sskunr4q46q3yd",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v8ecg4npdm76m8gdmnvnze4hukmgn7yy4au5ta7447kh4vq2pkt30",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1vx9j2tk307qzkkzk68x6h57r26fj802g9gja268r8z5umpgnql9fw",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v9u6pzee8v733z6cptppjq6wyprztqpp58kzfaz8qypphdsummuyt",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v9fwez477qgc9wm72c78e46q0nvfujcefqklsea4kdn784stk7ufq",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v957kxplc6pq8j7xajm2kcydn3cj8zf3a7u55swysah8ldq6narjd",
							"assets": []
						},
						{
							"amount": {
								"quantity": 100000000000,
								"unit": "lovelace"
							},
							"address": "addr1v98d5fszt89zk9fw4jjnuptk67n8z0707v8gqr03c88y8uc7plull",
							"assets": []
						}
					],
					"metadata": null as any,
					"depth": {
						"quantity": 170,
						"unit": "block"
					},
					"id": "1d9025cddb72f9e15510dff6e67d1d7718704f19d6b66f1f4232dc5847f921d4",
					"deposit": {
						"quantity": 0,
						"unit": "lovelace"
					},
					"mint": [] as any[]
				}
			]
		},
		{
			"passphrase": "shelley-small-coins",
			"mnemonic_sentence": ["either", "flip", "maple", "shift", "dismiss", "bridge", "sweet", "reveal", "green", "tornado", "need", "patient", "wall", "stamp", "pass"],
			"address_pool_gap": 20,
			"state": {
				"status": "ready"
			},
			"balance": {
				"reward": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"total": {
					"quantity": 43000000,
					"unit": "lovelace"
				},
				"available": {
					"quantity": 43000000,
					"unit": "lovelace"
				}
			},
			"name": "shelley-small-coins",
			"delegation": {
				"next": [] as any[],
				"active": {
					"status": "not_delegating"
				}
			},
			"id": "60bb5513e4e262e445cf203db9cf73ba925064d2",
			"tip": {
				"height": {
					"quantity": 15010,
					"unit": "block"
				},
				"time": "2021-03-31T14:17:56.2Z",
				"epoch_number": 590,
				"absolute_slot_number": 29511,
				"slot_number": 11
			},
			"assets": {
				"total": [] as any[],
				"available": [] as any[]
			}
		},
		{
			"passphrase": "shelley-100-utxo",
			"mnemonic_sentence": ["radar", "scare", "sense", "winner", "little", "jeans", "blue", "spell", "mystery", "sketch", "omit", "time", "tiger", "leave", "load"],
			"address_pool_gap": 20,
			"state": {
				"status": "ready"
			},
			"balance": {
				"reward": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"total": {
					"quantity": 10000100000000,
					"unit": "lovelace"
				},
				"available": {
					"quantity": 10000100000000,
					"unit": "lovelace"
				}
			},
			"name": "shelley-100-utxo",
			"delegation": {
				"next": [],
				"active": {
					"status": "not_delegating"
				}
			},
			"id": "868d04759fd222ac776484888d4bcd462d146772",
			"tip": {
				"height": {
					"quantity": 15010,
					"unit": "block"
				},
				"time": "2021-03-31T14:17:56.2Z",
				"epoch_number": 590,
				"absolute_slot_number": 29511,
				"slot_number": 11
			},
			"assets": {
				"total": [],
				"available": []
			}
		},
		{
			"passphrase": "icarus-500-address-index",
			"mnemonic_sentence": ["erosion", "ahead", "vibrant", "air", "day", "timber", "thunder", "general", "dice", "into", "chest", "enrich", "social", "neck", "shine"],
			"address_pool_gap": 20,
			"state": {
				"status": "ready"
			},
			"balance": {
				"reward": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"total": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"available": {
					"quantity": 0,
					"unit": "lovelace"
				}
			},
			"name": "icarus-500-address-index",
			"delegation": {
				"next": [],
				"active": {
					"status": "not_delegating"
				}
			},
			"id": "9ada973fd29d6b3d096ab361ef5fd082576bdbe3",
			"tip": {
				"height": {
					"quantity": 15010,
					"unit": "block"
				},
				"time": "2021-03-31T14:17:56.2Z",
				"epoch_number": 590,
				"absolute_slot_number": 29511,
				"slot_number": 11
			},
			"assets": {
				"total": [],
				"available": []
			}
		},
		{
			"passphrase": "ledger-1234567890",
			"mnemonic_sentence": ["vague", "wrist", "poet", "crazy", "danger", "dinner", "grace", "home", "naive", "unfold", "april", "exile", "relief", "rifle", "ranch", "tone", "betray", "wrong"],
			"address_pool_gap": 20,
			"state": {
				"status": "ready"
			},
			"balance": {
				"reward": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"total": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"available": {
					"quantity": 0,
					"unit": "lovelace"
				}
			},
			"name": "ledger-2",
			"delegation": {
				"next": [],
				"active": {
					"status": "not_delegating"
				}
			},
			"id": "4ea40ca5323bad2efb77c68ae42e5bb7205ab5e6",
			"tip": {
				"height": {
					"quantity": 15010,
					"unit": "block"
				},
				"time": "2021-03-31T14:17:56.2Z",
				"epoch_number": 590,
				"absolute_slot_number": 29511,
				"slot_number": 11
			},
			"assets": {
				"total": [],
				"available": []
			}
		}
	];

	let coinSelectiontx: CoinSelectionWallet = {
		"withdrawals": [] as any[],
		"inputs": [
			{
				"amount": {
					"quantity": 5000000,
					"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
				},
				"address": "addr1q8a8ywtvzaqm7q3egvzycasxnnt94fgsv436gx5y69ez4dc7vjhxlzaazkhgv47za494arh3lqhz997hat2vveuzlvfs84qlsh",
				"id": "d7700008431233698659a03ad6e0fe0baf00dddfc12c03c0a1a6bab42124652e",
				"derivation_path": [
					"1852H",
					"1815H",
					"0H",
					"1",
					"5"
				],
				"assets": [],
				"index": 5
			},
		],
		"deposits": [],
		"change": [
			{
				"amount": {
					"quantity": 2000000,
					"unit": WalletswalletIdpaymentfeesAmountUnitEnum.Lovelace
				},
				"address": "addr1qx2etfhpx2zegfzsl2l2ts5x6rkc7dwwhkxvyngn8pg29cs7vjhxlzaazkhgv47za494arh3lqhz997hat2vveuzlvfstr8fa6",
				"derivation_path": [
					"1852H",
					"1815H",
					"0H",
					"1",
					"0"
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
				"address": "addr1q9rcrtzc37hk92ka5zjcfeqml9mkud0c8tcgpqqd362stcq7vjhxlzaazkhgv47za494arh3lqhz997hat2vveuzlvfspzhcng",
				"assets": []
			}
		]
	};

	before('Initializing the test cluster ...', async function () {
		walletServer = WalletServer.init(`http://${process.env.TEST_WALLET_HOST}:${process.env.TEST_WALLET_PORT}/v2`);

		for (let i = 0; i < wallets.length - 1; i++) {
			const w = wallets[i];
			await walletServer.createOrRestoreShelleyWallet(w.name, w.mnemonic_sentence, w.passphrase);
		}
	});

	after('Cleaning the test cluster ...', async function () {
		let list = await walletServer.wallets();
		for (let i = 0; i < list.length; i++) {
			const wallet = list[i];
			await wallet.delete();
		}
	});

	// afterEach('wait before each minting', async function() {
	// 	const time = 1;
	// 	console.log(`waiting ${time}s ...`);
	// 	await delay(time);
	// });

	describe('asset tokens', function () {
		it("should create a policy Id", function () {
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildSingleIssuerScript(keyHash);
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			expect(policyId).length(56);
		});

		it("should mint single issuer 1000000 Tango token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate single issuer native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAllScript([Seed.buildSingleIssuerScript(keyHash)]);

			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);
			tangoPolicyId = policyId;

			// asset
			let asset = new AssetWallet(policyId, "Tango", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing key
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens included
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);

			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		});

		it("should mint multi issuer all 1000000 Tango1 token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate single issuer native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAllScript([Seed.buildSingleIssuerScript(keyHash)]);

			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			// asset
			let asset = new AssetWallet(policyId, "Tango1", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing key
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens included
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);

			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		});

		it("should mint multi issuer any 1000000 Tango2 token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate single issuer native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAnyScript([Seed.buildSingleIssuerScript(keyHash)]);

			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			// asset
			let asset = new AssetWallet(policyId, "Tango2", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing key
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens included
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);
			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		
		});

		it("should mint multi issuer at least 1000000 Tango3 token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate single issuer native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAtLeastScript(1, [Seed.buildSingleIssuerScript(keyHash)]);

			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			// asset
			let asset = new AssetWallet(policyId, "Tango3", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing key
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens 
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);

			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		});

		it("should mint after 1000000 Tango4 token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate after native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAllScript([Seed.buildAfterScript(info.node_tip.absolute_slot_number - 1), Seed.buildSingleIssuerScript(keyHash)]);


			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			// asset
			let asset = new AssetWallet(policyId, "Tango4", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing keys
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens included
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { startSlot: info.node_tip.absolute_slot_number, config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);

			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		});

		it("should mint before 1000000 Tango5 token", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			// address to hold the minted tokens
			let addresses = [(await wallet.getAddresses())[0]];

			// get ttl info
			let info = await walletServer.getNetworkInformation();
			let ttl = info.node_tip.absolute_slot_number * 12000;

			// policy public/private keypair
			let keyPair = Seed.generateKeyPair();
			let policyVKey = keyPair.publicKey;
			let policySKey = keyPair.privateKey;

			// generate single issuer native script
			let keyHash = Seed.getKeyHash(policyVKey);
			let script = Seed.buildMultiIssuerAllScript([Seed.buildBeforeScript(ttl + 1), Seed.buildSingleIssuerScript(keyHash)]);

			//generate policy id
			let scriptHash = Seed.getScriptHash(script);
			let policyId = Seed.getPolicyId(scriptHash);

			// asset
			let asset = new AssetWallet(policyId, "Tango5", 1000000);

			// token
			let tokens = [new TokenWallet(asset, script, [keyPair])];

			//scripts
			let scripts = tokens.map(t => t.script);

			// get min ada for address holding tokens
			let minAda = Seed.getMinUtxoValueWithAssets([asset], LocalCluster);
			let amounts = [minAda];

			// get coin selection structure (without the assets)
			let coinSelection = await wallet.getCoinSelection(addresses, amounts);

			// add signing keys
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			// add policy signing keys
			tokens.filter(t => t.scriptKeyPairs).forEach(t => signingKeys.push(...t.scriptKeyPairs.map(k => k.privateKey.to_raw_key())));

			// the wallet currently doesn't support including tokens not previuosly minted
			// so we need to include it manually.
			coinSelection.outputs = coinSelection.outputs.map(output => {
				if (output.address === addresses[0].address) {
					output.assets = tokens.map(t => {
						let asset: WalletsAssetsAvailable = {
							policy_id: t.asset.policy_id,
							asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
							quantity: t.asset.quantity
						};
						return asset;
					});
				}
				return output;
			});

			// we need to sing the tx and calculate the actual fee and the build again 
			// since the coin selection doesnt calculate the fee with the asset tokens included
			let txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { config: LocalCluster }, 'utf8');
			let tx = Seed.sign(txBody, signingKeys, null, scripts);

			// submit the tx
			let signed = Buffer.from(tx.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;
		});

		it("should send 100 Tango tokens", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);

			let receiver = wallets.find(w => w.id == "60bb5513e4e262e445cf203db9cf73ba925064d2");
			let rWallet = await walletServer.getShelleyWallet(receiver.id);

			// address to send the minted tokens
			let addresses = [(await rWallet.getAddresses())[0]];

			let asset = new AssetWallet(tangoPolicyId, Buffer.from("Tango").toString('hex'), 100);
			let assets: { [key: string]: AssetWallet[] } = {};
			assets[addresses[0].id] = [asset];
			try {

				let minUtxo = Seed.getMinUtxoValueWithAssets([asset], LocalCluster, 'hex');
				let tx = await wallet.sendPayment(payeer.passphrase, addresses, [minUtxo], ['send 100 Tango tokens'], assets);
				await waitUntilTxFinish(tx.id, wallet);
				expect(tx).not.undefined;
			} catch (err) {
				let er = err;
				console.log(er);
			}
		});

		it("should construct tx and send 100 Tango tokens ", async function () {
			let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
			let wallet = await walletServer.getShelleyWallet(payeer.id);
			let receiver = wallets.find(w => w.id == "60bb5513e4e262e445cf203db9cf73ba925064d2");
			let rWallet = await walletServer.getShelleyWallet(receiver.id);

			// address to send the minted tokens
			let addresses = [(await rWallet.getAddresses())[10]];

			let asset = new AssetWallet(tangoPolicyId, Buffer.from("Tango").toString('hex'), 100);
			let assets: { [key: string]: AssetWallet[] } = {};
			assets[addresses[0].id] = [asset];
			let minUtxo = Seed.getMinUtxoValueWithAssets([asset], LocalCluster, 'hex');
			let data = ['send 100 Tango tokens'];
			let coinSelection = await wallet.getCoinSelection(addresses, [minUtxo], data, assets);
			let info = await walletServer.getNetworkInformation();

			//build and sign tx
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence);
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			let metadata = Seed.buildTransactionMetadata(data);
			let txBuild = Seed.buildTransaction(coinSelection, info.node_tip.absolute_slot_number * 12000, { metadata: metadata });
			let txBody = Seed.sign(txBuild, signingKeys, metadata);
			let signed = Buffer.from(txBody.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			// const status = await wallet.getTransaction(txId);
			// console.log('status', status);
			await waitUntilTxFinish(txId, wallet);
			expect(txId).not.undefined;

		});

		it("should work", async function () {
			try {
				// const signed1 = "84a60081825820be92b1f138bfaf43e409ae8ab398444e8e7fad4bf7b4f5362cd95157ac69a02d0b018282583901386c7a86d8844f4085a50241556043c9842d72c315c897a42a8a0510342dac9f95ee4f92567f652a736d64bfa0afaa2da795dda8de658580821a004c4b40a1581cea208b3e5fcd39d3ca5813c2c0b93e3eac6ef72715bc14f6ab46a161a145534f4c41521b00000002540be4008258390168babc986d102e15204d0cc27ad1b67ed3f52287244a26f9fe37fefb342dac9f95ee4f92567f652a736d64bfa0afaa2da795dda8de6585801b00000017481b5a80021a000f4240031a000f42400758202e3e2f3a9ac2e05567653c0de13e8ef68d2246eea76c1f23f55034ca75a2216709a1581cea208b3e5fcd39d3ca5813c2c0b93e3eac6ef72715bc14f6ab46a161a145534f4c41521b00000002540be400a200828258201a4c7690edbc56faaa35070a74639c2c0199858201a8fd2d2eb970ad31af525c584011382eae44448fe0792133c8435392e482910a0eb413e251a9df5d9f863e4d71d1a31aa1e644834bc60a06224e7ac390b82699f4b9485f362d7698247a1e3a04825820ecf7fc9bda7b7e573d97efdc8f9d0e34e87575098dd6bb913c1b7ec21b63f6fa584013831ea2728ef53e5b7753dce738b1ebfa184b32e5b1d65facab84a4ca40edcb641b017b628c451ec439280ac480b182a396ac6541b6b768a4eb56c8cb65700b01818200581c7042a1212e306ca3076b41494f26c17a6ad50c6e6fafef39627bdf80f582a100a163717765187b818200581c7042a1212e306ca3076b41494f26c17a6ad50c6e6fafef39627bdf80";
				// const id = await walletServer.submitTx(signed1);
				// console.log('TxId:', id);

				let payeer = wallets.find(w => w.id == "2a793eb367d44a42f658eb02d1004f50c14612fd");
				const recoveryPhrase = payeer.mnemonic_sentence;
				let wallet = await walletServer.getShelleyWallet(payeer.id);

				// Recovery phrase for tangocrypto-wallet-2
				// const recoveryPhrase = 'hurt engage genre exist dad melody monster heart elegant field tree filter scorpion jar prevent'.split(' ');
				// const name = 'jamespistell-wallet';
				// const passphrase = '1234567890';

				// const wallet = await walletServer.createOrRestoreShelleyWallet(name, recoveryPhrase, passphrase);
				// const wallets = await walletServer.wallets();
				// // Get the 2nd wallet in your node
				// const { id } = wallets[1];
				// const wallet = await walletServer.getShelleyWallet(id);
				// address to hold the minted tokens. You can use which you want.
				const addresses = [(await wallet.getAddresses())[0]];
				// blockchain config, this is where you can find protocol params, slotsPerKESPeriod etc. Structure is: { byron: ..., shelley: ..., alonzo: ..., protocols: ... }
				// You can find the latest config files here: https://hydra.iohk.io/build/6498473/download/1/index.html
				// let config = { ..., "shelley": { ..., "protocolParams": {... "minFeeA": 44, ..., "minFeeB": 155381, ...} } }
				// const config = Config.Testnet;
				const config = Testnet;
				// const config = {
				// 	activeSlotsCoeff: 0.05,
				// 	protocols: { // formerly 'protocolParams'
				// 		protocolVersion: {
				// 			minor: 0,
				// 			major: 2,
				// 		},
				// 		decentralisationParam: 1,
				// 		eMax: 18,
				// 		extraEntropy: {
				// 			tag: 'NeutralNonce',
				// 		},
				// 		maxTxSize: 16384,
				// 		maxValueSize: 5000,
				// 		maxBlockBodySize: 65536,
				// 		maxBlockHeaderSize: 1100,
				// 		txFeePerByte: 44, // formerly 'minFeeA
				// 		txFeeFixed: 155381, // formerly 'minFeeB'
				// 		minUTxOValue: 1000000,
				// 		stakePoolDeposit: 500000000, // formerly 'poolDeposit'
				// 		minPoolCost: 340000000,
				// 		stakeAddressDeposit: 2000000, // formerly 'keyDeposit'
				// 		nOpt: 150,
				// 		rho: 0.003,
				// 		tau: 0.20,
				// 		a0: 0.3,
				// 	},
				// 	genDelegs: {
				// 		'2f56e87d67b8e5216582cfeb95dbdc9083110a3ef68faaa51bef3a80': {
				// 			delegate: 'bd5933d3c5417f17a64c7214711a26abc3bc03e2c90dc1bb38e0c39f',
				// 			vrf: '9a0b0f537874d089cedfa9e250150405e47ea29acee87c40a223ae0a175d26f8',
				// 		},
				// 		'514e81afb082fce01678809eebd90eda4f7918354ec7d0433ad16274': {
				// 			delegate: 'eff1b5b26e65b791d6f236c7c0264012bd1696759d22bdb4dd0f6f56',
				// 			vrf: 'e6f70fb10c7523aa76648e20d17e65fd9b2ed53960fbd20b308f223b703f2e23',
				// 		},
				// 		'2fca486b4d8f1a0432f5bf18ef473ee4294c795a1a32e3132bc6b90f': {
				// 			delegate: 'de665a71064706f946030505eae950583f08c316f0f58997961092b1',
				// 			vrf: 'c3fde629add60e30142cd7ef3c680610975208b08aee42203a5c40ad5992e8f6',
				// 		},
				// 		'4ee98623920698b77c1c7f77288cbdac5f9011ff8970b1f507567d0d': {
				// 			delegate: 'bf07107c6f632de95e34af7e009d2aafa19916c7ba89b944fbedcd72',
				// 			vrf: '9d7d12e3d6b02835be3e76cfc6ae93d937035ee0e006d04a0eef9dea19754e21',
				// 		},
				// 		'0d06d2547ed371fdf95fb5c4c735eecdd53e6a5bb831561bd0fcfd3d': {
				// 			delegate: '6df3e1b4b8a84c63c805076a85e5aa00924997a4eae85fddf0aee3ca',
				// 			vrf: '0774e5810fe02a014ec97ef424797172f2b8c5dcfb6e4cfc98b411c31d5096d8',
				// 		},
				// 		'581e23030b6038bae716e5d64b9e053db10541b12e6b0b4eff485454': {
				// 			delegate: 'b0dca078b823cde627da136200d6618c49ad712b77972a1c5e135763',
				// 			vrf: '16a4e883b72ddbd09a4f8a1170fc346ab11e4202f814faa73e9d2433ee03e7b0',
				// 		},
				// 		e5f27655371b54aed91cc916b2569060978be80056768fee2cc5ce1b: {
				// 			delegate: 'b3873a254459f506e47b9a252ee7912e538b364447f31576a170db65',
				// 			vrf: 'cc5c897fdf5db0017326656fe35aeb20c72b175540793f9b9b8dc9ade001bbc4',
				// 		},
				// 	},
				// 	updateQuorum: 5,
				// 	networkId: 'Testnet',
				// 	initialFunds: {},
				// 	maxLovelaceSupply: 45000000000000000,
				// 	networkMagic: 1097911063,
				// 	epochLength: 432000,
				// 	systemStart: '2019-07-24T20:20:16Z',
				// 	slotsPerKESPeriod: 129600,
				// 	slotLength: 1,
				// 	maxKESEvolutions: 62,
				// 	securityParam: 2160,
				// };
				// policy public/private keypair
				const keyPair = Seed.generateKeyPair();
				const policyVKey = keyPair.publicKey;
				const policySKey = keyPair.privateKey;
				// generate single issuer native script
				const keyHash = Seed.getKeyHash(policyVKey);
				const script = Seed.buildSingleIssuerScript(keyHash);

				// generate policy id
				const scriptHash = Seed.getScriptHash(script);
				const policyId = Seed.getPolicyId(scriptHash);
				// metadata
				const data: any = {};
				const tokenData: any = {};
				tokenData[policyId] = {
					SOLAR: {
						name: 'SOLAR Token',
						ticker: 'SOLAR',
						description: 'Cardano Solar Token',
						// Custom image I made
						image: 'ipfs://QmUuNuz9TYXb7Xe4giFV8u6EmrhuXN6BRZbQqzh53AhTT6',
						website: 'https://solartoken.io',
					},
				};
				data[0] = tokenData;
				// asset, 10 billion
				const asset = new AssetWallet(policyId, 'SOLAR', 2**53-1);
				// token
				const tokens = [new TokenWallet(asset, script, [keyPair])];
				// scripts
				const scripts = tokens.map((t) => t.script);
				// get min ada for address holding tokens
				const minAda = Seed.getMinUtxoValueWithAssets([asset], config);
				const amounts = [minAda];
				// get ttl info
				const info = await walletServer.getNetworkInformation();
				const ttl = info.node_tip.absolute_slot_number * 12000;
				// get coin selection structure (without the assets)
				const coinSelection = await wallet.getCoinSelection(addresses, amounts, data);
				// add signing keys
				const rootKey = Seed.deriveRootKey(recoveryPhrase);
				const signingKeys = coinSelection.inputs.map((i) => {
					const privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
					return privateKey;
				});

				const skeys = signingKeys.map(s => s.to_bech32());
				// const scriKeys = tokens[0].scriptKeyPairs.map((k) => k.privateKey.to_raw_key().to_bech32());

				// add policy signing keys
				tokens.filter((t) => t.scriptKeyPairs).forEach((t) => signingKeys.push(...t.scriptKeyPairs.map((k) => k.privateKey.to_raw_key())));

				const metadata = Seed.buildTransactionMetadata(data);

				// the wallet currently doesn't support including tokens not previuosly minted
				// so we need to include it manually.
				coinSelection.outputs = coinSelection.outputs.map((output) => {
					if (output.address === addresses[0].address) {
						// eslint-disable-next-line no-param-reassign
						output.assets = tokens.map((t) => {
							const newAsset = {
								policy_id: t.asset.policy_id,
								asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
								quantity: t.asset.quantity,
							};
							return newAsset;
						});
					}
					return output;
				});
				// we need to sing the tx and calculate the actual fee and the build again
				// since the coin selection doesnt calculate the fee with the asset tokens included
				const txBody = Seed.buildTransactionWithToken(coinSelection, ttl, tokens, signingKeys, { data, config }, 'utf8');
				const tx = Seed.sign(txBody, signingKeys, metadata, scripts);

				// submit the tx
				const signed = Buffer.from(tx.to_bytes()).toString('hex');
				const txId = await walletServer.submitTx(signed);
				console.log('submit', txId);
			} catch (err) {
				const er = err;
				console.log(er);
			}

		})
	})
});

async function waitUntilTxFinish(txId: string, wallet: ShelleyWallet): Promise<void> {
	return new Promise<void>(async (resolve, reject) => {
		let tx = { status: ApiTransactionStatusEnum.Pending };
		do {
			await delay(1);
			tx = await wallet.getTransaction(txId);
		} while (tx.status == ApiTransactionStatusEnum.Pending)
		resolve();
	})
};

async function delay(time: number) {
	return new Promise<void>((resolve, reject) => {
		setTimeout(function () { resolve(); }, time * 1000);
	});
}