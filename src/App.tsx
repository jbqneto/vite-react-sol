import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect, useMemo } from 'react';
import './App.css';
import { LayoutComponent } from './components/layout/layout';

import '@solana/wallet-adapter-react-ui/styles.css';
import 'primeicons/primeicons.css';
import { Config } from './configuration/config';
import { DevConfig } from './configuration/config.dev';
import { LayoutProvider } from './providers/layout.provider';
import { configObserver } from './services/config.observer';

import "primereact/resources/themes/lara-dark-teal/theme.css";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  let config: Config;

  //TODO: IN the future be able to change this on PROD
  if (import.meta.env.PROD) {
    config = new DevConfig();
  } else {
    config = new DevConfig();
  }

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => config.getUrl(), [network]);

  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  useEffect(() => {

    configObserver.onEnvChange().subscribe((env) => {
      console.log(`(${network}) Env change is not yet implemented: ${env}`);
    });

  }, [])

  return (
    <PrimeReactProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <LayoutProvider>
              <LayoutComponent config={config}></LayoutComponent>
            </LayoutProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </PrimeReactProvider>
  );
}

export default App
