import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import NextNProgress from 'nextjs-progressbar';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { theme } from '@event-list/ui';

import { ReactRelayContainer } from '../relay/ReactRelayContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <NextNProgress color="linear-gradient(to right, #E53E3E, #B83280)" options={{ showSpinner: false }} />
          <ReactRelayContainer Component={Component} props={pageProps} />
        </Suspense>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default appWithTranslation(MyApp);
