import { Tr, Td as ChakraTd, Link } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { graphql, useRefetchableFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import type { EventRowFragment_event$key } from '../../../__generated__/EventRowFragment_event.graphql';
import type { EventRowRefetch_query } from '../../../__generated__/EventRowRefetch_query.graphql';
import { EventSheetTd } from './sheet/EventSheetTd';
import { EventUpdateTd } from './update/EventUpdateTd';

export const EventRowFragment = graphql`
  fragment EventRowFragment_event on Event @refetchable(queryName: "EventRowRefetch_query") {
    id
    title
    published
    description
    place
    classification
    status
    dateStart
    dateEnd
    listAvailableAt
    flyer
    currentPrice
    users
    usersQtd
  }
`;

const EventRow = (props: { fragmentKey: EventRowFragment_event$key }) => {
  const webUrl = process.env.NEXT_PUBLIC_EVENT_LIST_WEB_URL;

  const [event, refetch] = useRefetchableFragment<EventRowRefetch_query, EventRowFragment_event$key>(
    EventRowFragment,
    props.fragmentKey,
  );

  const Td = ({ children }) => <ChakraTd color={event.published ? 'white' : 'grey'}>{children}</ChakraTd>;

  return (
    <Tr>
      <EventSheetTd event={event} refetch={refetch} />
      <Td>{event.title}</Td>
      <Td>{event.usersQtd}</Td>
      <Td>{timestampToDate(event.dateStart, 'dd/MM/yyyy HH:mm')}</Td>
      <Td>{timestampToDate(event.listAvailableAt, 'dd/MM/yyyy HH:mm')}</Td>
      <Td>{event.currentPrice}</Td>
      <Td>{event.published ? 'True' : 'False'} </Td>
      <Td>{event.status ? 'Active' : 'Inative'}</Td>
      <Td>
        {event.published ? (
          <Link as={'a'} href={`${webUrl}/event/${event.id}`} target="_blank" isExternal cursor={'pointer'}>
            <FiExternalLink color={'white'} size={'1.3rem'} />
          </Link>
        ) : (
          <FiExternalLink color={'grey'} size={'1.3rem'} />
        )}
      </Td>
      <EventUpdateTd event={event} refetch={refetch} />
    </Tr>
  );
};

export { EventRow };
