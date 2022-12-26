import type { AppProps } from 'next/app';
import { Suspense } from 'react';

import { SnackbarProvider } from 'notistack';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { theme } from '@event-list/ui';
import { ReactRelayContainer } from '@event-list/relay';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <ChakraProvider theme={theme}>
        <ErrorBoundary
          fallbackRender={({ error }) => <div>{error.message}</div>}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ReactRelayContainer Component={Component} props={pageProps} />
          </Suspense>
        </ErrorBoundary>
      </ChakraProvider>
    </SnackbarProvider>
  );
}
