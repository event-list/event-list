import { ChakraProvider } from '@chakra-ui/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';
import React from 'react';
import type { Environment as RelayEnvironment } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay';

import { createEnvironment } from '@event-list/relay';

import { createMockRouter } from './createMockRouter';

const Environment = createEnvironment();

interface Props {
  children: React.ReactElement;
  relayEnvironment?: RelayEnvironment;
  router?: NextRouter;
}

export const WithProviders = ({ children, relayEnvironment = Environment, router = createMockRouter({}) }: Props) => {
  return (
    <RouterContext.Provider value={router}>
      <ChakraProvider>
        <RelayEnvironmentProvider environment={relayEnvironment}>{children}</RelayEnvironmentProvider>
      </ChakraProvider>
    </RouterContext.Provider>
  );
};
