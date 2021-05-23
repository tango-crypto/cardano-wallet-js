import { spawnSync } from 'child_process';
import * as path from 'path';

export const getCommand = function(command: string, options = {}): string {
	const ls = spawnSync(command, ['--version'], options);
	if ((ls.stdout && ls.stdout.toString()) && (!ls.stderr || !ls.stderr.toString())) {
		return command;
	} 
	else {
		const binPath = spawnSync('npm', ['bin'], options).stdout.toString().replace(/\n/, '');
		return path.join(binPath, command);
	}
}