import { Box, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { FEATURES } from '@event-list/flags';
import { Container, LinkDecorated } from '@event-list/ui';

import type { ProfileViewQuery as ProfileViewQueryPreloaded } from '../../__generated__/ProfileViewQuery.graphql';
import ProfileViewQueryGenerated from '../../__generated__/ProfileViewQuery.graphql';
import type { useAdminAuthFragment_user$key } from '../../__generated__/useAdminAuthFragment_user.graphql';
import EventsImage from '../../data/images/EventsImage';
import ProfileImage from '../../data/images/ProfileImage';
import QuestionImage from '../../data/images/QuestionImage';
import ShareEventImage from '../../data/images/ShareEventImage';
import { useAdminAuthFragment } from '../auth/useAdminAuth';
import { BetaView } from '../components/features/BetaView';
import { ProfileViewQuery } from '../components/merchant/ProfileView';
import RootLayout from '../components/RootLayout';
import getPreloadedQuery from '../relay/getPreloadedQuery';

export default function Page(props) {
  const { t } = useTranslation(['ptBR', 'en']);
  const { meAdmin } = usePreloadedQuery<ProfileViewQueryPreloaded>(ProfileViewQuery, props.queryRefs.ProfileQuery);

  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  if (!merchant?.features?.includes(FEATURES.BETA)) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
        <BetaView />
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <Stack spacing={6}>
        <Container
          title={t('Share your event')}
          description={t('Do not waste time and share your events now')}
          buttonNav={{ href: '/share-your-event', label: t('Share an event')! }}
          image={<ShareEventImage width="15rem" />}
        />
        <HStack spacing={6}>
          <Container
            fullSize={false}
            title={t('See your events')}
            description={t('Total confirmed, guest list, price, and more...')}
            buttonNav={{
              href: '/events',
              label: t('My events')!,
            }}
            image={<EventsImage />}
          />
          <Container
            fullSize={false}
            title={t('Edit your profile')}
            description={'Logo, instagram, website, description, and more...'}
            buttonNav={{
              href: '/profile',
              label: t('Profile')!,
            }}
            image={<EventsImage />}
          />
        </HStack>
        <Container
          title={t('New here?')}
          description={t('Start with our help page')}
          buttonNav={{ href: '/help', label: t('Help')! }}
          image={<ShareEventImage width="15rem" />}
        />
      </Stack>
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
      },
    },
  };
}
