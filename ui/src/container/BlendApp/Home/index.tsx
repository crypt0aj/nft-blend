import BigNumber from "bignumber.js";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Wallet } from "../../../apptypes.d";
import { BlendRecord } from "../../../apptypes.d/blend";
import { ONE_DAY_BLOCKS } from "../../../apptypes/networks";
import BlendImageList from '../../../components/BlendImageList';
import BlendTable from '../../../components/BlendTable';
import { NftBlend } from "../../../lib/contractAPI";
import NFTBlendAPIProvider from "../../../provider/NFTBlendAPIProvider";
import Web3Provider from "../../../provider/Web3Provider";
import connectedWalletAtom from "../../../recoil/connectedWallet/atom";
import styles from './index.module.css';
import sampleBlends from '../../../data/sampleblends.json';
import connectedNetworkAtom from "../../../recoil/connectedNetwork/atom";

export default function BlendHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const nftBlendAPI = useContext(NFTBlendAPIProvider.Context)
  const web3 = useContext(Web3Provider.Context);
  const [latestMintedBlends, setLatestMintedBlends] = useState<BlendRecord[]>(sampleBlends);
  const [topMintedBlends, setTopMintedBlends] = useState<BlendRecord[]>([...sampleBlends].sort((tokenA, tokenB) => (tokenB.score - tokenA.score)));
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const connectedNetwork = useRecoilValue(connectedNetworkAtom);

  const isConnectedWalletRegistered = useCallback(async (): Promise<boolean> => {
    if (connectedWallet === null) {
      return false;
    }
    return connectedWallet.nftBlendAPI.isRegistered(connectedWallet.address);
  }, [connectedWallet]);

  const [isRegistered, setIsRegistered] = useState(false);
  const lastConnectedWallet = useRef<Wallet | null>(null);
  const lastConnectedNetwork = useRef<number | null>(null);
  useEffect(() => {
    if (connectedWallet === null) {
      return;
    }
    if (connectedNetwork === null) {
      return;
    }
    if (
      lastConnectedWallet.current === null ||
      lastConnectedWallet.current.address !== connectedWallet.address ||
      lastConnectedNetwork.current === null ||
      lastConnectedNetwork.current !== connectedNetwork
    ) {
      setIsRegistered(false);
      (async () => {
        setIsRegistered(await isConnectedWalletRegistered());
      })();
    }
    lastConnectedWallet.current = connectedWallet;
    lastConnectedNetwork.current = connectedNetwork;
  }, [connectedWallet, setIsRegistered, isConnectedWalletRegistered, connectedNetwork]);

  useEffect(() => {
    if (connectedWallet === null) {
      return;
    }
    const checkWalletRegistration = () => {
      return setTimeout(async () => {
        setIsRegistered(await isConnectedWalletRegistered());
        timeout = checkWalletRegistration();
      }, 2000);
    }
    let timeout = checkWalletRegistration();

    return () => {
      clearTimeout(timeout);
    }
  }, [connectedWallet, setIsRegistered, isConnectedWalletRegistered]);

  useEffect(() => {
    (async () => {
      const latestBlock = await web3.eth.getBlockNumber();
      const rpcMaxDistance = 10000;
      const earliestBlock = `0x${new BigNumber(latestBlock).minus(rpcMaxDistance).plus(10).toString(16)}`;
      const pastMintedTokens = await nftBlendAPI.getPastMintedTokens(earliestBlock, 'latest');

      const allMintedTokens = pastMintedTokens.map(token => ({
        addressA: token.sourceAddress,
        addressB: token.targetAddress,
        score: token.score,
        tokenID: token.id.toString(),
        imageURI: token.uri,
      })).concat(sampleBlends)

      setLatestMintedBlends(allMintedTokens);
      setTopMintedBlends([...allMintedTokens].sort((tokenA, tokenB) => (tokenB.score - tokenA.score)));
    })();
  }, []);

  const handleBlend = useCallback(() => {
    if (!isRegistered) {
      connectedWallet?.nftBlendAPI.register();
      return;
    }
    navigate('/blend/find');
  }, [connectedWallet, isRegistered, navigate]);

  return (
    <div className={styles.Container}>
      <div className={styles.Banner}>
        <div className={styles.BannerContent}>
          <p className={styles.Title}>Friends with Blends</p>
          <p className={styles.Description}>
            {
              isRegistered ?
                'Find the perfect CROmie to create the Perfect Blend' :
                'Register to create the Perfect Blend with the Perfect CROmie'
            }
          </p>
          <button className={styles.BlendButton} onClick={handleBlend}>
            {
              isRegistered ?
                'Blend with CROmie' :
                'Register as CROmie'
            }
          </button>
        </div>
      </div>
      <section className={styles.Section}>
        <div className={styles.SectionTitle}>Latest Minted Blends</div>
        <BlendImageList records={(latestMintedBlends.slice(0, 4))} />
      </section>
      <section className={styles.Section}>
        <div className={styles.SectionTitle}>Top Minted Blends Today</div>
        <BlendTable records={topMintedBlends} />
      </section>
    </div>
  )
}
