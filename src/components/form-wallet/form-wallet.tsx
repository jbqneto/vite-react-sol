import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { InputConfig } from "../../configuration/config"
import { SolanaService } from "../../services/solana.service"

import { useLayout } from "../../providers/layout.provider"
import './form-wallet.scss'

type FormSubmit = {
    toPubKey: PublicKey;
    amount: number;
}

type Input = InputConfig & {
    onFormReady: (ref: MutableRefObject<any>) => void;
    onSubmit: (response: any) => void,
}

export default function InputFormWallet({ config, onFormReady, onSubmit }: Input) {
    const { connection } = useConnection()
    const { publicKey, wallet } = useWallet();
    const formRef = useRef(null);
    const { setLoading, showMessage } = useLayout();

    const [transactionLink, setTransactionLink] = useState<string>("")
    const solService = new SolanaService(config);

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        console.log({ target: evt.currentTarget });

        const form = new FormData(evt.currentTarget);
        const recipientData = form.get("recipient");
        const amountData = form.get("amount");

        if (!connection || !publicKey || !wallet) {
            console.error("Connection or publickey is not available.")
            return;
        }

        if (!amountData || !recipientData) {
            showMessage('error', 'Inform the receiver address and amount');
            return;
        }

        const recipient = recipientData.valueOf().toString();
        const amount = recipient.valueOf().toString();

        try {
            const receiver = new PublicKey(recipientData)
            const res = await solService.makeTransfer(wallet.adapter, publicKey, receiver, parseFloat(amountData))

            setTransactionLink(res.exporerUrl);
            onSubmit(res);

        } catch (error) {
            console.error("Transaction failed:", error)
        }
    }

    useEffect(() => {
        if (formRef !== null) {
            onFormReady(formRef);
        }
    }, [formRef]);

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmit} className="form">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-wallet"></i>
                    </span>
                    <InputText name="recipient" id="recipient" className={`amount`} placeholder="Receiver Address" />
                </div>
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">$</span>
                    <InputNumber name="amount" minFractionDigits={2} maxFractionDigits={5} placeholder="Sol amount" />
                    <span className="p-inputgroup-addon">Sol</span>
                </div>
                {transactionLink && (
                    <a
                        href={transactionLink}
                        target="_blank"
                        className={"transaction-link"}
                    >
                        Check transaction at Solana Explorer
                    </a>

                )}
            </form>

        </div>
    )
}