import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import { Config } from "../../configuration/config";
import { useLayout } from "../../providers/layout.provider";
import { SolanaService } from "../../services/solana.service";
import './header-menu.scss';

type Input = {
    config: Config
}

const defaultAction = () => {

}

const itemRenderer = (item: any) => (
    <a onClick={item.action ?? defaultAction} className="flex align-items-center p-menuitem-link">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
        {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
);

export function HeaderMenu({ config }: Input) {
    const { publicKey } = useWallet();
    const { showModal, showMessage, setLoading } = useLayout();
    const { connection } = useConnection();
    const [solanas, setSolanas] = useState(0);
    const solService = new SolanaService(config);

    const handleTransfer = async (evt: any) => {
        evt.preventDefault();
        console.log("should show modal")
        showModal(true);
    }

    const handleAskAirdrop = (evt: any) => {
        evt.preventDefault();
        try {
            setLoading(true);

            if (!publicKey) {
                return showMessage(
                    'error',
                    'First select your wallet'
                )
            }

            solService.requestAirdrop(publicKey).then((data) => {
                console.log(`(${publicKey.toBase58()}) Airdrop received `, data);

                setTimeout(() => {
                    loadFinancialData(publicKey);
                }, 1000);

            }).catch((err) => showMessage('error', JSON.stringify(err)));

        } catch (err) {
            const error = typeof err === 'string' ? err : JSON.stringify(err);

            showMessage('error', error);

        } finally {
            setLoading(false);
        }

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
        if (!publicKey || !connection) return;

        console.log("conn: ", connection);

        connection.onAccountChange(
            publicKey,
            updatedAccountInfo => {
                console.log("updated account info", updatedAccountInfo);
                setSolanas(updatedAccountInfo.lamports / LAMPORTS_PER_SOL)
            }
        );

        loadFinancialData(publicKey);

    }, [publicKey, connection])


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
                    Sols: {solanas}
                </div>
            </div>
        </header>
    )
}