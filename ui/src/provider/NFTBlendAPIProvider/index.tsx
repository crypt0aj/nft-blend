import { ethers } from 'ethers';
import React, { ReactNode } from 'react';
import Web3 from 'web3';
import { NftBlend } from '../../lib/contractAPI';
import Context from './context';

export default function NFTBlendAPIProvider(props: Props) {
  return (
    <Context.Provider value={new NftBlend(
      new ethers.providers.JsonRpcProvider(process.env.REACT_APP_JSON_RPC_URL, {
        name: 'Cronos Testnet',
        chainId: 338,
      }),
      process.env.REACT_APP_CONTRACT_ADDRESS!,
    )}>
      {props.children}
    </Context.Provider>
  )
}

NFTBlendAPIProvider.Context = Context;

type Props = {
  children: ReactNode;
};
