import { ethers } from 'ethers';
import React, { ReactNode } from 'react';
import Web3 from 'web3';
import Context from './context';

export default function Web3Provider(props: Props) {
  return (
    <Context.Provider value={new Web3(process.env.REACT_APP_JSON_RPC_URL!)}>
      {props.children}
    </Context.Provider>
  )
}

Web3Provider.Context = Context;

type Props = {
  children: ReactNode;
};
