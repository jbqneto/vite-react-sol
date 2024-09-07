import { Message } from "primereact/message";
import { useLayout } from "../../providers/layout.provider";
import './dialog-message.scss';

export function DialogMessage() {
    const { message, hideMessage } = useLayout();

    function clearMessage(): void {
        if (typeof message?.action === 'function') {
            message.action();
        }

        hideMessage();
    }

    return (
        <div className="msg-wrapper card flex flex-wrap align-items-center justify-content-center gap-3">
            {message && message.message && <Message onClick={clearMessage} severity={message.type} text={message.message} />}
        </div>
    )
}