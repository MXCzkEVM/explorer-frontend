import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Mapper = dynamic(() => import('ui/pages/Mapper'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/tokens">
      <Mapper />
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
