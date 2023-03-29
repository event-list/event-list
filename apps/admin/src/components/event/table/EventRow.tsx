import { Tr, Link } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { graphql, useRefetchableFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import { EventParticipantsTd } from './EventParticipantsTd';
import { EventTd } from './EventTd';
import { EventUpdateTd } from './EventUpdateTd';
import type { EventRowFragment_event$key } from '../../../../__generated__/EventRowFragment_event.graphql';
import type { EventRowRefetch_query } from '../../../../__generated__/EventRowRefetch_query.graphql';

const EventRow = (props: { fragmentKey: EventRowFragment_event$key }) => {
  const webUrl = process.env.NEXT_PUBLIC_EVENT_LIST_WEB_URL;

  const [event, refetch] = useRefetchableFragment<EventRowRefetch_query, EventRowFragment_event$key>(
    graphql`
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
        batches {
          title
          value
          date
          visible
        }
        currentBatch
        participants {
          edges {
            node {
              ...ParticipantRowFragment_participant
            }
          }
        }
        participantsQtd
      }
    `,
    props.fragmentKey,
  );

  return (
    <Tr>
      <EventParticipantsTd event={event} refetch={refetch} />
      <EventTd event={event}>{event.title}</EventTd>
      <EventTd event={event}>{event.participantsQtd}</EventTd>
      <EventTd event={event}>{timestampToDate(event.dateStart, 'dd/MM/yyyy HH:mm')}</EventTd>
      <EventTd event={event}>{timestampToDate(event.listAvailableAt, 'dd/MM/yyyy HH:mm')}</EventTd>
      <EventTd event={event}>{event.currentBatch}</EventTd>
      <EventTd event={event}>{event.published ? 'True' : 'False'} </EventTd>
      <EventTd event={event}>{event.status ? 'Active' : 'Inative'}</EventTd>
      <EventTd event={event}>
        {event.published ? (
          <Link as={'a'} href={`${webUrl}/event/${event.id}`} target="_blank" isExternal cursor={'pointer'}>
            <FiExternalLink color={'white'} size={'1.3rem'} />
          </Link>
        ) : (
          <FiExternalLink color={'grey'} size={'1.3rem'} />
        )}
      </EventTd>
      <EventUpdateTd event={event} refetch={refetch} />
    </Tr>
  );
};

export { EventRow };
