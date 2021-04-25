import { spawnSync } from 'child_process';
import * as path from 'path';

export const getCommand = function(command: string): string {
	const ls = spawnSync(command, ['--version'], {});
	if (ls.stdout) {
		return command;
	} 
	else {
		const binPath = spawnSync('npm', ['bin'], {}).stdout.toString().replace(/\n/, '');
		return path.join(binPath, command);
	}
}