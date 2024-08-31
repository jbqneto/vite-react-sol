import { Button } from 'primereact/button';
import { sendSol } from '../../services/send-sol';
import { HeaderMenu } from "../header-menu/header-menu";

export function LayoutComponent() {

    function handleSendSol(evt: any): void {
        evt.preventDefault();

        sendSol(1).then((data) => {
            console.log("ok > ", data);
        }).catch((err) => console.error(err));
    }

    return (
        <div className="content">
            <HeaderMenu></HeaderMenu>
            <main>
                <Button onClick={handleSendSol} label="Send sol" />
            </main>
            <footer></footer>
        </div>
    )
}