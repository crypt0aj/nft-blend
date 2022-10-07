import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useContext, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Web3 from 'web3';
import { NftBlend } from '../../lib/contractAPI';
import Web3Modal from '../../provider/Web3ModalProvider';
import connectedWalletAtom from '../../recoil/connectedWallet/atom';

export default function ConnectWalletButton(props: Props) {
  const web3modal = useContext(Web3Modal.Context);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [connectedWallet, setConnectedWallet] = useRecoilState(connectedWalletAtom);

  const handleClick = useCallback(async () => {
    if (connectedWallet !== null) {
      return;
    }
    if (web3modal === null) {
      return
    }
    try {
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
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Cannot connect to wallet', {
        variant: 'error',
      });
    }
  }, [web3modal, connectedWallet, setConnectedWallet, enqueueSnackbar]);

  return (
    <button {...props} onClick={() => handleClick()}>
      {props.children}
    </button>
  );
}

export type Props = React.HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode | string,
};