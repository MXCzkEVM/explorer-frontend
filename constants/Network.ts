import { ethers } from 'ethers'


export const CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK_ID || ""

const networks: any = {
  "5167003": {
    chainId: 5167003,
    rpc: ['https://wannsee-rpc.mxc.com'],
    rpc_url: "https://wannsee-rpc.mxc.com",
    // rpc_url: "http://144.202.111.198:8545",
    nativeCurrency: {
        decimals: 18,
        name: "MXC Token",
        symbol: "MXC",
      },
      shortName: "wannsee",
      slug: "wannsee",
      testnet: true,
      chain: "Wannsee",
      name: "Wannsee zkEVM Testnet",
      icon: {
        url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
        height: 512,
        width: 512,
        format: 'png'
      },
      etherscan: "http://wannsee-explorer.mxc.com",
  },
  "18686": {
    chainId: 18686,
    rpc: ["https://rpc.mxc.com"],
    rpc_url: "https://rpc.mxc.com",
    nativeCurrency: {
        decimals: 18,
        name: "MXC Token",
        symbol: "MXC",
      },
      shortName: "zkEVM Mainnet",
      slug: "zkEVM Mainnet",
      testnet: true,
      chain: "Wannsee",
      name: "zkEVM Mainnet",
      icon: {
        url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
        height: 512,
        width: 512,
        format: 'png'
      },
      etherscan: "http://explorer.mxc.com",
  },
}

export const NETWORK = networks[CHAIN_ID]
export const PROVIDER = new ethers.providers.JsonRpcProvider(networks[CHAIN_ID].rpc_url);