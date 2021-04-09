import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { CoinSelectionWallet } from './wallet/coin-selection-wallet';

const cardano_address_cmd = 'cardano-address';
const cardano_cli_cmd = 'cardano-cli';
export class Seed {
	static generateRecoveryPhrase(size: number = 15): string {
		const ls = spawnSync(cardano_address_cmd, ['recovery-phrase', 'generate', '--size', size.toString()], {});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static toMnemonicList(phrase: string): Array<string> {
		return phrase.split(/\s+/);
	}

	static rootKeyFromRecoveryPhrase(phrase: string | string[]): string {
		let input = Array.isArray(phrase) ? phrase.join(" ") : phrase;
		const ls = spawnSync(cardano_address_cmd, ['key', 'from-recovery-phrase', 'Shelley'], {input: input});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static derivePrivateKey(parent: string, path: string): string {
		const ls = spawnSync(cardano_address_cmd, ['key', 'child',  path], {input: parent});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static convertPrivateKeyToSigningKey(key: string): any {
		let now = (new Date()).getTime();
		let acct_prv = `/tmp/acct-${now}.prv`;
		let acct_skey = `/tmp/acct-${now}.skey`;
		fs.writeFileSync(acct_prv, key);
		let ls = spawnSync(cardano_cli_cmd, ['key', 'convert-cardano-address-key', '--shelley-payment-key', '--signing-key-file', acct_prv, '--out-file', acct_skey], {});
		ls = spawnSync('cat', [acct_skey], {});
		let result = JSON.parse(new TextDecoder().decode(ls.stdout).replace(/\n/, ''));
		spawnSync('rm', ['-r', acct_prv, acct_skey]);
		return result;
	}
	
	static buildTransaction(coinSelection: CoinSelectionWallet, fee: number, ttl: number): any {
		let args = ['transaction', 'build-raw'];
		let inputs = coinSelection.inputs.map(i => `${i.id}#${i.index}`);
		let outpust = coinSelection.change.map(c => `${c.address}+${c.amount.quantity}`)
		.concat(coinSelection.outputs.map(o => `${o.address}+${o.amount.quantity}`));
		args.push(...Array(inputs.length).fill('--tx-in').map((a, i) => [a, inputs[i]]).flat());
		args.push(...Array(outpust.length).fill('--tx-out').map((a, i) => [a, outpust[i]]).flat());
		args.push(...['--fee', fee.toString(), '--ttl', ttl.toString()]);
		let now = (new Date()).getTime();
		let path = `/tmp/tx-${now}.raw`;
		args.push(...['--out-file', path]);

		let ls = spawnSync(cardano_cli_cmd, args, {});
		ls = spawnSync('cat', [path], {});
		let result = JSON.parse(new TextDecoder().decode(ls.stdout).replace(/\n/, ''));
		spawnSync('rm', ['-r', path]);
		return result;
	}

	static sign(tx: any, keys: any[], network = '--mainnet', magic = ''): any {	
		let now = (new Date()).getTime();
		let path = `/tmp/tx-${now}.raw`;
		let signed = `/tmp/tx-${now}.signed`;
		fs.writeFileSync(path, JSON.stringify(tx));
		let signingKeys: string[] = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let acct_skey = `/tmp/acct-${now}-${i}.skey`;
			signingKeys.push(acct_skey);
			fs.writeFileSync(acct_skey, JSON.stringify(key));
		}
		let args = ['transaction', 'sign', '--tx-body-file', path];
		args.push(...Array(signingKeys.length).fill('--signing-key-file').map((f, i)=> [f, signingKeys[i]]).flat());
		args.push(network);
		if(magic) {
			args.push(magic);
		}
		args.push(...['--out-file', signed]);
		let ls = spawnSync(cardano_cli_cmd, args, {});
		ls = spawnSync('cat', [signed], {});

		let result = JSON.parse(new TextDecoder().decode(ls.stdout).replace(/\n/, ''));
		for (let i = 0; i < signingKeys.length; i++) {
			const keyPath = signingKeys[i];
			spawnSync('rm', ['-r', keyPath]);
		}
		spawnSync('rm', ['-r', path, signed]);

		return result;		
	}
}