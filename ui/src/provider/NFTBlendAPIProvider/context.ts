import { ethers } from 'ethers';
import React from 'react';
import { NftBlend } from '../../lib/contractAPI';

export default React.createContext<NftBlend>(new NftBlend(
    new ethers.providers.JsonRpcProvider('https://evm-t3.cronos.org'), process.env.REACT_APP_CONTRACT_ADDRESS!
));
