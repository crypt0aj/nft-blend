import { Network, Alchemy, AlchemySettings } from 'alchemy-sdk';
import {ethers} from "ethers";
import { AvatarResolver} from '@ensdomains/ens-avatar';

const alchemySettings: AlchemySettings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const etherscanAPIKey = process.env.REACT_APP_ETHERSCAN_API_KEY;

const alchemy = new Alchemy(alchemySettings);
const provider = new ethers.providers.AlchemyProvider("homestead",alchemySettings.apiKey);

const getAddressList = async(wallet: string): Promise<string[]> => {
  const API = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanAPIKey}`
  const response = await (await fetch(API)).json()
  const addressList: string[] = response.result.map((tx: EtherscanTx): string =>{
    if(tx.from !== wallet && tx.from !== ""){
      return tx.from;
    } else {
      return tx.to;
    }
  })
  
  return Array.from(new Set(addressList).values());
}

type EtherscanTx = {
    from: string,
    to: string,
};

export const generateScore = async(wallet1: string, wallet2: string): Promise<number> => {
  // Get all NFTs
  const nft1 = await alchemy.nft.getNftsForOwner(wallet1);
  const nft2 = await alchemy.nft.getNftsForOwner(wallet2);
  const contracts1 = nft1.ownedNfts.map(nft => nft.contract.address)
  const contracts2 = nft2.ownedNfts.map(nft => nft.contract.address)
  const commonNfts = contracts1.filter(value => contracts2.includes(value));

  // Get token balances
  const balances1 = await alchemy.core.getTokenBalances(wallet1);
  const balances2 = await alchemy.core.getTokenBalances(wallet2);
  const b1 = balances1.tokenBalances.map((token) => {
    if (token.tokenBalance !== "0")
      return token.contractAddress
  })
  const b2 = balances2.tokenBalances.map((token) => {
    if (token.tokenBalance !== "0")
      return token.contractAddress
  })
  const commonTokens = b1.filter(value => b2.includes(value))

  const a1 = await getAddressList(wallet1)
  const a2 = await getAddressList(wallet2)
  const commonAddresses = a1.filter(value => a2.includes(value))

  // const walletDistance = parseFloat(Math.abs(wallet1-wallet2).toString().substring(0,3))
  const walletDistance = 0;

  return 100 - Math.sqrt((Math.pow(30 - commonAddresses.length,2) + Math.pow(30 - commonNfts.length,2) + Math.pow(30 - commonTokens.length,2) + Math.pow(walletDistance,2))/4)
};

export const getAvatarURI = async(wallet: string): Promise<string | null> => {
  var name = await provider.lookupAddress(wallet);
  if (name !== null) {
    const avt = new AvatarResolver(provider);
    const avatarURI = await avt.getAvatar(name, {});
    if (avatarURI) {
      return avatarURI;
    }
  }
  const nft = await alchemy.nft.getNftsForOwner(wallet);
  if (nft.totalCount !== 0){
    for (let i=0,l=nft.ownedNfts.length; i<l; i+=1) {
      if (!nft.ownedNfts[i].media[0]?.gateway) {
        continue
      }

      return nft.ownedNfts[i].media[0].gateway;
    }
  }

  return null;
}