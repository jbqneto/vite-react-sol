import { Keypair, PublicKey } from "@solana/web3.js";

export type InputConfig = {
    config: Config
}

export interface Config {
    getUrl(): string;
    get environment(): string;
    getKeyPair(): Keypair;
    getPublicKey(): PublicKey;
    getPrivateKey(): Uint8Array;
}