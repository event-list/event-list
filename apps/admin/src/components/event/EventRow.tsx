import { Tr, Td, Flex, useDisclosure, Modal, ModalOverlay, Link, useToast } from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { BsPencilFill } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import { HiDocumentText, HiSwitchHorizontal } from 'react-icons/hi';
import { useMutation } from 'react-relay';
import timestampToDate from 'timestamp-to-date';

import type {
  ChangeEventStatusMutation,
  ChangeEventStatusMutation$data,
} from '../../../__generated__/ChangeEventStatusMutation.graphql';
import { EventListModal } from './EventListModal';
import { ChangeEventStatus } from './mutations/ChangeEventStatusMutation';

const EventRow = ({ event }) => {
  const webUrl = process.env.NEXT_PUBLIC_EVENT_LIST_WEB_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [HandleChangeEventStatus] = useMutation<ChangeEventStatusMutation>(ChangeEventStatus);

  const formikInativeEvent = useFormik({
    initialValues: {},
    onSubmit: () => {
      const config = {
        variables: {
          input: {
            eventId: event.id,
          },
        },

        onCompleted: ({ ChangeEventStatusMutation }: ChangeEventStatusMutation$data) => {
          if (typeof ChangeEventStatusMutation === 'undefined') {
            toast({
              title: 'Something was wrong',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          if (ChangeEventStatusMutation?.error) {
            toast({
              title: ChangeEventStatusMutation?.error,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          toast({
            title: ChangeEventStatusMutation?.success,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
      };

      HandleChangeEventStatus(config);
    },
  });

  const { handleSubmit: handleSubmitChangeEventStatus } = formikInativeEvent;

  if (!event) {
    return null;
  }

  const Status = () => (
    <Flex align={'center'} gap={1} alignContent={'center'}>
      <FormikProvider value={formikInativeEvent}>
        {event.status ? 'Active' : 'Inative'}
        <HiSwitchHorizontal onClick={() => handleSubmitChangeEventStatus()} cursor={'pointer'} />
      </FormikProvider>
    </Flex>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
        <ModalOverlay />
        <EventListModal users={event.users} title={event.title} eventId={event.id} onClose={onClose} />
      </Modal>
      <Tr>
        <Td>
          <HiDocumentText cursor={'pointer'} size={'2rem'} onClick={onOpen} />
        </Td>
        <Td>{event.title}</Td>
        <Td>{event.usersQtd}</Td>
        <Td>{timestampToDate(event.date, 'dd/MM/yyyy')}</Td>
        <Td>{event.eventOpenAt}</Td>
        <Td>{event.price}</Td>
        <Td>{event.published ? 'True' : 'False'}</Td>
        <Td>
          <Status />
        </Td>
        <Td>
          <Link as={'a'} href={`${webUrl}/event/${event.id}`} target="_blank" isExternal cursor={'pointer'}>
            <FiExternalLink size={'1.3rem'} />
          </Link>
        </Td>
        <Td>
          <BsPencilFill />
        </Td>
      </Tr>
    </>
  );
};

export { EventRow };
