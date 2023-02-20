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
import { AiFillPrinter } from 'react-icons/ai';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import { Button, InputArea, InputSelect, TextDecorated } from '@event-list/ui';

import type {
  AddUserInEventMutation,
  AddUserInEventMutation$data,
} from '../../../__generated__/AddUserInEventMutation.graphql';
import { AddUserInEvent } from './mutations/AddUserInEventMutation';

type AddUserInEventParams = yup.InferType<typeof AddUserInEventSchema>;

const AddUserInEventSchema = yup.object({
  names: yup.string().required('Names is required'),
  role: yup.string().required('Role is required'),
});

const EventListModal = ({
  users,
  title,
  eventId,
  onClose: onCloseOuside,
}: {
  users: { mas: string[]; fem: string[]; free: string[] };
  title: string;
  eventId: string;
  onClose: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [HandleAddUserInEvent, isPending] = useMutation<AddUserInEventMutation>(AddUserInEvent);

  const onSubmit = (values: AddUserInEventParams) => {
    const arrayNames = values.names.split('\n');

    console.log(arrayNames);

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
            <Text as={'h2'} fontFamily={'body'} fontSize={{ base: 'lg', sm: '5xl' }}>
              {title}
            </Text>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box w="100%" borderColor={'gray.200'}>
              <Center mb={8}>
                <Text fontFamily={'body'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Mas
                </Text>
              </Center>
              <Box px={10}>
                {users.mas.map((masUser) => (
                  <Text fontFamily={'body'} key={masUser}>
                    {masUser}
                  </Text>
                ))}
              </Box>
            </Box>
            <Box w="100%">
              <Center mb={8}>
                <Text fontFamily={'body'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Fem
                </Text>
              </Center>
              <Box px={10}>
                {users.fem.map((femUser) => (
                  <Text fontFamily={'body'} key={femUser}>
                    {femUser}
                  </Text>
                ))}
              </Box>
            </Box>
            <Box w="100%">
              <Center mb={8}>
                <Text fontFamily={'body'} fontSize={{ base: 'lg', sm: 'xl' }}>
                  Free
                </Text>
              </Center>
              <Box px={10}>
                {users.free.map((freeUser) => (
                  <Text fontFamily={'body'} key={freeUser}>
                    {freeUser}
                  </Text>
                ))}
              </Box>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => window.print()} isSubmitting={false} text={<AiFillPrinter />} mr={3} />
          <Button onClick={onOpen} isSubmitting={false} text={'Add'} mr={3} />
          <Button onClick={onCloseOuside} isSubmitting={false} text={'Close'} />
        </ModalFooter>
      </ModalContent>
    </Box>
  );
};

export { EventListModal };
