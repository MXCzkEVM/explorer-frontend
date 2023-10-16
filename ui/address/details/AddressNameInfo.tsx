import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import {replaceRules, replaceText} from 'constants/Local'

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  if (data.token) {
    return (
      <DetailsInfoItem
        title="Token name"
        hint="Token name and symbol"
        isLoading={ isLoading }
      >
        <TokenSnippet data={ data.token } isLoading={ isLoading } hideIcon/>
      </DetailsInfoItem>
    );
  }

  if (data.is_contract && data.name) {
    let updatedText = replaceText(data.name, replaceRules);
    return (
      <DetailsInfoItem
        title="Contract name"
        hint="The name found in the source code of the Contract"
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          {/* { data.name } */}
          {updatedText}
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  if (data.name) {
    return (
      <DetailsInfoItem
        // title="Validator name"
        title="Supernode name"
        // hint="The name of the validator"
        hint="The name of the Supernode"
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          { data.name }
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
