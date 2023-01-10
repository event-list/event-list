import { ChakraProvider } from '@chakra-ui/react';
import { createEnvironment } from '@event-list/relay';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import type { Environment as RelayEnvironment } from 'react-relay';
import { RelayEnvironmentProvider } from 'react-relay';

const Environment = createEnvironment();

interface Props {
  children: React.ReactElement;
  relayEnvironment?: RelayEnvironment;
}

export const WithProviders = ({
  children,
  relayEnvironment = Environment,
}: Props) => (
  <RelayEnvironmentProvider environment={relayEnvironment}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </RelayEnvironmentProvider>
);
