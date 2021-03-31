# cardano-wallet-js
cardano-wallet javascript/typescript client


# Test
Stack
you'll need to install stak >= 1.9.3
you can find it here: https://docs.haskellstack.org/en/stable/README/
You may need to install the libsodium-dev, libghc-hsopenssl-dev, gmp, sqlite and systemd development libraries for the build to succeed.

The setup steps are quite simple:
clone: `cardano-wallet`
execute: `stack install cardano-wallet:exe:local-cluster`
Set a specific port `export CARDANO_WALLET_PORT=7355` so the wallet always start at the same port.
run `~/.local/bin/local-cluster`
