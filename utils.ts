import { spawnSync } from 'child_process';
import * as fs from 'fs';

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
	
}