import { Box, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { LinkDecorated } from '@event-list/ui';

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
  const { t } = useTranslation();
  const { meAdmin } = usePreloadedQuery<ProfileViewQueryPreloaded>(ProfileViewQuery, props.queryRefs.ProfileQuery);

  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  if (!merchant?.features?.includes(t('beta'))) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
        <BetaView />
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <Stack spacing={6}>
        <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
          <Flex justifyContent="space-between">
            <Stack spacing={10}>
              <Stack>
                <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('share_your_event')}</Heading>
                <Text fontSize="md">{t('do_not_waste_time_and_share_your_events_')}</Text>
              </Stack>
              <LinkDecorated target="_blank" w="10rem" href="/share-your-event" label={t('share_an_event')!} />
            </Stack>
            <Box>
              <ShareEventImage width="15rem" />
            </Box>
          </Flex>
        </Box>
        <HStack spacing={6}>
          <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
            <Stack spacing={6}>
              <Flex justifyContent="space-between">
                <Stack>
                  <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('see_your_events')}</Heading>
                  <Text fontSize="md">{t('total_confirmed_guest_list_price_and_mor')}</Text>
                </Stack>
                <Stack>
                  <LinkDecorated target="_blank" w="10rem" href="/events" label={t('my_events')!} />
                </Stack>
              </Flex>
              <Flex justifyContent="center">
                <EventsImage />
              </Flex>
            </Stack>
          </Box>
          <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
            <Stack spacing={6}>
              <Flex justifyContent="space-between">
                <Stack>
                  <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('edit_your_profile')}</Heading>
                  <Text fontSize="md">{t('logo_instagram_website_description_and_m')}</Text>
                </Stack>
                <Stack>
                  <LinkDecorated target="_blank" w="10rem" href="/profile" label={t('profile')!} />
                </Stack>
              </Flex>
              <Flex justifyContent="center">
                <ProfileImage />
              </Flex>
            </Stack>
          </Box>
        </HStack>
        <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
          <Flex justifyContent="space-between">
            <Stack spacing={10}>
              <Stack>
                <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('new_here')}</Heading>
                <Text fontSize="md">{t('start_with_our_help_page')}</Text>
              </Stack>
              <LinkDecorated target="_blank" w="10rem" href="/help" label={t('help')!} />
            </Stack>
            <Box>
              <QuestionImage width="15rem" />
            </Box>
          </Flex>
        </Box>
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
