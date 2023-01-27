import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { SnackbarProvider } from 'notistack';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ReactRelayContainer } from '@event-list/relay';
import { theme } from '@event-list/ui';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <ChakraProvider theme={theme}>
        <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <NextNProgress />
            <ReactRelayContainer Component={Component} props={pageProps} />
          </Suspense>
        </ErrorBoundary>
      </ChakraProvider>
    </SnackbarProvider>
  );
}
