import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MutableRefObject, useState } from "react";
import { InputConfig } from "../../configuration/config";
import { useLayout } from "../../providers/layout.provider";
import InputFormWallet from "../form-wallet/form-wallet";

export function DialogForm({ config }: InputConfig) {
    const { showModal, isModalOpen } = useLayout();
    const [formRef, setFormRef] = useState<MutableRefObject<any> | null>(null);

    const handleDialogClose = () => {
        showModal(false);
    }

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

    const onSubmit = (res: string) => {
        console.log("res: ", res);

        showModal(false);
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
