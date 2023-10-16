import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';

import LogDecodedInputDataHeader from './LogDecodedInputDataHeader';
import LogDecodedInputDataTable from './LogDecodedInputDataTable';
import {replaceRules, replaceText} from 'constants/Local'

interface Props {
  data: DecodedInput;
  isLoading?: boolean;
}

const LogDecodedInputData = ({ data, isLoading }: Props) => {
  data.method_call = replaceText(data.method_call, replaceRules)
  return (
    <>
      <LogDecodedInputDataHeader methodId={ data.method_id } methodCall={ data.method_call } isLoading={ isLoading }/>
      { data.parameters.length > 0 && <LogDecodedInputDataTable data={ data.parameters } isLoading={ isLoading }/> }
    </>
  );
};

export default React.memo(LogDecodedInputData);
