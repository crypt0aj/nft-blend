import { useContext, useEffect, useRef } from "react";
import Web3 from "web3";
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import Web3ModalProvider from "../../provider/Web3ModalProvider";
import { useRecoilState } from "recoil";
import connectedWalletAtom from "../../recoil/connectedWallet/atom";
import { Wallet } from "../../apptypes.d";
import { toHex } from "../../utils/number";
import { errorBoundary } from "../../utils/error";
import { networkParams } from "../../apptypes/networks";
import { NftBlend } from "../../lib/contractAPI";
import { useLocation, useNavigate } from "react-router-dom";
import connectedNetworkAtom from "../../recoil/connectedNetwork/atom";
import BigNumber from "bignumber.js";

const chainID = process.env.REACT_APP_CHAIN_ID!;

export default function WalletConnectState() {
  const web3modal = useContext(Web3ModalProvider.Context)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [connectedWallet, setConnectedWallet] = useRecoilState(connectedWalletAtom)
  const [connectedNetwork, setConnectedNetwork] = useRecoilState(connectedNetworkAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Connect to last web3 provider. Run only once on start.
  let hasTriedCachedProvider = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        if (hasTriedCachedProvider.current) {
          return;
        }

        if (!web3modal) {
          return;
        }

        if (web3modal.cachedProvider) {
          console.log('Connecting to cached Web3 provider');
          hasTriedCachedProvider.current = true;

          const provider = await web3modal.connect();
          const web3 = new Web3(provider);
          const web3provider = new ethers.providers.Web3Provider(provider, 'any');

          const accounts = await web3.eth.getAccounts();

          setConnectedWallet({
            address: accounts[0],
            web3,
            web3provider,
            nativeProvider: provider,
            nftBlendAPI: new NftBlend(web3provider.getSigner(), process.env.REACT_APP_CONTRACT_ADDRESS!),
          });

          enqueueSnackbar('Reconnected to your wallet', {
            variant: 'success'
          });
        }
      } catch (err) {
        enqueueSnackbar('Cannot connect to your last connected wallet', {
          variant: 'error',
        });
        console.error(err);
      }
    })()
  }, [web3modal, enqueueSnackbar, setConnectedWallet]);

  // On wallet connected and disconnected listener
  const lastConnectedWallet = useRef<Wallet | null>(null);
  const handleDisconnect = useRef(() => { });
  useEffect(() => {
    let cleanUpFn = () => { }
    (async () => {
      // wallet disconnects
      if (lastConnectedWallet.current !== null && connectedWallet === null) {
        console.log('Detected user disconnected');
        lastConnectedWallet.current = null;
        handleDisconnect.current();
        return;
      }

      // wallet connects
      if (!connectedWallet?.address) {
        return;
      }
      if (lastConnectedWallet.current !== null && lastConnectedWallet.current.address === connectedWallet?.address) {
        return;
      }
      lastConnectedWallet.current = connectedWallet;

      if (location.pathname === '/blend/find') {
        navigate('/blend');
      }

      (async () => {
        try {
          await connectedWallet.nativeProvider.request!({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: toHex(chainID) }]
          });
        } catch (err) {
          console.error(err);
          const switchErr = errorBoundary(err);
          if (switchErr.code === 4902) {
            try {
              await connectedWallet.nativeProvider.request!({
                method: "wallet_addEthereumChain",
                params: [networkParams[toHex(chainID)]],
              });
            } catch (err) {
              enqueueSnackbar('Cannot add target EVM chain', {
                variant: 'error',
              });
            }
          } else {
            enqueueSnackbar('Cannot switch to target EVM chain', {
              variant: 'error',
            });
          }
        }
      })();

      const chainId = await connectedWallet.web3.eth.getChainId();
      console.log(`Wallet network is ${chainId}`);
      setConnectedNetwork(chainId);

      // Register listeners
      // Keep a local copy to the native provider for de-registration later
      const nativeProvider = connectedWallet.nativeProvider;

      const handleAccountsChanged = (accounts: string[]) => {
        console.log('User changed account', accounts);

        if (!accounts) {
          return;
        }
        if (accounts.length === 0) {
          handleDisconnect.current();
          return;
        }
        if (connectedWallet?.address === accounts[0]) {
          return
        }

        enqueueSnackbar('Wallet account changed', {
          variant: 'info',
        })
        setConnectedWallet({
          address: accounts[0],
          web3: connectedWallet.web3,
          web3provider: connectedWallet.web3provider,
          nativeProvider: connectedWallet.nativeProvider,
          nftBlendAPI: connectedWallet.nftBlendAPI,
        });
      };

      const handleChainChanged = (chain: string) => {
        const chainID = new BigNumber(chain).toNumber()
        console.log(`User changed chain ${chainID}`);

        setConnectedNetwork(chainID);
      }

      handleDisconnect.current = async () => {
        console.log('User disconnected wallet');

        if (!web3modal) {
          return
        }

        try {
          setConnectedWallet(null);
          await web3modal.clearCachedProvider();
          deregisterListeners();
          enqueueSnackbar('Wallet disconnected', {
            variant: 'info',
          });
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Cannot disconnect wallet. Please try again or refresh the page', {
            variant: 'error',
          });
        }
      };

      const deregisterListeners = () => {
        nativeProvider.removeListener("accountsChanged", handleAccountsChanged);
        nativeProvider.removeListener("chainChanged", handleChainChanged);
        nativeProvider.removeListener("disconnect", handleDisconnect.current);
      }

      nativeProvider.on("accountsChanged", handleAccountsChanged);
      nativeProvider.on("chainChanged", handleChainChanged);
      nativeProvider.on("disconnect", handleDisconnect.current);
      console.log('Listening on Web3 provider events');

      cleanUpFn = () => {
        deregisterListeners();
      }
    })();

    return () => {
      cleanUpFn();
    };
  }, [connectedWallet, web3modal, enqueueSnackbar, setConnectedWallet, setConnectedNetwork, location, navigate]);

  return null;
}
