import BigNumber from 'bignumber.js';

import type { Block } from 'types/api/block';

export default function getBlockReward(block: Block) {
  const txFees = BigNumber(block.tx_fees || 0);
  const burntFees = BigNumber(block.burnt_fees || 0);
  // const minerReward = block.rewards?.find(({ type }) => type === 'Miner Reward' || type === 'Validator Reward')?.reward;
  const minerReward = block.rewards?.find(({ type }) => type === 'Supernode Reward')?.reward;
  const totalReward = BigNumber(minerReward || 0);
  const staticReward = totalReward.minus(txFees).plus(burntFees);

  return {
    totalReward,
    staticReward,
    txFees,
    burntFees,
  };
}
