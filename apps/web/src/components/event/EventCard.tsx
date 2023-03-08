import { Box, Center, Flex, Text, VStack } from '@chakra-ui/react';
import { useFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import { Card, TextDecorated } from '@event-list/ui';

import type { EventFragment_event$key } from '../../../__generated__/EventFragment_event.graphql';
import { EventViewFragment } from './Event';

const EventCard = (props: { fragmentKey: EventFragment_event$key }) => {
  const event = useFragment<EventFragment_event$key>(EventViewFragment, props.fragmentKey);

  if (!event) {
    return null;
  }

  return (
    <Card
      linkNavigation={`/event/${event.id}`}
      urlImage={event.flyer}
      title={event.title}
      subTitle={event.label?.name}
      imageHeight={{ base: 300, sm: 370 }}
    >
      <Flex alignItems="center" justifyContent="space-between" w="60%">
        <Box>
          <VStack spacing={0}>
            <TextDecorated fontSize={'sm'}>Open At</TextDecorated>
            <Text fontWeight={700} fontSize={'sm'}>
              {timestampToDate(event.dateStart, 'dd/MM HH:mm')}
            </Text>
          </VStack>
        </Box>
        <Box>
          <VStack spacing={0}>
            <TextDecorated fontSize={'sm'}>End At</TextDecorated>
            <Text fontWeight={700} fontSize={'sm'}>
              {timestampToDate(event.dateEnd, 'dd/MM HH:mm')}
            </Text>
          </VStack>
        </Box>
      </Flex>
      <Box>
        <TextDecorated fontSize={'sm'}>List available at</TextDecorated>
        <Center>
          <Text fontWeight={700} fontSize={'sm'}>
            {timestampToDate(event.listAvailableAt, 'dd/MM HH:mm')}
          </Text>
        </Center>
      </Box>
    </Card>
  );
};

export { EventCard };
