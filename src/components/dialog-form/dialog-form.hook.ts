import { useState } from "react";


export function DialogFormHook() {
    const [visible, setVisible] = useState(false);

    return {
        visible,
        setVisible
    }
}