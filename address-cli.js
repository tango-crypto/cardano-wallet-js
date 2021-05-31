#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
if (os.platform() !== 'win32') {
    execSync('mkdir -p tmp-cardano-address');
    execSync('cd tmp-cardano-address && curl -L https://github.com/input-output-hk/cardano-addresses/releases/download/3.4.0/cardano-addresses-3.4.0-linux64.tar.gz -o cardano-addresses-3.4.0-linux64.tar.gz && tar -xf cardano-addresses-3.4.0-linux64.tar.gz', { stdio: 'inherit' });
    execSync('cp tmp-cardano-address/bin/* cli/');
		execSync('ln -s ../cardano-wallet-js/cli/cardano-address node_modules/.bin/cardano-address')
    execSync('chmod +x cli/*');
    execSync('rm -rf tmp-cardano-address');
} else {
	execSync('mkdir tmp-cardano-address');
	execSync('cd tmp-cardano-address && curl -L https://github.com/input-output-hk/cardano-addresses/releases/download/3.4.0/cardano-addresses-3.4.0-win64.zip -o cardano-addresses-3.4.0-win64.zip && tar -xf cardano-addresses-3.4.0-win64.zip', { stdio: 'inherit' });
	execSync('copy tmp-cardano-address\\cardano-address.exe cli');
	execSync('echo @ECHO off> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo SETLOCAL>> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo CALL :find_dp0>> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo ^"%dp0%\\node_modules\\cardano-wallet-js\\cli\\cardano-address.exe^"   %*>> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo ENDLOCAL>> node_modules\\.bin\\cardano-address.cmd');
	execSync(`echo EXIT /b ^%errorlevel^%>> node_modules\\.bin\\cardano-address.cmd`);
	execSync('echo :find_dp0>> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo SET dp0=%~dp0>> node_modules\\.bin\\cardano-address.cmd');
	execSync('echo EXIT /b>> node_modules\\.bin\\cardano-address.cmd');
	execSync('rmdir /s /q tmp-cardano-address');
}