import { selector } from 'recoil';
import atom from './atom';

export const addressSelector = selector<string>({
  key: 'connectedWallet/address',
  get: ({ get }) => {
    const wallet = get(atom);
    if (wallet === null) {
      return '';
    }

    return wallet.address;
  },
});
