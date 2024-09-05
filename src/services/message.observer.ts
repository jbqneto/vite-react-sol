import { Observable, Subject } from "rxjs";

export type AlertMessage = {
    type: 'info' | 'success' | 'error'
    message: string;
}

class MessageObserver {
    private obs$ = new Subject<AlertMessage>();

    public sendError(error: any) {
        let message;

        console.log("snedError: " + typeof error, error);

        if (typeof error === 'string') {
            message = error;
        } else if (typeof error === 'object') {
            if (error.message) {
                message = error.message;
            } else {
                message = JSON.stringify(error);
            }
        } else {
            message = error;
        }

        this.sendMessage({
            type: 'error',
            message
        })
    }

    public sendMessage(msg: AlertMessage) {
        this.obs$.next(msg);
    }

    public listen(): Observable<AlertMessage> {
        return this.obs$.asObservable();
    }
}

export const messageObserver = new MessageObserver();