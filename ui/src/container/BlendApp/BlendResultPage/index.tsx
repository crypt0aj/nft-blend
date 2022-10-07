import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { create } from "ipfs-http-client";
import { TwitterShareButton } from "react-share";
import BlendTable from '../../../components/BlendTable';
import connectedWalletAtom from "../../../recoil/connectedWallet/atom";
import styles from './index.module.css';
import AddressLabel from "../../../components/AddressLabel";
import AddressIcon from "../../Header/AddressIcon";
import useRandomPrompt from "../../../lib/useRandomPrompt";
import { useSnackbar } from "notistack";
import Web3Provider from "../../../provider/Web3Provider";
import BigNumber from "bignumber.js";
import sampleBlends from '../../../data/sampleblends.json';
import NFTBlendAPIProvider from "../../../provider/NFTBlendAPIProvider";
import { BlendRecord } from "../../../apptypes.d/blend";

export default function BlendResultPage(props: Props) {
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const { enqueueSnackbar } = useSnackbar();
  const [ipfsURI, setIPFSURI] = useState<string | null>(null);
  const nftBlendAPI = useContext(NFTBlendAPIProvider.Context)
  const web3 = useContext(Web3Provider.Context);
  const prompt = useRandomPrompt();
  const [topMintedBlends, setTopMintedBlends] = useState<BlendRecord[]>([...sampleBlends].sort((tokenA, tokenB) => (tokenB.score - tokenA.score)));

  const {
    address1,
    address2,
    score,
    blendImageData,
  } = props.result;

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

      setTopMintedBlends([...allMintedTokens].sort((tokenA, tokenB) => (tokenB.score - tokenA.score)));
    })();
  }, []);

  const [overlayHeight, setOverlayHeight] = useState(0);
  useEffect(() => {
    setOverlayHeight(Math.ceil(score));
  }, [score]);

  const lastBlendedImageData = useRef<string | null>(null);
  useEffect(() => {
    if (lastBlendedImageData.current !== null) {
      if (lastBlendedImageData.current === blendImageData) {
        return;
      }
    }
    lastBlendedImageData.current = blendImageData;

    enqueueSnackbar('We are moving your Blend image to IPFS for later use.', {
      variant: 'info',
    });
    (async () => {
      const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_IPFS_PROJECT_SECRET).toString('base64');
      const ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: {
          authorization: auth
        }
      });
      const response = await fetch(blendImageData);
      const blob = await response.blob();
      const file = new File([blob], "blend.png", { type: "image/png" });
      const imghash = await ipfs.add(file, {
        pin: true,
      });
      setIPFSURI(`${process.env.REACT_APP_IPFS_GATEWAY}${imghash.path}`);
      enqueueSnackbar('You Blend image is ready to be minted and shared.', {
        variant: 'info',
      });
    })()
  }, [blendImageData, enqueueSnackbar]);

  const handleMint = useCallback(async () => {
    if (ipfsURI === null) {
      enqueueSnackbar('We are working hard to move your Blend image to IPFS. Please wait and try again.', {
        variant: 'warning',
      });
      return;
    }

    if (!connectedWallet) {
      return;
    }

    try {
      await connectedWallet.nftBlendAPI.mint(address2, score, ipfsURI);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Cannot mint your Blend NFT. Please try again later.', {
        variant: 'error',
      });
      return;
    }
  }, [ipfsURI, enqueueSnackbar, connectedWallet, address2, score]);

  const handleShare = useCallback(async () => {
    if (ipfsURI === null) {
      enqueueSnackbar('We are working hard to move your Blend image to IPFS. Please wait and try again.', {
        variant: 'warning',
      });
      return;
    }
  }, [ipfsURI, enqueueSnackbar]);

  return (
    <div className={styles.Container}>
      <div className={styles.ResultContainer}>
        <div className={styles.ResultTitle}>Blend Completed</div>
        <div className={styles.Result}>
          <div className={styles.ResultNFTContainer} style={{ "--value": score } as React.CSSProperties}>
            <div className={styles.ResultNFTOverlay} style={{ maxHeight: `${overlayHeight}%` }}></div>
            <div className={styles.ResultNFTScoreOverlayContainer}>
              <div className={styles.ResultNFTScoreOverlay}><span>%</span></div>
              <div className={styles.ResultNFTScoreOverlayWalletMatchText}>Wallet Match</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 75 17" className={styles.ResultNFTLogoSVG}>
              <defs>
                <path id="a" d="M0 0h75v17H0z"></path>
              </defs>
              <g fill="none" fill-rule="evenodd">
                <mask id="b" fill="#fff">
                  <use xlinkHref="#a"></use>
                </mask>
                <g mask="url(#b)" fill="#FFF">
                  <path d="M17.624 17V7.728h2.942V17h2.942V7.728h2.944V17h2.941V4.637H14.681V17h2.943Z" fill-rule="nonzero"></path>
                  <path d="M33.807 4.637V17h-2.942V4.637h2.942ZM33.807 0v3.09h-2.942V0h2.942Z"></path>
                  <path d="M38.22 17V7.728h2.942V17h2.942V4.637h-8.827V17h2.943ZM48.52 0v4.637h-2.943v3.09h2.943V17h2.941V7.728h2.944V4.637H51.46V0h-2.94Z" fill-rule="nonzero"></path>
                  <path d="M64.7 17v-3.09h-5.885v-1.546H64.7V4.637h-8.827V17H64.7Zm-2.942-9.272v1.544h-2.943V7.728h2.943ZM72.057 4.637h-5.885V17H75V0h-2.942v4.637Zm-2.942 9.272V7.728h2.942v6.181h-2.942ZM7.335 4.637v4.637H4.393V4.637h2.942Z"></path>
                  <path d="M0 13.91V17h11.728v-2.333h.007V4.637H8.792v9.272H0Z" fill-rule="nonzero"></path>
                  <path d="M2.948 4.637v4.637H.006V4.637h2.942Z"></path>
                </g>
              </g>
            </svg>
            <img className={styles.ResultNFTImage} src={blendImageData} alt='' />
          </div>
          <div className={styles.ResultDetails}>
            <div className={styles.ResultTitle}>The Blend of</div>
            <div className={styles.ResultAddressContainer}>
              <div className={styles.ResultAddress}>
                <AddressIcon address={address1} />
                <AddressLabel className={styles.ResultAddressLabel} headingCharacter={8} trailingCharacter={6}>
                  {address1}
                </AddressLabel>
              </div>
              <div className={styles.ResultAndText}>&</div>
              <div className={styles.ResultAddress}>
                <AddressIcon address={address2} />
                <AddressLabel className={styles.ResultAddressLabel} headingCharacter={8} trailingCharacter={6}>
                  {address2}
                </AddressLabel>
              </div>
            </div>
            <div className={styles.ResultCaption}>{prompt}</div>
            <div className={styles.MintButtonContainer}>
              <button className={styles.MintButton} onClick={handleMint}>Mint this Blend</button>
            </div>
            <div className={styles.ShareButtonContainer}>
              {
                ipfsURI === null ?
                  <button className={styles.ShareButton} onClick={handleShare}>Share this Blend</button> :
                  <TwitterShareButton
                    title={`Here's my perfect blend with ${address2}`}
                    url={ipfsURI}
                    hashtags={["minted", "nft", "nftblend"]}
                  >
                    <button className={styles.ShareButton}>Share this Blend</button>:
                  </TwitterShareButton>
              }
            </div>
          </div>

        </div>

      </div>
      <section className={styles.Section}>
        <div className={styles.SectionTitle}>Top Minted Blends Today</div>
        <BlendTable records={topMintedBlends} />
      </section>
    </div>
  )
}

export type Props = {
  result: BlendResult;
}

export type BlendResult = {
  address1: string;
  address2: string;
  score: number;
  blendImageData: string;
}
