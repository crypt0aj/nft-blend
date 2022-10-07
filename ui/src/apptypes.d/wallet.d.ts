import Web3 from "web3";
import ethers from 'ethers';
import { BaseProvider } from '@metamask/providers';
import { NftBlend } from "../lib/contractAPI";

export type Wallet = {
    address: string,
    web3: Web3,
    web3provider: ethers.providers.Web3Provider,
    nativeProvider: BaseProvider,
    nftBlendAPI: NftBlend,
};
