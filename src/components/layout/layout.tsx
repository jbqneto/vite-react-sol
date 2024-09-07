import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { Config } from '../../configuration/config';
import { useLayout } from '../../providers/layout.provider';
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

const MIN_AMOUNT = 0.1;

export function LayoutComponent({ config }: Input) {
    const [programWallet, setWallet] = useState<SessionWallet | null>(null)
    const { connection } = useConnection();
    const { publicKey, wallet } = useWallet();
    const { showMessage, setLoading } = useLayout();

    const solService = new SolanaService(config);

    const getTokensBalance = async (pubKey: PublicKey) => {
        console.log("wallet tokens", publicKey?.toBase58());
        const info = await solService.getAccountInfo(pubKey);

        console.log("info: ", info);

        return await solService.getSolBalance(pubKey);
    }

    const loadProgramWallet = (pubKey: PublicKey) => {
        getTokensBalance(pubKey)
            .then((data) => {
                setWallet({
                    pubKey: config.getPublicKey(),
                    amount: data
                });
            }).catch((err) => console.warn(err))

    }

    const updateProgramWalletBalance = (lamports: number) => {
        setWallet({
            pubKey: config.getPublicKey(),
            amount: lamports / LAMPORTS_PER_SOL
        });
    }

    useEffect(() => {
        const pubKey = config.getPublicKey();

        if (!pubKey) return;

        loadProgramWallet(pubKey);

    }, [config]);

    useEffect(() => {
        const wallet = config.getPublicKey();

        if (!wallet) return;

        connection.onAccountChange(
            wallet,
            updatedAccountInfo => {
                console.log("updated Info: ", updatedAccountInfo)
                updateProgramWalletBalance(updatedAccountInfo.lamports);
            }
        );

    }, [connection])

    const handleCopyAddress = (pubKey: NonNullable<PublicKey>) => {
        navigator.clipboard.writeText(pubKey.toBase58());

        showMessage('info', 'Address copied to clipboard')
    }

    const formatWallet = (pubKey: NonNullable<PublicKey>): string => {
        const addr = pubKey.toBase58().toString();

        return addr.substring(0, 4) + '...' + addr.substring(38);
    }

    async function handleReturnSol(event: any): Promise<void> {
        if (!publicKey || !programWallet) return;

        setLoading(true);

        try {

            const walletAmount = programWallet.amount;

            if (walletAmount < MIN_AMOUNT)
                throw "Your wallet must have at least " + MIN_AMOUNT;

            let amount = walletAmount - (MIN_AMOUNT);

            const res = await solService.transferFromPrivateWallet(publicKey, amount);

            window.navigator.clipboard.writeText(res.explorerUrl);

        } catch (error) {
            showMessage('error', JSON.stringify(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="content">
            {config && <HeaderMenu config={config} ></HeaderMenu>}
            <main>
                {programWallet && (
                    <Card className="upper card">
                        <span className='info' onClick={() => handleCopyAddress(programWallet.pubKey)}>
                            Env: {config.environment} ({config.getUrl()})
                            <br />
                            Your Site wallet: {formatWallet(programWallet.pubKey)}
                            <br />
                            Sols: {programWallet.amount}
                        </span>
                        <Button onClick={handleReturnSol} label='Return sol' />
                    </Card>
                )}
            </main>
            <footer></footer>
            <DialogMessage />
            <Loading />
            <DialogForm config={config} />
        </div>
    )
}