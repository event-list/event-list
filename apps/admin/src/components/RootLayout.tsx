import { Box, Container, Flex, Icon, Link, MenuItem, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import { BsCardChecklist } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiHome } from 'react-icons/fi';
import { RiShareForwardLine } from 'react-icons/ri';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { Footer, Header, Layout, TextDecorated } from '@event-list/ui';

import { ProfileViewQuery } from './merchant/ProfileView';
import type { ProfileViewQuery as ProfileViewQueryType } from '../../__generated__/ProfileViewQuery.graphql';
import type { useAdminAuthFragment_user$key } from '../../__generated__/useAdminAuthFragment_user.graphql';
import { useAdminAuthFragment } from '../auth/useAdminAuth';
import { useLogout } from '../auth/useLogout';

type LayoutProps = {
  children: React.ReactNode;
  preloadedQuery: PreloadedQuery<ProfileViewQueryType>;
  title?: string;
};

export default function RootLayout(props: LayoutProps) {
  const { t } = useTranslation(['en', 'ptBR']);

  const [logout] = useLogout();

  const { meAdmin } = usePreloadedQuery(ProfileViewQuery, props.preloadedQuery);
  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  const Links = () => (
    <Box>
      <NavItem key={'Home'} icon={FiHome} href={'/'}>
        <Text fontWeight={'600'}>{t('Home')}</Text>
      </NavItem>
      <NavItem key={'My event'} icon={BsCardChecklist} href={'/events'}>
        <Text fontWeight={'600'}>{t('My events')}</Text>
      </NavItem>
      <NavItem key={'Share an event'} icon={RiShareForwardLine} href={'/share-your-event'}>
        <Text fontWeight={'600'}>{t('Share an event')}</Text>
      </NavItem>
    </Box>
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

  const SubMenuItems = () => (
    <NextLink href={'/profile'}>
      <MenuItem icon={<Icon w={5} h={6} as={CgProfile} />}>
        <Text fontSize={13}>{t('Profile')}</Text>
      </MenuItem>
    </NextLink>
  );

  return (
    <Layout title={props.title}>
      <Header user={merchant} onLogout={logout} links={<Links />} subMenuItems={<SubMenuItems />} t={t}>
        <Container maxW="full" overflow="hidden">
          {merchant ? (
            props.children
          ) : (
            <Flex justifyContent={'center'} alignItems={'center'}>
              <TextDecorated fontSize={'2xl'} fontWeight={'bold'}>
                {t('Unauthorized, please login again')}
              </TextDecorated>
            </Flex>
          )}
        </Container>
      </Header>
      <Footer t={t} />
    </Layout>
  );
}
