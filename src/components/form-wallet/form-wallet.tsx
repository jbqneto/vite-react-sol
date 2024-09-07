import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { InputConfig } from "../../configuration/config"

import './form-wallet.scss'

export type TransactionFormData = {
    recipient: string;
    amount: number;
}

type Input = InputConfig & {
    onFormReady: (ref: MutableRefObject<any>) => void;
    onSubmit: (response: TransactionFormData) => void,
}

export default function InputFormWallet({ onFormReady, onSubmit }: Input) {
    const { connection } = useConnection()
    const { publicKey, wallet } = useWallet();
    const formRef = useRef(null);
    const [error, setError] = useState("");

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        try {

            const form = new FormData(evt.currentTarget);
            const recipient = form.get("recipient");
            const amount = form.get("amount");

            if (!connection || !publicKey || !wallet) {
                throw "Connection or publickey is not available.";
            }

            if (!amount || !recipient) {
                throw 'Inform the receiver address and amount';
            }

            onSubmit({
                amount: parseFloat(amount.toString()),
                recipient: recipient.toString()
            });

        } catch (err) {
            console.warn("Error submiting data: ", { err });
            const error = typeof err === 'string' ? err : 'Error sending transaction';
            setError(error);
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
                {error !== '' && (
                    <p>
                        <span className="error"
                        >
                            {error}
                        </span>
                    </p>

                )}
            </form>

        </div>
    )
}