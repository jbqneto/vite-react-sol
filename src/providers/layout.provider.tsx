import { createContext, useContext, useState } from "react";
import { AlertMessage, AlertMessageType } from "../services/message.observer";

export type ChildrenInput = {
    children: React.ReactElement
}

type ILayoutContext = {
    showMessage: (type: AlertMessageType, msg: string) => void,
    setLoading: (_is: boolean) => void,
    hideMessage: () => void,
    showModal: (show: boolean) => void,
    closedModal: (data: any) => void,
    isModalOpen: boolean,
    isLoading: boolean,
    message: AlertMessage | null,
}

const LayoutContext = createContext<ILayoutContext>({
    showMessage: (type: AlertMessageType, msg: string) => { },
    setLoading: (_is: boolean) => { },
    hideMessage: () => { },
    showModal: (show: boolean) => { },
    closedModal: (data: any) => { },
    isModalOpen: false,
    isLoading: false,
    message: null,
});

const LayoutProvider = ({ children }: ChildrenInput) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<AlertMessage | null>(null);
    const [_showModal, setShowModal] = useState(false);


    const showMessage = (type: AlertMessageType, text: string) => {
        setMessage({ type, message: text });
    }

    const hideMessage = () => {
        setMessage(null);
    }

    const hasMessage = () => {
        return message !== null;
    }

    const isLoading = (_is: boolean) => {
        setLoading(_is);
    }

    const showModal = (show: boolean) => {
        setShowModal(show);
    }

    const closedModal = (data: any) => {
        setShowModal(false);
    }

    const actions = {
        isLoading: loading,
        setLoading: isLoading,
        showMessage,
        hideMessage,
        showModal,
        isModalOpen: _showModal,
        closedModal,
        message: message
    }

    return (
        <LayoutContext.Provider value={actions}>
            {children}
        </LayoutContext.Provider>
    );
};

function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLoader must be used within an LoaderProvider');
    }
    return context;
}


export { LayoutContext, LayoutProvider, useLayout };
