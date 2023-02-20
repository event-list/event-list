/* eslint-disable no-constant-condition */
import { Box, Container, Flex, Icon, Link, MenuItem, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { FiHome } from 'react-icons/fi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { Footer, Header, Layout } from '@event-list/ui';

import type { ProfileQuery as ProfileQueryType } from '../../__generated__/ProfileQuery.graphql';
import type { useAuthFragment_user$key } from '../../__generated__/useAuthFragment_user.graphql';
import { useAuthFragment } from '../auth/useAuth';
import { useLogout } from '../auth/useLogout';
import { ProfileQuery } from './user/Profile';

type LayoutProps = {
  children: React.ReactNode;
  preloadedQuery: PreloadedQuery<ProfileQueryType>;
  title?: string;
};

const Links = () => (
  <>
    <NavItem key={'Home'} icon={FiHome} href={'/'}>
      Home
    </NavItem>
  </>
);

const SubMenuItems = () => (
  <NextLink href={'/profile'}>
    <MenuItem icon={<Icon w={5} h={6} as={CgProfile} />}>
      <Text fontSize={13}>Profile</Text>
    </MenuItem>
  </NextLink>
);

export default function RootLayout(props: LayoutProps) {
  const [logout] = useLogout();

  const { me } = usePreloadedQuery(ProfileQuery, props.preloadedQuery);
  const user = useFragment<useAuthFragment_user$key>(useAuthFragment, me);

  if (!user) {
    return <Box>Unauthorized</Box>;
  }

  return (
    <Layout title={props.title}>
      <Header user={user} onLogout={logout} links={<Links />} subMenuItems={<SubMenuItems />}>
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
