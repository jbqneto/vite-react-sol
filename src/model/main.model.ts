
export type AlertMessageType = 'info' | 'success' | 'error';

export type AlertMessage = {
    type: AlertMessageType;
    message: string;
    action?: () => void;
}
