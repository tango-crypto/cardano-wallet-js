import { NativeScript } from "@emurgo/cardano-serialization-lib-nodejs";
import { Bip32KeyPair } from "./bip32-keypair.model";

export interface Script {
    root?: NativeScript;
    scripts: Script[];
    keyHash?: string;
    keyPair?: Bip32KeyPair; 
    slot?: number;
    
}