/* eslint-disable no-constant-condition */
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { Footer, Header, Layout } from '@event-list/ui';
import { useLogout } from '../auth/useLogout';
import { RootLayoutQuery } from '../../__generated__/RootLayoutQuery.graphql';
import { useAuth } from '../auth/useAuth';
import { Box, Container } from '@chakra-ui/react';

const LayoutQuery = graphql`
  query RootLayoutQuery {
    user {
      ...useAuthFragment_user
    }
  }
`;

type LayoutProps = {
  children: React.ReactNode;
  preloadedQuery: PreloadedQuery<RootLayoutQuery>;
  title?: string;
};

export default function RootLayout(props: LayoutProps) {
  const { user: userPreloaded } = usePreloadedQuery(
    LayoutQuery,
    props.preloadedQuery
  );

  const [logout] = useLogout();
  const [user] = useAuth(userPreloaded!);

  return (
    <Layout title={props.title}>
      <Header user={user} onLogout={logout}>
        <Container maxW="full" overflow="hidden">
          <Box as='main'>{props.children}</Box>
          <Footer />
        </Container>
      </Header>
    </Layout>
  );
}
