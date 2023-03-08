import { Tr, Td, useDisclosure, Modal, ModalOverlay, Link } from '@chakra-ui/react';
import { useTransition } from 'react';
import { BsPencilFill } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import { graphql, useRefetchableFragment } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import type { EventRowFragment_event$key } from '../../../__generated__/EventRowFragment_event.graphql';
import type { EventRowRefetch_query } from '../../../__generated__/EventRowRefetch_query.graphql';
import { EventListUsersModal } from './modal/EventListUsersModal';
import { EventUpdateModalForm } from './modal/EventUpdateModalForm';

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
    price
    users {
      mas
      fem
      free
    }
    usersQtd
  }
`;

const EventRow = (props: { fragmentKey: EventRowFragment_event$key }) => {
  const webUrl = process.env.NEXT_PUBLIC_EVENT_LIST_WEB_URL;
  const [isPending, startTransition] = useTransition();

  const { isOpen: isOpenEventList, onOpen: onOpenEventList, onClose: onCloseEventList } = useDisclosure();
  const { isOpen: isOpenUpdateEvent, onOpen: onOpenUpdateEvent, onClose: onCloseUpdateEvent } = useDisclosure();

  const [event, refetch] = useRefetchableFragment<EventRowRefetch_query, EventRowFragment_event$key>(
    EventRowFragment,
    props.fragmentKey,
  );

  const refetchQuery = () => {
    startTransition(() => {
      const variables = {};

      refetch(variables, { fetchPolicy: 'network-only' });
    });
  };

  return (
    <Tr>
      <Td>
        <Modal isOpen={isOpenEventList} onClose={onCloseEventList} size={'full'}>
          <ModalOverlay />
          <EventListUsersModal
            users={event.users}
            title={event.title}
            eventId={event.id}
            onClose={onCloseEventList}
            refetch={refetchQuery}
          />
        </Modal>
        <HiDocumentText cursor={'pointer'} size={'2rem'} onClick={onOpenEventList} />
      </Td>
      <Td>{event.title}</Td>
      <Td>{event.usersQtd}</Td>
      <Td>{timestampToDate(event.dateStart, 'dd/MM/yyyy HH:mm')}</Td>
      <Td>{timestampToDate(event.listAvailableAt, 'dd/MM/yyyy HH:mm')}</Td>
      <Td>{event.price}</Td>
      <Td color={event.published ? 'green.500' : 'red.500'}>{event.published ? 'True' : 'False'}</Td>
      <Td color={event.status ? 'green.500' : 'red.500'}>{event.status ? 'Active' : 'Inative'}</Td>
      <Td>
        <Link as={'a'} href={`${webUrl}/event/${event.id}`} target="_blank" isExternal cursor={'pointer'}>
          <FiExternalLink size={'1.3rem'} />
        </Link>
      </Td>
      <Td>
        <Modal isOpen={isOpenUpdateEvent} onClose={onCloseUpdateEvent} size={'xl'}>
          <ModalOverlay />
          <EventUpdateModalForm refetch={refetchQuery} event={event} onClose={onCloseUpdateEvent} />
        </Modal>
        <BsPencilFill cursor={'pointer'} onClick={onOpenUpdateEvent} />
      </Td>
    </Tr>
  );
};

export { EventRow };
