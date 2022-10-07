# nft-blend

This repository contains smart contracts for NFT Blend project.

## Prerequisites

This project uses Foundry to build, test and deploy smart contacts. To install foundry, follow installation steps
[here](https://book.getfoundry.sh/getting-started/installation).

## Building

To build the smart contracts, run:

```shell
forge build
```

## Testing

To run tests for smart contracts, run:

```shell
forge test
```

## Coverage

To get the coverage report, run:

```shell
forge coverage
```

## Deploy on local network

1. Start a local network:

   ```shell
   anvil
   ```

   This will print a list of test private keys which can be used to deploy the smart contract.

2. Deploy smart contract on local network

   ```shell
   forge create --rpc-url http://127.0.0.1:8545 --private-key <private_key> src/NftBlend.sol:NftBlend
   ```

   This command will print contract address of deployed smart contract.

3. Call smart contract

   ```shell
   cast call <contract_address> "isRegistered(address)(bool)" <your_address> --rpc-url http://127.0.0.1:8545
   ```

4. Register an address

   ```shell
   cast send <contract_address> "register()" --rpc-url http://localhost:8545 --private-key <private_key>
   ```

> Note: For more details on `forge`, `anvil` and `cast`, refer to [foundry book](https://book.getfoundry.sh/).
