import { Keypair } from "@solana/web3.js";
import base58 from 'bs58';

//Temporary keypair just for testing on dev/local
const KEY = 'vt_sol_pv_kp';

export class SessionWallet {
    private keypair: Keypair;

    constructor() {
        const pvKey = sessionStorage.getItem(KEY);

        if (pvKey) {
            this.keypair = Keypair.fromSecretKey(base58.decode(pvKey));
        } else {
            this.keypair = Keypair.generate();
            sessionStorage.setItem(KEY, base58.encode(this.keypair.secretKey));
        }
    }

    public getKeyPair() {
        return this.keypair;
    }

    public getPrivateKey() {
        return this.keypair.secretKey;
    }

    public getPublicKey() {
        return this.keypair.publicKey;
    }
}