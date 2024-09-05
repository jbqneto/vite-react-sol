import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { AlertMessage, messageObserver } from "../../services/message.observer";
import './dialog-message.scss';

export function DialogMessage() {
    const [message, setMessage] = useState<AlertMessage | null>(null);

    useEffect(() => {
        messageObserver.listen().subscribe((msg) => {
            setMessage(msg);
        })
    }), [];

    function clearMessage(event: any): void {
        setMessage(null);
    }

    return (
        <div className="msg-wrapper card flex flex-wrap align-items-center justify-content-center gap-3">
            {message && message.message && <Message onClick={clearMessage} severity={message.type} text={message.message} />}
        </div>
    )
}