import { atom } from 'recoil';
import { Wallet } from '../../apptypes.d';

const connectedNetworkAtom = atom<number | null>({
    key: 'connectedNetwork',
    default: null,
  });
  

export default connectedNetworkAtom;