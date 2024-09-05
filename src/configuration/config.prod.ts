import { BaseConfig } from "./config.base";

export class ProdConfig extends BaseConfig {
    getUrl(): string {
        return import.meta.env.SOLANA_URL;
    }

}