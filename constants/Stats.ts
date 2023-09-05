
import { BigNumber, Contract, ethers } from 'ethers';
import dayjs from 'dayjs';
import appConfig from 'configs/app';
import MXCL1 from 'constants/abi/MXCL1';
import MXCToken from 'constants/abi/MxcToken';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  OFF = 'OFF',
}
ethers.utils.Logger.setLogLevel(LogLevel.OFF);

const { l1RPC, l1Address, l2Address, oracleAddress } = appConfig.UI.statusPage;
const rpcUrl = appConfig.chain.rpcUrl;
const { currency } = appConfig.chain;

export let l1Provider = new ethers.providers.JsonRpcProvider(l1RPC);
export let l2Provider = new ethers.providers.JsonRpcProvider(rpcUrl);

export const contractL1 = new Contract(l1Address, MXCL1, l1Provider);
export const contractL2 = new Contract(l2Address, MXCL1, l2Provider);

export const l1_Address = l1Address
export const oracle_address = oracleAddress

type StateVarsCache = {
  cachedAt: number;
  stateVars: any;
  chainId: number;
};

const cacheTime = 1000 * 15; // 15 seconds
let stateVarsCache: StateVarsCache;

const getStateVariables = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
) => {
  const { chainId } = await l1Provider.getNetwork();
  if (
    stateVarsCache &&
    stateVarsCache.chainId === chainId &&
    stateVarsCache.cachedAt + cacheTime > Date.now()
  ) {
    return stateVarsCache.stateVars;
  }
  const contractL1 = new Contract(contractAddress, MXCL1, provider);
  const vars = await contractL1.getStateVariables();
  stateVarsCache = {
    stateVars: vars,
    cachedAt: Date.now(),
    chainId: chainId,
  };
  return vars;
};

const getConfig = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
) => {
  const contract: Contract = new Contract(contractAddress, MXCL1, provider);
  const config = await contract.getConfig();
  return config;
};

export const getPendingTransactions = async (
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {
  const mempool = await provider.send('txpool_status', []);
  return BigNumber.from(mempool.pending).toNumber().toString();
};

export const getQueuedTransactions = async (
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {
  const mempool = await provider.send('txpool_status', []);
  return BigNumber.from(mempool.queued).toNumber().toString();
};

export const getAvailableSlots = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
): Promise<string> => {
  const stateVariables = await getStateVariables(provider, contractAddress);
  const config = await getConfig(provider, contractAddress);
  const nextBlockId = stateVariables.numBlocks;
  const latestVerifiedId = stateVariables.lastVerifiedBlockId;
  const pendingBlocks = nextBlockId - latestVerifiedId - 1;
  return Math.abs(pendingBlocks - config.maxNumProposedBlocks).toString();
};

export const getLastVerifiedBlockId = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
): Promise<string> => {
  const stateVariables = await getStateVariables(provider, contractAddress);
  const lastBlockId = stateVariables.lastVerifiedBlockId;
  return BigNumber.from(lastBlockId).toNumber().toString();
};

export const getNextBlockId = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
): Promise<string> => {
  const stateVariables = await getStateVariables(provider, contractAddress);
  const nextBlockId = stateVariables.numBlocks;
  return BigNumber.from(nextBlockId).toNumber().toString();
};

export const getLestProposed = async (
  provider: ethers.providers.JsonRpcProvider
): Promise<string> => {
  let currentBlock = await provider.getBlockNumber();
  const blockTimestamp = (await provider.getBlock(currentBlock)).timestamp;
  return dayjs(blockTimestamp * 1000).format('YYYY/MM/DD HH:mm');
};

export const getBlockFee = async (
  provider: ethers.providers.JsonRpcProvider,
  contractAddress: string
): Promise<string> => {
  const contract: Contract = new Contract(contractAddress, MXCL1, provider);
  const fee = await contract.getBlockFee();
  let mxc_token: string = currency.address || '';
  const tko: Contract = new Contract(mxc_token, MXCToken, provider);
  const decimals = await tko.decimals();
  return `${ethers.utils.formatUnits(fee, decimals)} MXC`;
};