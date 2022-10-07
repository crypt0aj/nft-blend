import { useRecoilValue } from "recoil";
import { Route, Routes } from 'react-router-dom';
import connectedWalletAtom from "../../recoil/connectedWallet/atom";
import ConnectWalletPage from "./ConnectWalletPage";
import BlendHome from "./Home";
import MintApp from "./MintApp";
import { NotFound } from "../../components/NotFound";
import connectedNetworkAtom from "../../recoil/connectedNetwork/atom";
import BigNumber from "bignumber.js";
import SwitchNetworkPage from "./SwitchNetworkPage";

export default function BlendApp() {
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const connectedNetwork = useRecoilValue(connectedNetworkAtom);

  if (connectedWallet === null) {
    return (<ConnectWalletPage />);
  }
  if (connectedNetwork !== null) {
    if (!(new BigNumber(connectedNetwork).isEqualTo(process.env.REACT_APP_CHAIN_ID!))) {
      return (<SwitchNetworkPage />);
    }
  }

  return (
    <Routes>
      <Route path="/">
        <Route index element={<BlendHome />} />
        <Route path="/find" element={<MintApp />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}