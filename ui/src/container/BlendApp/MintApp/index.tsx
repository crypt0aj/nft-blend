import { useSnackbar } from 'notistack';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Web3 from 'web3';
import { Wallet } from '../../../apptypes.d';
import { generateScore, getAvatarURI } from '../../../lib/scoreGenerator';
import connectedWalletAtom from '../../../recoil/connectedWallet/atom';
import BlendProcessPage from '../BlendProcessPage';
import BlendResultPage, { BlendResult } from '../BlendResultPage';
import styles from './index.module.css';

enum Stage {
  Find,
  Processing,
  Result,
}

export default function MintApp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<Stage>(Stage.Find);
  const [blendCommand, setBlendCommand] = useState<BlendCommand | null>(null);
  const [score, setScore] = useState<number>(-1);
  const [blendResult, setBlendResult] = useState<BlendResult | null>(null);
  const [addressValue, setAddressValue] = useState('');
  const handleAddressChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setAddressValue(event.target.value);
  }, [setAddressValue]);

  const lastConnectedWallet = useRef<Wallet | null>(null);
  useEffect(() => {
    (async () => {
      if (connectedWallet === null) {
        enqueueSnackbar('Please connect your wallet first', {
          variant: 'warning',
        });
        navigate('/blend');
        return;
      }
      const isRegistered = await connectedWallet.nftBlendAPI.isRegistered(connectedWallet.address)
      if (!isRegistered) {
        enqueueSnackbar('Please register as CROmie first', {
          variant: 'warning',
        });
        navigate('/blend');
        return;
      }
    })();
  }, [connectedWallet, enqueueSnackbar, navigate]);

  const handleBlend = useCallback(async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      if (addressValue.trim() === "") {
        enqueueSnackbar('CROmie address cannot be empty', {
          variant: 'warning',
        });
        return;
      }

      if (!Web3.utils.isAddress(addressValue)) {
        enqueueSnackbar('Please enter a valid CROmie address', {
          variant: 'warning',
        });
        return;
      }

      if (connectedWallet === null) {
        return;
      }

      const address1 = connectedWallet.address;
      const address2 = addressValue;

      // const address1 = '0x338fa4542dc7c553787fd4c39d23879e4a761ddb';
      // const address2 = '0xde6457e23289ddffdd0fd287d1e7e44f7fb25e59';

      // const address1 = '0x05EEf6647D08cc1772274Dd7c838A41b7c067227';
      // const address2 = '0xaf0f4479aF9Df756b9b2c69B463214B9a3346443';

      if (address1 === address2) {
        enqueueSnackbar('You are always the best CROmie with yourself', {
          variant: 'warning',
        });
        return;
      }

      setStage(Stage.Processing);
      const [connectedWalletAvatarURI, isAddressRegistered, addressAvatarURI] = await Promise.all([
        getAvatarURI(address1),
        connectedWallet.nftBlendAPI.isRegistered(address2),
        getAvatarURI(address2),
      ]);

      if (connectedWalletAvatarURI === null) {
        enqueueSnackbar('Your wallet do not have any NFT', {
          variant: 'warning',
        });
        setStage(Stage.Find);
        return
      }

      if (!isAddressRegistered) {
        enqueueSnackbar('Your CROmie is not registered yet. Invite them to be one!', {
          variant: 'warning',
        });
        setStage(Stage.Find);
        return
      }

      if (addressAvatarURI === null) {
        enqueueSnackbar('You CROmie does not have any NFT', {
          variant: 'warning',
        });
        setStage(Stage.Find);
        return
      }

      setBlendCommand({
        address1,
        address2,
        image1URI: connectedWalletAvatarURI,
        image2URI: addressAvatarURI,
      });

      const score = await generateScore(address1, address2);
      setScore(score);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Sorry something went wrong. Please try again.', {
        variant: 'error',
      });
      setStage(Stage.Find);
    } finally {
      setIsLoading(false);
    }
  }, [connectedWallet, enqueueSnackbar, addressValue, setBlendCommand, isLoading]);

  const handleBlendComplete = useCallback((imageData: string) => {
    const blendResult: BlendResult = {
      address1: blendCommand!.address1,
      address2: blendCommand!.address2,
      score: Math.ceil(score),
      blendImageData: imageData,
    }
    setBlendResult(blendResult);
    setStage(Stage.Result);
  }, [blendCommand, score]);

  const handleBlendError = useCallback((err: unknown) => {
    console.error(err);
    enqueueSnackbar('There are some issues during blend. Please try again later.', {
      variant: 'error',
    })
    setIsLoading(false);
    setStage(Stage.Find);
  }, [enqueueSnackbar]);

  switch (stage) {
    case Stage.Find:
      return (
        <div className={styles.Container}>
          <div className={styles.Content}>
            <div className={styles.Title}>Blend with CROmie</div>
            <div className={styles.Description}>Enter your CROmie address to start blending</div>
            <div className={styles.AddressForm}>
              <div className={styles.AddressInputContainer}>
                <input
                  type="text"
                  placeholder="Enter a CROmie wallet address"
                  className={styles.AddressInput}
                  value={addressValue}
                  onChange={handleAddressChange}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>
              <div className={styles.BlendButtonContainer}>
                <button
                  className={styles.BlendButton}
                  onClick={handleBlend}
                  disabled={isLoading}
                >
                  {isLoading ? 'Preparing' : 'Blend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    case Stage.Processing:
      return (
        <BlendProcessPage
          image1URI={blendCommand?.image1URI}
          image2URI={blendCommand?.image2URI}
          isScoreReady={score !== -1}
          onBlendComplete={handleBlendComplete}
          onBlendError={handleBlendError}
        />
      );
    case Stage.Result:
      if (!blendResult) {
        return null
      }
      return (
        <BlendResultPage result={blendResult} />
      )
    default:
      return null;
  }
}

type BlendCommand = {
  address1: string;
  address2: string;
  image1URI: string;
  image2URI: string;
}
