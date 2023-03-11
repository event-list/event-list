import { Modal, ModalOverlay, Td, useDisclosure } from '@chakra-ui/react';
import { startTransition } from 'react';
import { BsPencilFill } from 'react-icons/bs';

import { EventUpdateModalForm } from './EventUpdateModalForm';

const EventUpdateTd = ({ event, refetch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refetchQuery = () => {
    startTransition(() => {
      const variables = {};

      refetch(variables, { fetchPolicy: 'network-only' });
    });
  };

  return (
    <Td color={event.published ? 'white' : 'grey'}>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <EventUpdateModalForm refetch={refetchQuery} event={event} onClose={onClose} />
      </Modal>
      <BsPencilFill
        color={event.published ? 'white' : 'grey'}
        cursor={event.published ? 'pointer' : 'none'}
        onClick={event.published ? onOpen : undefined}
      />
    </Td>
  );
};

export { EventUpdateTd };
