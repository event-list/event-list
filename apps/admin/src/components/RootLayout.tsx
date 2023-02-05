/* eslint-disable no-constant-condition */
import type { FlexProps } from '@chakra-ui/react';
import { Box, Container, Flex, Icon, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ReactText } from 'react';
import type { IconType } from 'react-icons';
import { FiHome, FiTrendingUp } from 'react-icons/fi';
import type { PreloadedQuery } from 'react-relay';
import { usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { Footer, Header, Layout } from '@event-list/ui';

import type { RootLayoutQuery } from '../../__generated__/RootLayoutQuery.graphql';
import { useAuth } from '../auth/useAuth';
import { useLogout } from '../auth/useLogout';

const LayoutQuery = graphql`
  query RootLayoutQuery {
    meAdmin {
      ...useAuthFragment_user
    }
  }
`;

type LayoutProps = {
  children: React.ReactNode;
  preloadedQuery: PreloadedQuery<RootLayoutQuery>;
  title?: string;
};

const Links = () => (
  <>
    <NavItem key={'My events'} icon={FiHome} href={'/'}>
      My events
    </NavItem>
    <NavItem key={'Share my event'} icon={FiHome} href={'/share-your-event'}>
      Share my event
    </NavItem>
  </>
);

const NavItem = ({ icon, children, href, ...rest }) => {
  return (
    <NextLink href={href}>
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" {...rest}>
          {icon && <Icon mr="4" fontSize="16" as={icon} />}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

export default function RootLayout(props: LayoutProps) {
  const { meAdmin: userPreloaded } = usePreloadedQuery(LayoutQuery, props.preloadedQuery);

  const [logout] = useLogout();
  const [user] = useAuth(userPreloaded!);

  return (
    <Layout title={props.title}>
      <Header user={user} onLogout={logout} links={<Links />}>
        <Container maxW="full" overflow="hidden" pb={{ base: '28', md: '28' }} px={{ base: '2', md: '20' }}>
          <Box as="main" mb={'5rem'}>
            {props.children}
          </Box>
          <Footer />
        </Container>
      </Header>
    </Layout>
  );
}
