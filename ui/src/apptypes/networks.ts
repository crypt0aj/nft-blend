import { toHex } from "../utils/number";

export const networkParams = {
	[toHex('338')]: {
		chainId: toHex(338),
		rpcUrls: ["https://evm.cronos.org"],
		chainName: "Cronos Testnet",
		nativeCurrency: { name: "tCRO", decimals: 18, symbol: "tCRO" },
		blockExplorerUrls: ["https://testnet.cronos.org"],
		iconUrls: ["https://cronos.org/favicon.ico"]
	},
};

export const ONE_DAY_BLOCKS = 15710;
