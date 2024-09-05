import { Keypair, PublicKey } from "@solana/web3.js";
import { Config } from "./config";
import { SessionWallet } from "./wallet";


export abstract class BaseConfig implements Config {

    private wallet: SessionWallet;

    abstract getUrl(): string;

    constructor() {
        this.wallet = new SessionWallet();
    }

    getKeyPair(): Keypair {
        return this.wallet.getKeyPair();
    }

    get environment(): string {
        return import.meta.env.MODE;
    }

    getPublicKey(): PublicKey {
        return this.wallet.getPublicKey();
    }
    getPrivateKey(): Uint8Array {
        return this.wallet.getPrivateKey();
    }

}