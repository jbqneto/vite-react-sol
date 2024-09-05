import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { PrimeReactProvider } from 'primereact/api';
import { useMemo } from 'react';
import './App.css';
import { LayoutComponent } from './components/layout/layout';

import '@solana/wallet-adapter-react-ui/styles.css';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Config } from './configuration/config';
import { DevConfig } from './configuration/config.dev';
import { ProdConfig } from './configuration/config.prod';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  let config: Config;

  if (import.meta.env.PROD) {
    config = new ProdConfig();
  } else {
    config = new DevConfig();
  }

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <PrimeReactProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <LayoutComponent config={config}></LayoutComponent>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </PrimeReactProvider>
  );
}

export default App
