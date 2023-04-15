import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import { Card, TextDecorated } from '@event-list/ui';

import { EventViewFragment } from './Event';
import type { EventFragment_event$key } from '../../../__generated__/EventFragment_event.graphql';

const EventCard = (props: { fragmentKey: EventFragment_event$key }) => {
  const { t } = useTranslation(['en', 'ptBR']);

  const event = useFragment<EventFragment_event$key>(EventViewFragment, props.fragmentKey);

  if (!event) {
    return null;
  }

  return (
    <Card
      linkNavigation={`/event/${event.id}`}
      urlImage={event.flyer}
      title={event.title}
      subTitle={event.merchant?.name}
      imageHeight={{ base: 300, sm: 370 }}
    >
      <Flex alignItems="center" justifyContent="space-between" w="75%">
        <Box>
          <VStack spacing={0}>
            <TextDecorated fontSize={'sm'}>{t('date')}</TextDecorated>
            <Text fontWeight={'bold'} fontSize={'lg'}>
              {timestampToDate(event.dateStart, 'dd/MM HH:mm')}
            </Text>
          </VStack>
        </Box>
        <Box>
          <VStack spacing={0}>
            <TextDecorated fontSize={'sm'}>{t('value')}</TextDecorated>
            <Text fontWeight={'bold'} fontSize={'lg'}>
              {event.currentBatch}
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Card>
  );
};

export { EventCard };
