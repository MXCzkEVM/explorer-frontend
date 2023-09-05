export interface Reward {
  reward: string;
  // type: 'Miner Reward' | 'Validator Reward' | 'Emission Reward' | 'Chore Reward' | 'Uncle Reward' | 'POA Mania Reward';
  type: 'Supernode Reward' | 'Emission Reward' | 'Chore Reward' | 'Uncle Reward' | 'POA Mania Reward';
}
