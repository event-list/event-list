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
  Flex,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';
import { AiFillPrinter } from 'react-icons/ai';
import { HiPlus, HiUpload } from 'react-icons/hi';
import { TbReload } from 'react-icons/tb';
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
  const { t } = useTranslation(['ptBR', 'en']);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [HandleAddParticipantInEvent, isPending] = useMutation<AddParticipantInEventMutation>(AddParticipantInEvent);

  const onSubmit = async (values: AddParticipantInEventParams) => {
    const arrayNames = values.names.split('\n');

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
            title: t('Something was wrong'),
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

  const options = event.batches.map((batch) => ({
    value: batch.title,
    label: batch.title,
  }));

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <FormikProvider value={formikAddUserInEvent}>
          <ModalContent>
            <ModalHeader>
              <TextDecorated fontWeight={800} fontSize="2xl">
                {t('Add participants in this guest list')}
              </TextDecorated>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <InputArea name="names" label={t('Names')} placeholder={t('Write the names separed by lines')} />
              <InputSelect
                name="batch"
                label={t('Batch')}
                options={options}
                _placeholder={{
                  color: 'gray.400',
                }}
              />
            </ModalBody>
            <ModalFooter display={'flex'} justifyContent={'space-between'}>
              <Button onClick={onClose} text={t('Close')} isSubmitting={false} />
              <Button
                onClick={() => handleSubmitAddUserInEvent()}
                text={
                  <Flex alignItems={'center'} gap={1}>
                    {t('Send participants')}
                    <HiUpload />
                  </Flex>
                }
                isSubmitting={isPending}
                isDisabled={isDisabled}
              />
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

        <ModalFooter display={'flex'} justifyContent={'space-between'}>
          <Button
            onClick={onCloseOutside}
            isSubmitting={false}
            text={t('Close')}
            bgGradient={'none'}
            _hover={{
              bgGradient: 'none',
            }}
          />
          <Box>
            <Button
              onClick={handlePrint}
              isSubmitting={false}
              text={
                <Flex alignItems={'center'} gap={1}>
                  {t('Print')}
                  <AiFillPrinter />
                </Flex>
              }
              mr={3}
            />
            <Button
              onClick={() => refetchEventQuery()}
              isSubmitting={false}
              isDisabled={!event.published}
              text={
                <Flex alignItems={'center'} gap={1}>
                  {t('Reload')}
                  <TbReload />
                </Flex>
              }
              mr={3}
            />
            <Button
              onClick={onOpen}
              isSubmitting={false}
              isDisabled={!event.published}
              text={
                <Flex alignItems={'center'} gap={1}>
                  {t('Add participants')}
                  <HiPlus />
                </Flex>
              }
              mr={3}
            />
          </Box>
        </ModalFooter>
      </ModalContent>
    </Box>
  );
};

export { ParticipantsModal };
