import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MutableRefObject, useState } from "react";
import { InputConfig } from "../../configuration/config";
import { useLayout } from "../../providers/layout.provider";
import { SolanaService } from "../../services/solana.service";
import InputFormWallet, { TransactionFormData } from "../form-wallet/form-wallet";

export function DialogForm({ config }: InputConfig) {
    const { publicKey, wallet } = useWallet();
    const { showModal, isModalOpen, showMessage, setLoading } = useLayout();
    const [formRef, setFormRef] = useState<MutableRefObject<any> | null>(null);
    const solService = new SolanaService(config);

    const onCancelClick = (evt: any) => {
        evt.preventDefault();

        showModal(false);
    }

    const onSendClick = (evt: any) => {
        evt.preventDefault();

        if (formRef) {
            formRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
            );
        }
    }

    const openTransactionSite = (url: string) => {
        navigator.clipboard.writeText(url);

        return () => {
            navigator.clipboard.writeText(url);
            window.open(url, '_blank');
        }
    }

    const onSubmit = async (res: TransactionFormData) => {
        console.log("res from modal: ", res);
        if (!res || !wallet || !publicKey) return;

        try {
            showModal(false);
            setLoading(true);

            const receiver = new PublicKey(res.recipient)
            const transaction = await solService.makeTransfer(wallet.adapter, publicKey, receiver, res.amount)

            showMessage('success', 'Transaction done successfully: ', openTransactionSite(transaction.explorerUrl));

        } catch (err) {
            const error = typeof err === 'string' ? err : 'Error on transaction';

            console.warn("Error on transaction: ", JSON.stringify({ err }));
            showMessage('error', error);
        } finally {
            setLoading(false);
        }

    }

    const onFormInit = (ref: MutableRefObject<any>) => {
        setFormRef(ref);
    }

    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={onCancelClick} className="p-button-text" />
            <Button label="Send" icon="pi pi-check" onClick={onSendClick} autoFocus />
        </div>
    );

    return (
        <Dialog header="Header" visible={isModalOpen} style={{ width: '50vw' }} onHide={() => showModal(false)} footer={footerContent}>
            <InputFormWallet onFormReady={onFormInit} onSubmit={onSubmit} config={config} />
        </Dialog>
    )
}
