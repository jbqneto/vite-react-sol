import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import { Config } from '../../configuration/config';
import { SolanaService } from '../../services/solana.service';
import { DialogMessage } from '../dialog-message/dialog-message';
import { HeaderMenu } from "../header-menu/header-menu";
import { Loading } from '../loading/loading';
import './layout.scss';

type Input = {
    config: Config;
}

export function LayoutComponent({ config }: Input) {
    const { publicKey } = useWallet();

    const solService = new SolanaService(config);

    const getTokensBalance = async (pubKey: PublicKey) => {
        console.log("wallet tokens", publicKey?.toBase58());
        const info = await solService.getAccountInfo(pubKey);

        console.log("info: ", info);

        const sol = await solService.getSolBalance(pubKey);

        console.log("SOL: " + sol);
    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (!publicKey) return;

        if (publicKey) {
            getTokensBalance(publicKey).catch((err) => console.error(err));
        }

    }, [publicKey])

    return (
        <div className="content">
            {config && <HeaderMenu config={config} ></HeaderMenu>}
            <main>
                this is the main
            </main>
            <footer></footer>
            <DialogMessage />
            <Loading />
        </div>
    )
}