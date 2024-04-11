import { ethers } from 'ethers'


export const CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK_ID || ""

const networks: any = {
  "5167004": {
    chainId: 5167004,
    rpc: ['https://geneva-rpc.moonchain.com'],
    rpc_url: "https://geneva-rpc.moonchain.com",
    // rpc_url: "http://144.202.111.198:8545",
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "Moonchain",
    slug: "moonchain",
    testnet: true,
    chain: "Moonchain",
    name: "Moonchain Geneva Testnet",
    icon: {
      url: "https://explorer.moonchain.com/_next/static/media/mxc-white.77a42693.png",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "http://geneva-explorer.moonchain.com",
    graphNode: "https://geneva-graph-node.moonchain.com"
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
      graphNode: "https://mxc-graph.mxc.com"
  },
}

export const NETWORK = networks[CHAIN_ID]
export const PROVIDER = new ethers.providers.JsonRpcProvider(NETWORK.rpc_url);
export const graphNode = NETWORK.graphNode