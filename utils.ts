import { spawnSync } from 'child_process';

const command = 'cardano-address';
export class Seed {
	static generateRecoveryPhrase(size: number = 15): string {
		const ls = spawnSync(command, ['recovery-phrase', 'generate', '--size', size.toString()], {});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static toMnemonicList(phrase: string): Array<string> {
		return phrase.split(/\s+/);
	}
}