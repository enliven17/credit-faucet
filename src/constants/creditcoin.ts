export const CREDITCOIN_TESTNET = {
  networkName: "Creditcoin Testnet",
  wsRpcUrl: "wss://rpc.cc3-testnet.creditcoin.network",
  httpRpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
  chainId: 102031,
  currencySymbol: "CTC",
  blockExplorerUrl: "https://creditcoin-testnet.blockscout.com/",
} as const;

export type CreditcoinConfig = typeof CREDITCOIN_TESTNET;

