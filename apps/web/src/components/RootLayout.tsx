/* eslint-disable no-constant-condition */
import { Box, Container, Flex, Icon, Link, MenuItem, Text } from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { CgProfile } from 'react-icons/cg';
import { FiSearch } from 'react-icons/fi';
import { GiPartyPopper } from 'react-icons/gi';
import { HiOutlineTicket } from 'react-icons/hi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { Footer, Header, Layout, TextDecorated } from '@event-list/ui';

import { ProfileViewQuery } from './user/ProfileView';
import type { ProfileViewQuery as ProfileViewQueryType } from '../../__generated__/ProfileViewQuery.graphql';
import type { useAuthFragment_user$key } from '../../__generated__/useAuthFragment_user.graphql';
import { useAuthFragment } from '../auth/useAuth';
import { useLogout } from '../auth/useLogout';

type LayoutProps = {
  children: React.ReactNode;
  preloadedQuery: PreloadedQuery<ProfileViewQueryType>;
  title?: string;
};

const Links = () => (
  <Box>
    <NavItem key={'Home'} icon={HiOutlineTicket} href={'/'}>
      <Text fontWeight={'600'}>Events</Text>
    </NavItem>
    <NavItem key={'Merchant'} icon={GiPartyPopper} href={'/merchant'}>
      <Text fontWeight={'600'}>Merchants</Text>
    </NavItem>
  </Box>
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

  const { me } = usePreloadedQuery(ProfileViewQuery, props.preloadedQuery);
  const user = useFragment<useAuthFragment_user$key>(useAuthFragment, me);

  return (
    <Layout title={props.title}>
      <Header user={user} onLogout={logout} links={<Links />} subMenuItems={<SubMenuItems />}>
        <Container maxW="full" overflow="hidden">
          <Box mb={'5rem'}>
            {user ? (
              props.children
            ) : (
              <Flex justifyContent={'center'} alignItems={'center'}>
                <TextDecorated fontSize={'2xl'} fontWeight={'bold'}>
                  Unauthorized, please login again
                </TextDecorated>
              </Flex>
            )}
          </Box>
        </Container>
      </Header>
      <Footer />
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
