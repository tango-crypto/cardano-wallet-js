import { spawnSync } from 'child_process';

const cliPath = 'cli/cardano-address';
export class Seed {
	static generateRecoveryPhrase(size: number = 15): string {
		const ls = spawnSync(cliPath, ['recovery-phrase', 'generate', '--size', size.toString()], {});
		return new TextDecoder().decode(ls.stdout).replace(/\n/, '');
	}

	static toMnemonicList(phrase: string): Array<string> {
		return phrase.split(/\s+/);
	}
}