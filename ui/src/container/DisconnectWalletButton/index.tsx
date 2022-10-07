import { ReactNode, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import connectedWalletAtom from '../../recoil/connectedWallet/atom';

export default function DisconnectWalletButton (props: Props) {
  const [connectedWallet, setConnectedWallet] = useRecoilState(connectedWalletAtom);

  const handleClick = useCallback(() => {
    if (connectedWallet === null) {
      return;
    }

    setConnectedWallet(null);
  }, [connectedWallet, setConnectedWallet]);

  return (
    <button {...props} onClick={() => handleClick()}>
      { props.children }
    </button>
  );
}

export type Props = React.HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode | string,
};