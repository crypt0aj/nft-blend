import { atom } from 'recoil';
import { Wallet } from '../../apptypes.d';

const connectedWalletAtom = atom<Wallet | null>({
    key: 'connectedWallet',
    default: null,
    dangerouslyAllowMutability: true,
  });
  

export default connectedWalletAtom;