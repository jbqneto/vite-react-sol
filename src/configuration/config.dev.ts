import { clusterApiUrl } from "@solana/web3.js";
import { BaseConfig } from "./config.base";


export class DevConfig extends BaseConfig {
    getUrl(): string {
        return clusterApiUrl("devnet");
    }

}