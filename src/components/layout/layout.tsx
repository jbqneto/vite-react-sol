import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Config } from '../../configuration/config';
import { SolanaService } from '../../services/solana.service';
import { DialogForm } from '../dialog-form/dialog-form';
import { DialogMessage } from '../dialog-message/dialog-message';
import { HeaderMenu } from "../header-menu/header-menu";
import { Loading } from '../loading/loading';
import './layout.scss';

type Input = {
    config: Config;
}

type SessionWallet = {
    pubKey: PublicKey,
    amount: number
}

export function LayoutComponent({ config }: Input) {
    const [sessionWallet, setSessionWallet] = useState<SessionWallet | null>(null)
    const { publicKey } = useWallet();

    const solService = new SolanaService(config);

    const getTokensBalance = async (pubKey: PublicKey) => {
        console.log("wallet tokens", publicKey?.toBase58());
        const info = await solService.getAccountInfo(pubKey);

        console.log("info: ", info);

        return await solService.getSolBalance(pubKey);
    }

    useEffect(() => {
        const pubKey = config.getPublicKey();

        if (!pubKey) return;

        getTokensBalance(pubKey)
            .then((data) => {
                setSessionWallet({
                    pubKey: config.getPublicKey(),
                    amount: data
                });
            }).catch((err) => console.warn(err))

    }, [config])

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
                {sessionWallet && (
                    <div className="upper">
                        Your Site wallet: {sessionWallet.pubKey.toBase58()}
                        <br />
                        Amount: {sessionWallet.amount}
                    </div>
                )}
            </main>
            <footer></footer>
            <DialogMessage />
            <Loading />
            <DialogForm config={config} />
        </div>
    )
}