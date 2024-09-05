import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import { Config } from "../../configuration/config";
import { messageObserver } from "../../services/message.observer";
import { SolanaService } from "../../services/solana.service";
import './header-menu.scss';

type Input = {
    config: Config
}

const defaultAction = (evt: any) => {

}

const itemRenderer = (item: any) => (
    <a onClick={item.action ?? defaultAction} className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
);

export function HeaderMenu({ config }: Input) {
    const { publicKey, wallet } = useWallet();
    const [solanas, setSolanas] = useState(0);
    const solService = new SolanaService(config);

    const handleTransfer = async (evt: any) => {
        evt.preventDefault();

        if (publicKey && wallet?.adapter) {
            const transaction = await solService.makeTransfer(wallet.adapter, publicKey, config.getPublicKey(), 1);

            console.log("transaction: ", transaction);
        }

    }

    const handleAskAirdrop = (evt: any) => {
        evt.preventDefault();

        if (!publicKey) {
            return messageObserver.sendMessage({
                type: 'error',
                message: 'First select your wallet'
            })
        }

        solService.requestAirdrop(publicKey).then((data) => {
            console.log(`(${publicKey.toBase58()}) Airdrop received `, data);
            loadFinancialData(publicKey);
        }).catch((err) => messageObserver.sendError(err));
    };

    const items = [
        {
            label: 'Ask for airdrop',
            icon: 'pi pi-dollar',
            action: handleAskAirdrop,
            template: itemRenderer
        },
        {
            label: 'Make a transfer',
            icon: 'pi pi-receipt',
            action: handleTransfer,
            template: itemRenderer
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            items: [
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil'
                },
                {
                    label: 'Templates',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Apollo',
                            icon: 'pi pi-palette'
                        },
                        {
                            label: 'Ultima',
                            icon: 'pi pi-palette'
                        }
                    ]
                }
            ]
        }
    ];

    const loadFinancialData = async (pubKey: PublicKey) => {
        const sol = await solService.getSolBalance(pubKey);

        setSolanas(sol);
    }

    useEffect(() => {

        if (publicKey)
            loadFinancialData(publicKey);

    }, [publicKey])


    return (
        <header>
            <div className="upper">
                <Menubar className="menu" model={items} />
                <div className="wallet">
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div>
            </div>
            <div className="down">
                <div className="extra">
                </div>
                <div className="balance">
                    SOls: {solanas}
                </div>
            </div>
        </header>
    )
}