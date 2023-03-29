import {
  Center,
  Text,
  Box,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  FormControl,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useRef } from 'react';
import { AiFillPrinter, AiOutlineReload } from 'react-icons/ai';
import { useMutation } from 'react-relay';
import { useReactToPrint } from 'react-to-print';
import * as yup from 'yup';

import { Button, InputArea, InputSelect, TextDecorated } from '@event-list/ui';

import { AddParticipantInEvent } from './mutations/AddParticipantInEventMutation';
import { ParticipantsList } from './ParticipantsList';
import type {
  AddParticipantInEventMutation,
  AddParticipantInEventMutation$data,
} from '../../../__generated__/AddParticipantInEventMutation.graphql';
import type { EventRowFragment_event$data } from '../../../__generated__/EventRowFragment_event.graphql';

type AddParticipantInEventParams = yup.InferType<typeof AddParticipantInEventSchema>;

const AddParticipantInEventSchema = yup.object({
  names: yup.string().required('Names is required'),
  batch: yup.string().required('Batch is required'),
});

type ParticipantsModalProps = {
  event: EventRowFragment_event$data;
  onClose: () => void;
  onCompleted?: () => void;
  refetchEventQuery: () => void;
};

const ParticipantsModal = ({
  event,
  onClose: onCloseOutside,
  onCompleted,
  refetchEventQuery,
}: ParticipantsModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [HandleAddParticipantInEvent, isPending] = useMutation<AddParticipantInEventMutation>(AddParticipantInEvent);

  const onSubmit = async (values: AddParticipantInEventParams) => {
    const arrayNames = values.names.split('\n');

    console.log('values', values);

    const config = {
      variables: {
        input: {
          names: arrayNames,
          batch: values.batch,
          eventId: event.id,
        },
      },

      onCompleted: ({ AddParticipantInEventMutation }: AddParticipantInEventMutation$data) => {
        if (typeof AddParticipantInEventMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (AddParticipantInEventMutation?.error) {
          toast({
            title: AddParticipantInEventMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: AddParticipantInEventMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        onCompleted && onCompleted();
      },
    };

    HandleAddParticipantInEvent(config);
  };

  const formikAddUserInEvent = useFormik({
    initialValues: {
      names: '',
      batch: '',
    },
    validationSchema: AddParticipantInEventSchema,
    onSubmit,
  });

  const { handleSubmit: handleSubmitAddUserInEvent, isValid, dirty } = formikAddUserInEvent;

  const isDisabled = !isValid || isPending || !dirty;

  const options = event.batches.map((batch) => ({ value: batch.title, label: batch.title }));

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <FormikProvider value={formikAddUserInEvent}>
          <ModalContent>
            <ModalHeader>
              <TextDecorated>Add users in this list</TextDecorated>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl id="names" isRequired>
                <InputArea name="names" label="Names:" placeholder="Write the names separed by lines" />
              </FormControl>
              <FormControl id="batch" isRequired mt={8}>
                <InputSelect
                  name="batch"
                  label="Batch:"
                  options={options}
                  _placeholder={{
                    color: 'gray.400',
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => handleSubmitAddUserInEvent()}
                text={'Send names'}
                isSubmitting={isPending}
                isDisabled={isDisabled}
                mr={3}
              />
              <Button onClick={onClose} text={'Cancel'} isSubmitting={false} />
            </ModalFooter>
          </ModalContent>
        </FormikProvider>
      </Modal>
      <ModalContent>
        <ModalHeader>
          <Center>
            <Text as={'h2'} fontFamily={'Noto Sans'} fontSize={{ base: 'lg', sm: '5xl' }}>
              {event.title}
            </Text>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody ref={componentRef}>
          <ParticipantsList participants={event.participants} batches={event.batches} />
        </ModalBody>

        <ModalFooter>
          <Button onClick={handlePrint} isSubmitting={false} text={<AiFillPrinter />} mr={3} />
          <Button onClick={() => refetchEventQuery()} isSubmitting={false} text={<AiOutlineReload />} mr={3} />
          <Button onClick={onOpen} isSubmitting={false} text={'Add'} mr={3} />
          <Button onClick={onCloseOutside} isSubmitting={false} text={'Close'} />
        </ModalFooter>
      </ModalContent>
    </Box>
  );
};

export { ParticipantsModal };
