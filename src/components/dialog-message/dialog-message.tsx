import { Message } from "primereact/message";
import { useEffect } from "react";
import { useLayout } from "../../providers/layout.provider";
import { messageObserver } from "../../services/message.observer";
import './dialog-message.scss';

export function DialogMessage() {
    const { message, showMessage, hideMessage } = useLayout();

    useEffect(() => {
        messageObserver.listen().subscribe((msg) => {
            if (msg) {
                showMessage(msg.type, msg.message);
            } else {
                hideMessage();
            }
        })
    }), [];

    function clearMessage(event: any): void {
        hideMessage();
    }

    return (
        <div className="msg-wrapper card flex flex-wrap align-items-center justify-content-center gap-3">
            {message && message.message && <Message onClick={clearMessage} severity={message.type} text={message.message} />}
        </div>
    )
}