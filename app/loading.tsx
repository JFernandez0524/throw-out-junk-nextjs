'use client';

import { Flex, Loader } from '@aws-amplify/ui-react';

export default function Loading() {
  return (
    <Flex alignItems='center'>
      <Loader width='5rem' height='5rem' />
    </Flex>
  );
}
