import React from 'react';
import Web3 from 'web3'

export default React.createContext<Web3>(new Web3('http://localhost:8545'));