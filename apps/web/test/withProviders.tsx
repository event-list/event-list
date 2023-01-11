import { ChakraProvider } from '@chakra-ui/react';
import { createEnvironment } from '@event-list/relay';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import type { Environment as RelayEnvironment } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay';
import { Layout } from '@event-list/ui';
import { createMockRouter } from './createMockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { NextRouter } from 'next/router';

const Environment = createEnvironment();

interface Props {
  children: React.ReactElement;
  relayEnvironment?: RelayEnvironment;
  router?: NextRouter;
}

export const WithProviders = ({
  children,
  relayEnvironment = Environment,
  router = createMockRouter({}),
}: Props) => {
  return (
    <RouterContext.Provider value={router}>
      <RelayEnvironmentProvider environment={relayEnvironment}>
        <SnackbarProvider>
          <ChakraProvider>{children}</ChakraProvider>
        </SnackbarProvider>
      </RelayEnvironmentProvider>
    </RouterContext.Provider>
  );
};
