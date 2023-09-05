import { Icon } from '@chakra-ui/react';
import React from 'react';
import LinkInternal from 'ui/shared/LinkInternal';
import transactionsIcon from 'icons/transactions.svg';

const LatestTransactions = () => {
  const url = process.env.NEXT_PUBLIC_L1EXPLOR;
  const show = process.env.NEXT_PUBLIC_L1_ADDRESS;
  const linkUrl = `${url}/address/${show}`;
  return (
    <div className='zkproofs'>
      <div className="tagItme flex_c">
        Contract
      </div>
      <div className='zkevmlink'>
        <LinkInternal className='flexbox' fontSize="md" href={linkUrl} target={'_blank'}>
          <Icon as={ transactionsIcon } boxSize={ 7 }  color="#A0AEC0"/>
          {show}
        </LinkInternal>
      </div>
    </div>
  );
};

export default LatestTransactions;
