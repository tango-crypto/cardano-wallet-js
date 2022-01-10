import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

import 'mocha';

import { ApiTransactionDirectionEnum, ApiTransactionStatusEnum, WalletsDelegationActiveStatusEnum } from '../models';
import { Seed } from '../utils';

import { WalletServer } from '../wallet-server';
import { KeyRoleEnum } from '../wallet/key-wallet';

import * as dotenv from "dotenv";
import { ShelleyWallet } from '../wallet/shelley-wallet';
import { TransactionWallet } from '../wallet/transaction-wallet';
import { LocalCluster } from '../config/network.config';
dotenv.config();

describe('Cardano wallet API', function () {
	this.timeout(0);
	let walletServer: WalletServer;

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

	let utxoStats = {
		"distribution": {
			"10000000000000000": 0,
			"100000000000000": 0,
			"1000000000000": 0,
			"10000000000": 0,
			"100000000": 0,
			"1000000": 100,
			"10000": 0,
			"100": 0,
			"1000000000": 0,
			"100000000000": 100,
			"10": 0,
			"45000000000000000": 0,
			"1000": 0,
			"10000000000000": 0,
			"1000000000000000": 0,
			"100000": 0,
			"10000000": 0
		},
		"scale": "log10",
		"total": {
			"quantity": 10000100000000,
			"unit": "lovelace"
		}
	}

	let fee = {
		"estimated_min": {
			"quantity": 130500,
			"unit": "lovelace"
		},
		"deposit": {
			"quantity": 0,
			"unit": "lovelace"
		},
		"minimum_coins": [
			{
				"quantity": 1000000,
				"unit": "lovelace"
			}
		],
		"estimated_max": {
			"quantity": 158700,
			"unit": "lovelace"
		}
	};

	let tx = {
		"status": "pending",
		"withdrawals": [] as any[],
		"amount": {
			"quantity": 1130500,
			"unit": "lovelace"
		},
		"inputs": [
			{
				"amount": {
					"quantity": 12000000,
					"unit": "lovelace",
				},
				"address": "addr1vxlassd5m5z2757zqkj9vsfyqnjpzqa79tfclypa5ltwtgcfsgk0y",
				"id": "d7700008431233698659a03ad6e0fe0baf00dddfc12c03c0a1a6bab42124652e",
				"assets": [] as any[],
				"index": 3,
			},
		],
		"direction": "outgoing",
		"fee": {
			"quantity": 130500,
			"unit": "lovelace"
		},
		"outputs": [
			{
				"amount": {
					"quantity": 1000000,
					"unit": "lovelace"
				},
				"address": "addr1q99d7qnpvw53stx5ppave9n2aarwxar552v55p4xnhjy6me59kkfl90wf7f9vlm99fek6e9l5zh65td8jhw63hn9skqq9hd2f7",
				"assets": [] as any[]
			},
			{
				"amount": {
					"quantity": 10869500,
					"unit": "lovelace"
				},
				"address": "addr1q8s2ev94k83lsctwyzj0kklgzlt02hv75z6cjqtpqxlafpq7vjhxlzaazkhgv47za494arh3lqhz997hat2vveuzlvfse80cay",
				"assets": []
			}
		],
		"expires_at": {
			"time": "2021-04-01T00:14:55Z",
			"epoch_number": 728,
			"absolute_slot_number": 36440,
			"slot_number": 40
		},
		"pending_since": {
			"height": {
				"quantity": 190,
				"unit": "block"
			},
			"time": "2021-03-31T22:14:54.8Z",
			"epoch_number": 8,
			"absolute_slot_number": 439,
			"slot_number": 39
		},
		"metadata": null as any,
		"id": "99ed1d6c8c7f557d1631236e132c0ca73404a9928e47457204816065163cc967",
		"deposit": {
			"quantity": 0,
			"unit": "lovelace"
		},
		"mint": [] as any[]
	};

	let poolMaintenanceAction = {
    "gc_stake_pools": {
        "status": "not_applicable"
    }
	};

	let delegationFee = {
		"estimated_min": {
			"quantity": 125300,
			"unit": "lovelace"
		},
		"deposit": {
			"quantity": 1000000,
			"unit": "lovelace"
		},
		"minimum_coins": [] as any[],
		"estimated_max": {
			"quantity": 139400,
			"unit": "lovelace"
		}
	};

	let afterDelegation = {
		"next": [] as any[],
		"active": {
				"status": "delegating",
				"target": "pool1as50x0wtumtyqzs7tceeh5ry0syh8jnvpnuu9wlxswxuv48sw4w"
		}
	};

	let poolStake = [
		{
			"flags": [] as any[],
			"metrics": {
				"saturation": 0.8769869515692323,
				"non_myopic_member_rewards": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"produced_blocks": {
					"quantity": 286,
					"unit": "block"
				},
				"relative_stake": {
					"quantity": 29.23,
					"unit": "percent"
				}
			},
			"retirement": {
				"epoch_start_time": "2021-07-31T11:51:50Z",
				"epoch_number": 1000000
			},
			"cost": {
				"quantity": 0,
				"unit": "lovelace"
			},
			"margin": {
				"quantity": 10,
				"unit": "percent"
			},
			"pledge": {
				"quantity": 1000000000000,
				"unit": "lovelace"
			},
			"id": "pool1hvg5evmawhaq2fsr9rprtg76u226x0gt5e62t6c78etgu2j7xtn"
		},
		{
			"flags": [] as any[],
			"metrics": {
				"saturation": 0.6474533657431686,
				"non_myopic_member_rewards": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"produced_blocks": {
					"quantity": 298,
					"unit": "block"
				},
				"relative_stake": {
					"quantity": 21.58,
					"unit": "percent"
				}
			},
			"cost": {
				"quantity": 0,
				"unit": "lovelace"
			},
			"margin": {
				"quantity": 10,
				"unit": "percent"
			},
			"pledge": {
				"quantity": 2000000000000,
				"unit": "lovelace"
			},
			"id": "pool1as50x0wtumtyqzs7tceeh5ry0syh8jnvpnuu9wlxswxuv48sw4w"
		},
		{
			"flags": [],
			"metrics": {
				"saturation": 0.8740602172660131,
				"non_myopic_member_rewards": {
					"quantity": 0,
					"unit": "lovelace"
				},
				"produced_blocks": {
					"quantity": 296,
					"unit": "block"
				},
				"relative_stake": {
					"quantity": 29.14,
					"unit": "percent"
				}
			},
			"retirement": {
				"epoch_start_time": "2021-04-18T07:51:50Z",
				"epoch_number": 100000
			},
			"cost": {
				"quantity": 0,
				"unit": "lovelace"
			},
			"margin": {
				"quantity": 10,
				"unit": "percent"
			},
			"pledge": {
				"quantity": 1000000000000,
				"unit": "lovelace"
			},
			"id": "pool1k3tk3sdzmf9az04u4g0229qgak33mnppwewvh4q8ek5ly09nqjm"
		}
	];

	let txRaw = {
    "type": "TxBodyMary",
    "description": "",
    "cborHex": "82a400818258202d7928a59fcba5bf71c40fe6428a301ffda4d2fa681e5357051970436462b89400018282583900c0e88694ab569f42453eb950fb4ec14cb50f4d5d26ac83fdec2c505d818bcebf1df51c84239805b8a330d68fdbc3c047c12bb4c3172cb9391a002b335f825839003d2d9ceb1a47bc1b62b7498ca496b16a7b4bbcc6d97ede81ba8621ebd6d947875fcf4845ef3a5f08dd5522581cf6de7b9c065379cbb3754d1a001e8480021a00029361031a01672b7ef6"
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
	})

	describe('wallet', function () {
		it('should create a wallet', async function () {
			let mnemonic_sentence = Seed.toMnemonicList(Seed.generateRecoveryPhrase());
			let passphrase = 'tangocrypto';
			let name = 'tangocrypto-wallet';

			let wallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_sentence, passphrase);
			expect(wallet.balance.total.quantity).equal(0);
			expect(wallet.balance.available.quantity).equal(0);
			expect(wallet.balance.reward.quantity).equal(0);
			expect(wallet.name).equal(name);
			expect(wallet.id).lengthOf(40);
			expect(wallet.passphrase.last_updated_at).be.a('string');
		});

		it("should resotre a wallet", async function () {
			let w = wallets[wallets.length - 1];

			let wallet = await walletServer.createOrRestoreShelleyWallet(w.name, w.mnemonic_sentence, w.passphrase);
			expect(wallet.id).equal(w.id);
			expect(wallet.name).equal(w.name);
			expect(wallet.passphrase.last_updated_at).be.a('string');
		});

		it("should throw an 'wallet_already_exist' error", async function () {
			let w = wallets[0];

			await expect(walletServer.createOrRestoreShelleyWallet(w.name, w.mnemonic_sentence, w.passphrase)).to.eventually.rejectedWith(Error)
				.and.have.nested.property('response.data.code').equal('wallet_already_exists');
		});

		it("should get a list of wallets", async function () {
			let ls = await walletServer.wallets();
			let ids = ls.map(w => w.id);

			expect(ls.length).least(wallets.length);
			for (let i = 0; i < wallets.length; i++) {
				const id = wallets[i].id;
				expect(ids).include(id);
			}
		});

		it("should get utxo wallet statistics", async function () {
			let w = wallets.find(w => w.id == '868d04759fd222ac776484888d4bcd462d146772');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let statistics = await wallet.getUtxoStatistics();

			expect(statistics).deep.equal(utxoStats)
		});

		it("should get a wallet", async function () {
			let w = wallets.find(w => w.id === '2a793eb367d44a42f658eb02d1004f50c14612fd');

			let wallet = await walletServer.getShelleyWallet(w.id);
			expect(wallet.id).equal(w.id);
			expect(wallet.name).equal(w.name);
			expect(wallet.passphrase.last_updated_at).be.a('string');
		});

		it("shuld remove a wallet", async function () {
			let ls = await walletServer.wallets();
			let wallet = ls.find(w => w.name == 'tangocrypto-wallet');
			await wallet.delete();
			await expect(walletServer.getShelleyWallet(wallet.id)).to.eventually.rejectedWith(Error)
				.and.have.nested.property('response.status').equal(404);
		})

		it("should rename a wallet", async function () {
			let w = wallets.find(w => w.id === '60bb5513e4e262e445cf203db9cf73ba925064d2');
			let name = 'new-name';

			let wallet = await walletServer.getShelleyWallet(w.id);
			wallet = await wallet.rename(name);
			expect(wallet.name).equal(name);

			wallet = await wallet.rename(w.name);
			expect(wallet.name).equal(w.name);
		});

		it("should change a wallet passphrase", async function () {
			let w = wallets.find(w => w.id === '60bb5513e4e262e445cf203db9cf73ba925064d2');
			let newPassphrase = 'new-passphrase';

			let wallet = await walletServer.getShelleyWallet(w.id);
			let lastUpdatedAt = wallet.passphrase.last_updated_at;

			wallet = await wallet.updatePassphrase(w.passphrase, newPassphrase);
			expect(wallet.passphrase.last_updated_at).not.equal(lastUpdatedAt);

			await wallet.updatePassphrase(newPassphrase, w.passphrase);
		});
	});

	describe('address', function () {
		it('should get wallet addresses', async function () {
			let w = wallets.find(w => w.id === '60bb5513e4e262e445cf203db9cf73ba925064d2');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let addresses = await wallet.getAddresses();

			expect(addresses.length).least(20);
		});

		it('should get wallet unused addresses', async function () {
			let w = wallets.find(w => w.id === '60bb5513e4e262e445cf203db9cf73ba925064d2');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let addresses = await wallet.getUnusedAddresses();

			expect(addresses).be.an('array');
			expect(addresses).lengthOf.at.least(wallet.address_pool_gap);
		});

		it('should get wallet used addresses', async function () {
			let w = wallets.find(w => w.id === '60bb5513e4e262e445cf203db9cf73ba925064d2');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let addresses = await wallet.getUsedAddresses();

			expect(addresses).be.an('array');
		});

		it('should get first wallet\'s address external verification key', async function () {
			let id = '2a793eb367d44a42f658eb02d1004f50c14612fd';
			let addr = 'addr_vk1rfx8dy8dh3t04234qu98gcuu9sqenpvzqx506tfwh9c26vd02fwqmx69lx'; // external verification address at 0

			let wallet = await walletServer.getShelleyWallet(id);
			let address = await wallet.getAddressExternalVerificationKey(0);

			expect(address.key).equal(addr);
			expect(address.role).equal(KeyRoleEnum.AddressExternal);
		});

		it('should get first wallet\'s stake verification key', async function () {
			let id = '2a793eb367d44a42f658eb02d1004f50c14612fd';
			let addr = 'stake_vk1jj0une4hu8sjaye6cdw7tft9eynykzk9kccmfadzz4ytcmt9v9hs2k6s7u'; // stake address at 0

			let wallet = await walletServer.getShelleyWallet(id);
			let stake = await wallet.getStakeVerificationKey(0);

			expect(stake).have.property('key').equal(addr);
			expect(stake).have.property('role').equal(KeyRoleEnum.Stake);
		});

		it('should get wallet next unused address', async function () {
			let id = '4ea40ca5323bad2efb77c68ae42e5bb7205ab5e6';
			let addr = 'addr1q99q78gt2898zgu2dcswf2yuxj6vujcqece38rycc7wsncl5lx8y8swrhrt93dt5kykkhtd57gpc0hc8820vh6cy8n6su9tsj8'; // next unused address;

			let wallet = await walletServer.getShelleyWallet(id);
			let addresses = (await wallet.getAddresses()).map(addr => addr.address);
			let address = await wallet.getNextAddress();

			expect(address.address).equal(addr);
			expect(address.used()).equal(false);
			expect(addresses).not.include(address.address);
		});
	});

	describe('stake pool', function () {
		it("should return stake pool ranking list by member rewards", async function () {
			let stake = 1000000000;
			let pools = await walletServer.getStakePools(stake);
			let rewards = pools.map(p => p.metrics.non_myopic_member_rewards.quantity);
			expect(rewards).equal(rewards.sort().reverse());
		});

		it("should return stake pools maintenance actions", async function(){
			let maintenanceActions = await walletServer.stakePoolMaintenanceActions();
			expect(maintenanceActions).deep.equal(poolMaintenanceAction);
		});

		it("should trigger garbage collection", async function(){
			await walletServer.triggerStakePoolGarbageCollection();
		});

		it("should estimate delegation fee", async function(){
			let w = wallets.find(w => w.id == '868d04759fd222ac776484888d4bcd462d146772');
			let wallet = await walletServer.getShelleyWallet(w.id);
			let fee = await wallet.estimateDelegationFee();

			expect(fee).deep.equal(delegationFee);
		});

		it("should delegate to stake pool", async function(){
			let pool = (await walletServer.getStakePools()).find(p => p.id == 'pool1as50x0wtumtyqzs7tceeh5ry0syh8jnvpnuu9wlxswxuv48sw4w');
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let transaction = await wallet.delegate(pool.id, w.passphrase);

			let inputAmount = transaction.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = transaction.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let spent = transaction.amount.quantity; // fee + deposit

			expect(ApiTransactionStatusEnum.Pending).equal(transaction.status);
			expect(ApiTransactionDirectionEnum.Outgoing).equal(transaction.direction);
			expect(outputAmount + spent).equal(inputAmount);

			await waitUntilTxFinish(transaction.id, wallet);
			transaction = await wallet.getTransaction(transaction.id);
			if(transaction.status == ApiTransactionStatusEnum.InLedger) {
				await wallet.refresh();
				if(wallet.delegation.next.length > 0 ) {
					let epoch = wallet.delegation.next.sort((a, b) => -(a.changes_at.epoch_number - b.changes_at.epoch_number)).map(d => d.changes_at.epoch_number)[0];
					await waitUntilEpoch(epoch, walletServer);
					await wallet.refresh();
				}
				let delegation = wallet.getDelegation();
				expect(delegation).deep.equal(afterDelegation);
			}
		});

		it("should withdraw wallet rewards", async function(){
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let addresses = (await wallet.getUsedAddresses()).slice(0, 1);
			let amounts = [wallet.getRewardBalance()];
			let availableBalance = wallet.getAvailableBalance();
			let transaction = await wallet.withdraw(w.passphrase, addresses, amounts);

			let inputAmount = transaction.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = transaction.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let fee = transaction.fee.quantity;

			expect(ApiTransactionStatusEnum.Pending).equal(transaction.status);
			expect(ApiTransactionDirectionEnum.Outgoing).equal(transaction.direction);
			expect(outputAmount + fee).equal(inputAmount);

			await waitUntilTxFinish(transaction.id, wallet);
			transaction = await wallet.getTransaction(transaction.id);
			if(transaction.status == ApiTransactionStatusEnum.InLedger) {
				await wallet.refresh();
				let newAvailableBalance = wallet.getAvailableBalance() + fee;
				expect(availableBalance + amounts[0]).equal(newAvailableBalance);
			}
		});

		it("should stop delegating", async function(){
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let transaction = await wallet.stopDelegation(w.passphrase);

			let inputAmount = transaction.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = transaction.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let amount = transaction.amount.quantity;

			expect(ApiTransactionStatusEnum.Pending).equal(transaction.status);
			expect(ApiTransactionDirectionEnum.Incoming).equal(transaction.direction);
			expect(amount + inputAmount).equal(outputAmount);
			await waitUntilTxFinish(transaction.id, wallet);
			transaction = await wallet.getTransaction(transaction.id);
			if(transaction.status == ApiTransactionStatusEnum.InLedger) {
				await wallet.refresh();
				if(wallet.delegation.next.length > 0 ) {
					let epoch = wallet.delegation.next.sort((a, b) => -(a.changes_at.epoch_number - b.changes_at.epoch_number)).map(d => d.changes_at.epoch_number)[0];
					await waitUntilEpoch(epoch, walletServer);
					await wallet.refresh();
				}
				let delegation = wallet.getDelegation();
				let rewards = wallet.getRewardBalance();
				expect(rewards).equal(0);
				expect(delegation.active.status).equal(WalletsDelegationActiveStatusEnum.NotDelegating);
			}
		});

	});

	describe('transaction', function () {
		let tx: TransactionWallet = null;
		it('should get tx list', async function(){
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');
			let wallet = await walletServer.getShelleyWallet(w.id);
			let start = new Date(2021, 0, 1); // January 1st 2021;
			let end = new Date(Date.now());
			let transactions = await wallet.getTransactions(start, end);
			tx = transactions[0];
			transactions.filter(tx => tx.metadata).forEach(t => {
				let metadata = Seed.reverseMetadata(t.metadata, "array");
				expect(metadata).not.empty;
			})
			expect(transactions).be.an('array');
		});

		it('should get tx details', async function () {
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let transaction = await wallet.getTransaction(tx.id);

			expect(tx.id).equal(transaction.id);
			expect(tx.status).equal(transaction.status);
			expect(tx.direction).equal(transaction.direction);
			expect(tx.depth.unit).equal(transaction.depth.unit);
			expect(tx.fee).deep.equal(transaction.fee);
			expect(tx.deposit).deep.equal(transaction.deposit);
			expect(tx.inputs).deep.equal(transaction.inputs);
			expect(tx.outputs).deep.equal(transaction.outputs);
			expect(tx.mint).deep.equal(transaction.mint);
			expect(tx.amount).deep.equal(transaction.amount);
			expect(tx.withdrawals).deep.equal(transaction.withdrawals);
		});

		it('should get payment fee', async function () {
			let receiver = '9ada973fd29d6b3d096ab361ef5fd082576bdbe3';
			let payeer = '2a793eb367d44a42f658eb02d1004f50c14612fd';

			let rWallet = await walletServer.getShelleyWallet(receiver);
			let addresses = (await rWallet.getUnusedAddresses()).slice(0, 1);
			let amounts = [1000000];

			let wallet = await walletServer.getShelleyWallet(payeer);
			let estimatedFees = await wallet.estimateFee(addresses, amounts);

			expect(estimatedFees).not.undefined;
		});

		it('should send a payment transfer', async function () {
			let receiver = '2a793eb367d44a42f658eb02d1004f50c14612fd';
			let payeer = '60bb5513e4e262e445cf203db9cf73ba925064d2';
			let passphrase = 'shelley-small-coins';

			let rWallet = await walletServer.getShelleyWallet(receiver);
			let addresses = (await rWallet.getUsedAddresses()).slice(0, 1);
			let amounts = [1000000];

			let wallet = await walletServer.getShelleyWallet(payeer);
			let transaction = await wallet.sendPayment(passphrase, addresses, amounts);
			let output = transaction.outputs.find(o => o.address == addresses[0].address);
			let inputAmount = transaction.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = transaction.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let fee = transaction.fee.quantity;
			let spent = output.amount.quantity + fee;
			let paid = amounts.reduce((a, b) => a + b);

			expect(output).to.not.undefined;
			expect(output.amount.quantity).equal(paid);
			expect(spent).equal(transaction.amount.quantity);
			expect(outputAmount + fee).equal(inputAmount);
		});

		it('should send a payment transfer with complex metadata', async function () {
			let receiver = '2a793eb367d44a42f658eb02d1004f50c14612fd';
			let payeer = '60bb5513e4e262e445cf203db9cf73ba925064d2';
			let passphrase = 'shelley-small-coins';

			let rWallet = await walletServer.getShelleyWallet(receiver);
			let addresses = (await rWallet.getUsedAddresses()).slice(0, 1);
			let amounts = [1000000];

			let wallet = await walletServer.getShelleyWallet(payeer);
			let metadata: any = {0: 'hello', 1: Buffer.from('2512a00e9653fe49a44a5886202e24d77eeb998f', 'hex'), 4: [1, 2, {0: true}], 5: {'key': null, 'l': [3, true, {}]}, 6: undefined};
			let transaction = await wallet.sendPayment(passphrase, addresses, amounts, metadata);
			let output = transaction.outputs.find(o => o.address == addresses[0].address);
			let inputAmount = transaction.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = transaction.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let fee = transaction.fee.quantity;
			let spent = output.amount.quantity + fee;
			let paid = amounts.reduce((a, b) => a + b);

			expect(output).to.not.undefined;
			expect(output.amount.quantity).equal(paid);
			expect(spent).equal(transaction.amount.quantity);
			expect(outputAmount + fee).equal(inputAmount);
		});

		it('should get coin selection', async function(){
			let w = wallets.find(w => w.id == '2a793eb367d44a42f658eb02d1004f50c14612fd');
			let receiver = wallets.find(w => w.id == '60bb5513e4e262e445cf203db9cf73ba925064d2');

			let wallet = await walletServer.getShelleyWallet(w.id);
			let addresses = (await (await walletServer.getShelleyWallet(receiver.id)).getUsedAddresses()).slice(0, 1);
			let amounts = [5000000];
			let coins = await wallet.getCoinSelection(addresses, amounts);

			let inputAmount = coins.inputs.map(i => i.amount.quantity).reduce((a, b) => a + b);
			let outputAmount = coins.outputs.map(o => o.amount.quantity).reduce((a, b) => a + b);
			let changeAmount = coins.change.map(c => c.amount.quantity).reduce((a, b) => a + b);
			expect(inputAmount).least(outputAmount + changeAmount);
		});

		it("should send a offline signed payment transaction", async function(){
			let receiver = '2a793eb367d44a42f658eb02d1004f50c14612fd';
			let payeer = wallets.find(w => w.id == "60bb5513e4e262e445cf203db9cf73ba925064d2");
			let wallet = await walletServer.getShelleyWallet(payeer.id);
			let addresses = (await (await walletServer.getShelleyWallet(receiver)).getUnusedAddresses()).slice(0, 1);
			let amounts = [1000000];
			let info = await walletServer.getNetworkInformation();
			let data: any = {0: 'hello', 1: Buffer.from('2512a00e9653fe49a44a5886202e24d77eeb998f', 'hex'), 4: [1, 2, {0: true}], 5: {'key': null, 'l': [3, true, {}]}, 6: undefined};
			let coinSelection = await wallet.getCoinSelection(addresses, amounts, data);

			//build and sign tx
			let rootKey = Seed.deriveRootKey(payeer.mnemonic_sentence); 
			let signingKeys = coinSelection.inputs.map(i => {
				let privateKey = Seed.deriveKey(rootKey, i.derivation_path).to_raw_key();
				return privateKey;
			});

			let metadata = Seed.buildTransactionMetadata(data);
			let txBuild = Seed.buildTransaction(coinSelection, info.node_tip.absolute_slot_number * 12000, {metadata: metadata, config: LocalCluster});
			let txBody = Seed.sign(txBuild, signingKeys, metadata);
			let signed = Buffer.from(txBody.to_bytes()).toString('hex');
			let txId = await walletServer.submitTx(signed);
			expect(txId).not.undefined;
		});

		
	});

});


async function waitUntilTxFinish(txId: string, wallet: ShelleyWallet): Promise<void> {
	return new Promise<void>(async (resolve, reject) => {
		let tx = {status: ApiTransactionStatusEnum.Pending};
		do {
			await delay(1);
			tx = await wallet.getTransaction(txId);
		}while(tx.status == ApiTransactionStatusEnum.Pending)
		resolve();
	})
};

async function waitUntilEpoch(epoch: number, server: WalletServer) {
	return new Promise<void>(async (resolve, reject) => {
		let information = {epoch_number: 0};
		do {
			await delay(1);
			let info = await server.getNetworkInformation();
			information.epoch_number = info.node_tip.epoch_number;
		}while(information.epoch_number < epoch)
		resolve();
	})
}

async function delay(time: number) {
	return new Promise<void>((resolve, reject) => {
		setTimeout(function(){ resolve();}, time*1000);
	});
}