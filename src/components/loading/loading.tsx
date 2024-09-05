import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";
import { loadObserver } from "../../services/loading.observer";

import './loading.scss';

export function Loading() {
    const [isLoading, setLoading] = useState(false);

    loadObserver.observe().subscribe((data) => {
        setLoading(data);
    });

    return (
        <>
            {isLoading && (
                <div className="load-wrapper">
                    <div className="spinner">
                        <ProgressSpinner />
                    </div>
                </div>
            )}
        </>
    )
}