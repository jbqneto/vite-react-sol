import { ProgressSpinner } from "primereact/progressspinner";

import { useLayout } from "../../providers/layout.provider";
import './loading.scss';

export function Loading() {
    const { isLoading } = useLayout();

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