import {
  Center,
  Text,
  Box,
  Flex,
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
import { useRef, useTransition } from 'react';
import { AiFillPrinter, AiOutlineReload } from 'react-icons/ai';
import type { RefetchFnDynamic } from 'react-relay';
import { useMutation } from 'react-relay';
import { useReactToPrint } from 'react-to-print';
import * as yup from 'yup';

import { Button, InputArea, InputSelect, TextDecorated } from '@event-list/ui';

import type {
  AddUserInEventMutation,
  AddUserInEventMutation$data,
} from '../../../../__generated__/AddUserInEventMutation.graphql';
import type {
  EventRowFragment_event$data,
  EventRowFragment_event$key,
} from '../../../../__generated__/EventRowFragment_event.graphql';
import type { EventRowRefetch_query } from '../../../../__generated__/EventRowRefetch_query.graphql';
import { AddUserInEvent } from './mutations/AddUserInEventMutation';

type AddUserInEventParams = yup.InferType<typeof AddUserInEventSchema>;

const AddUserInEventSchema = yup.object({
  names: yup.string().required('Names is required'),
  role: yup.string().required('Role is required'),
});

const EventListUsersModal = ({
  users,
  title,
  eventId,
  onClose: onCloseOuside,
  refetch,
}: {
  users: EventRowFragment_event$data['users'];
  title: string;
  eventId: string;
  onClose: () => void;
  refetch: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [HandleAddUserInEvent, isPending] = useMutation<AddUserInEventMutation>(AddUserInEvent);

  const onSubmit = async (values: AddUserInEventParams) => {
    const arrayNames = values.names.split('\n');

    const config = {
      variables: {
        input: {
          names: arrayNames,
          role: values.role,
          eventId,
        },
      },

      onCompleted: ({ AddUserInEventMutation }: AddUserInEventMutation$data) => {
        if (typeof AddUserInEventMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (AddUserInEventMutation?.error) {
          toast({
            title: AddUserInEventMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: AddUserInEventMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        refetch();
      },
    };

    HandleAddUserInEvent(config);
  };

  const formikAddUserInEvent = useFormik({
    initialValues: {
      names: '',
      role: '',
    },
    validationSchema: AddUserInEventSchema,
    onSubmit,
  });

  const { handleSubmit: handleSubmitAddUserInEvent, isValid, dirty } = formikAddUserInEvent;

  const isDisabled = !isValid || isPending || !dirty;

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
              <FormControl id="role" isRequired mt={8}>
                <InputSelect
                  name="role"
                  label="Role:"
                  options={[
                    { value: 'mas', label: 'Mas' },
                    { value: 'fem', label: 'Fem' },
                    { value: 'free', label: 'Free' },
                  ]}
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
              {title}
            </Text>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody ref={componentRef}>
          <Flex>
            <Box w="100%" borderColor={'gray.200'}>
              <Center mb={8}>
                <Text fontFamily={'Noto Sans'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Mas
                </Text>
              </Center>
              <Box>
                {users &&
                  users.mas?.map((masUser) => (
                    <Text fontFamily={'Noto Sans'} key={masUser}>
                      {masUser}
                    </Text>
                  ))}
              </Box>
            </Box>
            <Box w="100%">
              <Center mb={8}>
                <Text fontFamily={'Noto Sans'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Fem
                </Text>
              </Center>
              <Box>
                {users &&
                  users.fem?.map((femUser) => (
                    <Text fontFamily={'Noto Sans'} key={femUser}>
                      {femUser}
                    </Text>
                  ))}
              </Box>
            </Box>
            <Box w="100%">
              <Center mb={8}>
                <Text fontFamily={'Noto Sans'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Free
                </Text>
              </Center>
              <Box>
                {users &&
                  users.free?.map((freeUser) => (
                    <Text fontFamily={'Noto Sans'} key={freeUser}>
                      {freeUser}
                    </Text>
                  ))}
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handlePrint} isSubmitting={false} text={<AiFillPrinter />} mr={3} />
          <Button onClick={() => refetch()} isSubmitting={false} text={<AiOutlineReload />} mr={3} />
          <Button onClick={onOpen} isSubmitting={false} text={'Add'} mr={3} />
          <Button onClick={onCloseOuside} isSubmitting={false} text={'Close'} />
        </ModalFooter>
      </ModalContent>
    </Box>
  );
};

export { EventListUsersModal };
