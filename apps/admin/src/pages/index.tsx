import { Box, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useFragment, usePreloadedQuery } from 'react-relay';

import { FEATURES } from '@event-list/flags';
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
        <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
          <Flex justifyContent="space-between">
            <Stack spacing={10}>
              <Stack>
                <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('Share your event')}</Heading>
                <Text fontSize="md">{t('Do not waste time and share your events ')}</Text>
              </Stack>
              <LinkDecorated target="_blank" w="10rem" href="/share-your-event" label={t('Share an event')!} />
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
                  <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('See your events')}</Heading>
                  <Text fontSize="md">{t('Total confirmed, guest list, price, and more...')}</Text>
                </Stack>
                <Stack>
                  <LinkDecorated target="_blank" w="10rem" href="/events" label={t('My events')!} />
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
                  <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('Edit your profile')}</Heading>
                  <Text fontSize="md">{t('Logo, instagram, website, description, and more...')}</Text>
                </Stack>
                <Stack>
                  <LinkDecorated target="_blank" w="10rem" href="/profile" label={t('Profile')!} />
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
                <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{t('New here?')}</Heading>
                <Text fontSize="md">{t('Start with our help page')}</Text>
              </Stack>
              <LinkDecorated target="_blank" w="10rem" href="/help" label={t('Help')!} />
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
