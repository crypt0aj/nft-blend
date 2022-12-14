import React, { ReactNode } from 'react';
import Web3Modal, { IProviderOptions } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { DeFiWeb3Connector } from "deficonnect";
import { useState, useEffect } from 'react';
import Context from './context';

export default function Web3ModalProvider(props: Props) {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

  useEffect(() => {
    const providerOptions: IProviderOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            // 1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
            25: "https://evm.cronos.org/",
            338: "https://evm-t3.cronos.org/"
          },
          chainId: 338,
        }
      },
      // 'custom-deficonnect': {
      //   display: {
      //     logo:
      //       "data:image/gif;base64,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",
      //     name: "Defi Wallet",
      //     description: "Connect to your Defi Wallet account"
      //   },
      //   package: DeFiWeb3Connector,
      //   options: {
      //     supportedChainIds: [338],
      //     rpc: {
      //       // 1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
      //       // 25: "https://evm.cronos.org/",
      //       338: "https://evm-t3.cronos.org/"
      //     },
      //     chainId: 338,
      //     pollingInterval: 15000
      //   },
      //   connector: async (ProviderPackage, options) => {
      //     try {
      //       const connector = new ProviderPackage(options);
      //       await connector.enable();
      //       await connector.activate();
      //       return connector;
      //     } catch (err) {
      //       console.error(48, err);
      //     }
      //   }
      // },
    };

    setWeb3Modal(new Web3Modal({
      cacheProvider: true,
      providerOptions,
    }));
  }, []);

  return (
    <Context.Provider value={web3Modal}>
      {props.children}
    </Context.Provider>
  )
}

Web3ModalProvider.Context = Context;

type Props = {
  children: ReactNode,
};
