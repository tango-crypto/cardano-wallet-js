#!/usr/bin/env node

const { execSync } = require('child_process'); 
execSync('mkdir -p tmp/cardano-address', {stdio: 'inherit'});
execSync('cd tmp/cardano-address && curl -L https://github.com/input-output-hk/cardano-addresses/releases/download/3.2.0/cardano-addresses-3.2.0-linux64.tar.gz -o cardano-addresses-3.2.0-linux64.tar.gz && tar -xf cardano-addresses-3.2.0-linux64.tar.gz', {stdio: 'inherit'});
execSync('cp tmp/cardano-address/bin/* cli/', {stdio: 'inherit'});
execSync('chmod +x cli/*');
execSync('rm -rf tmp/cardano-address', {stdio: 'inherit'});