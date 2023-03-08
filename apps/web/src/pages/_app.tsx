import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { ErrorBoundary } from 'react-error-boundary';

import { ReactRelayContainer } from '@event-list/relay';
import { theme } from '@event-list/ui';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <NextNProgress color="linear-gradient(to right, #E53E3E, #B83280)" options={{ showSpinner: false }} />
        <ReactRelayContainer Component={Component} props={pageProps} />
      </ErrorBoundary>
    </ChakraProvider>
  );
}
