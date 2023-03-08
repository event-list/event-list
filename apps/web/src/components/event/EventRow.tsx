import { Box, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { useFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import { LinkDecorated } from '@event-list/ui';

import type { EventFragment_event$key } from '../../../__generated__/EventFragment_event.graphql';
import { EventViewFragment } from './Event';

const EventRow = (props: { fragmentKey: EventFragment_event$key }) => {
  const event = useFragment<EventFragment_event$key>(EventViewFragment, props.fragmentKey);

  return (
    <Stack
      p={3}
      py={3}
      justifyContent={{
        base: 'flex-start',
        md: 'space-around',
      }}
      direction={{
        base: 'column',
        md: 'row',
      }}
      alignItems={{ md: 'center' }}
    >
      <Box w={'100px'}>
        <Image rounded={'md'} alt={'flyer image'} src={event.flyer} objectFit={'cover'} />
      </Box>
      <Heading fontSize={'2xl'}>{event.title}</Heading>
      <Text>{timestampToDate(event.dateStart, 'dd/MM/yyyy')}</Text>
      <LinkDecorated label={'Access Event'} isExternal={true} href={`/event/${event.id}`} />
    </Stack>
  );
};

export { EventRow };
