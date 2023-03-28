import {
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import {
  Button,
  InputAge,
  InputArea,
  InputDate,
  InputField,
  InputFile,
  InputMaps,
  InputSwitch,
  TextDecorated,
} from '@event-list/ui';

import { UpdateEvent } from './mutations/UpdateEventMutation';
import type { EventRowFragment_event$data } from '../../../../__generated__/EventRowFragment_event.graphql';
import type {
  UpdateEventMutation,
  UpdateEventMutation$data,
} from '../../../../__generated__/UpdateEventMutation.graphql';

type EventUpdateParams = yup.InferType<typeof EventUpdateSchema>;

const EventUpdateSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().min(12, 'Your description must have min 12 characters').required('Description is required'),
  place: yup.string().required('Place is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  flyer: yup.string().required('Flyer is required'),
  status: yup.boolean().required('Status is required'),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const EventUpdateModalForm = ({
  event,
  onClose,
  refetch,
}: {
  event: EventRowFragment_event$data;
  onClose: () => void;
  refetch: () => void;
}) => {
  const { uploadToS3 } = useS3Upload();
  const toast = useToast();

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    const { url } = await uploadToS3(file);

    await setFieldValue('flyer', url);
  };

  const [HandleUpdateEvent, isPendingMutation] = useMutation<UpdateEventMutation>(UpdateEvent);

  const onSubmit = async (values: EventUpdateParams) => {
    const config = {
      variables: {
        input: {
          eventId: event.id,
          title: values.title,
          description: values.description,
          flyer: values.flyer,
          place: values.place,
          listAvailableAt: values.listAvailableAt,
          classification: values.classification,
          status: values.status,
        },
      },

      onCompleted: ({ UpdateEventMutation }: UpdateEventMutation$data) => {
        if (typeof UpdateEventMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (UpdateEventMutation?.error) {
          toast({
            title: UpdateEventMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: UpdateEventMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        refetch();
      },
    };

    HandleUpdateEvent(config);
  };

  const formik = useFormik<EventUpdateParams>({
    initialValues: {
      title: event.title,
      description: event.description,
      flyer: event.flyer,
      place: event.place,
      listAvailableAt: event.listAvailableAt,
      classification: event.classification,
      status: event.status,
    },
    validationSchema: EventUpdateSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPendingMutation || !dirty;

  return (
    <FormikProvider value={formik}>
      <ModalContent>
        <ModalHeader>
          <Center>
            <Heading>
              <TextDecorated>{event.title}</TextDecorated>
            </Heading>
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="flyer">
              <InputFile id={'flyer-input'} name="flyer" display={'none'} onChange={handleFileChange} />
            </FormControl>
            <Flex flexDirection={'column'} alignItems={'center'}>
              <Image
                borderRadius={'lg'}
                w={'50%'}
                src={values.flyer}
                color={'gray.700'}
                cursor={'pointer'}
                onClick={() => document.getElementById('flyer-input')?.click()}
              />

              <FormControl id="status">
                <Center>
                  <InputSwitch name="status" label="Status:" />
                </Center>
              </FormControl>
            </Flex>
            <HStack spacing={8}>
              <FormControl id="title">
                <InputField name="title" label="Title:" placeholder="Event name" />
              </FormControl>
              <FormControl id="place">
                <InputMaps name="place" apiKey={googleMapsApiToken} label="Place:" placeholder="Event place" />
              </FormControl>
            </HStack>
            <HStack spacing={8}>
              <FormControl id="classification">
                <InputAge name="classification" label="Classification:" />
              </FormControl>
              <FormControl id="listAvailableAt">
                <InputDate name="listAvailableAt" label="List Available At:" />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="description">
                <InputArea
                  name="description"
                  label="Description:"
                  placeholder="Describe your event, the attractions, the place..."
                />
              </FormControl>
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => handleSubmit()}
            isSubmitting={isPendingMutation}
            isDisabled={isDisabled}
            text={'Update'}
            mr={3}
          />
          <Button onClick={onClose} isSubmitting={false} text={'Close'} />
        </ModalFooter>
      </ModalContent>
    </FormikProvider>
  );
};

export { EventUpdateModalForm };
