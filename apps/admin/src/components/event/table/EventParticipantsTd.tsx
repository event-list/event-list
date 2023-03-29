import { Modal, ModalOverlay, Td, useDisclosure } from '@chakra-ui/react';
import { startTransition } from 'react';
import { HiDocumentText } from 'react-icons/hi';

import { ParticipantsModal } from '../../participant/ParticipantsModal';

const EventParticipantsTd = ({ event, refetch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refetchQuery = () => {
    startTransition(() => {
      const variables = {};

      refetch(variables, { fetchPolicy: 'network-only' });
    });
  };

  return (
    <Td color={event.published ? 'white' : 'grey'}>
      <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
        <ModalOverlay />
        <ParticipantsModal
          event={event}
          onClose={onClose}
          refetchEventQuery={refetchQuery}
          onCompleted={refetchQuery}
        />
      </Modal>
      <HiDocumentText cursor={'pointer'} size={'2rem'} onClick={onOpen} />
    </Td>
  );
};

export { EventParticipantsTd };
