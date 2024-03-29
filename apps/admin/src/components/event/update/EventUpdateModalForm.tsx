import {
  Box,
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
  ModalOverlay,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useS3Upload } from 'next-s3-upload';
import { HiUpload } from 'react-icons/hi';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import {
  Button,
  InputAge,
  InputArea,
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
  const { t } = useTranslation();

  const { uploadToS3 } = useS3Upload();
  const toast = useToast();

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      alert(t('File is too big! 1MB Max'));
    }

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
          classification: values.classification,
          status: values.status,
        },
      },

      onCompleted: ({ UpdateEventMutation }: UpdateEventMutation$data) => {
        if (typeof UpdateEventMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
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
      <ModalOverlay backdropFilter="blur(2px) hue-rotate(90deg)" />
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
            <Flex flexDirection={'column'} alignItems={'center'} gap={2}>
              <Image
                borderRadius={'lg'}
                src={values.flyer}
                color={'gray.700'}
                cursor={'pointer'}
                onClick={() => document.getElementById('flyer-input')?.click()}
              />
              <Center>
                <InputSwitch colorScheme={'red'} name="status" label={t('Status')} />
              </Center>
            </Flex>
            <InputField name="title" label={t('Title')} placeholder={t('Event name')} />
            <HStack spacing={8}>
              <InputAge name="classification" label={t('Classification')} />
              <InputMaps name="place" apiKey={googleMapsApiToken} label={t('Place')} placeholder={t('Event place')} />
            </HStack>
            <InputArea
              name="description"
              label={t('Description')}
              placeholder={t('Describe your event, the attractions, the place...')}
            />
          </Stack>
        </ModalBody>
        <ModalFooter display={'flex'} justifyContent={'space-between'}>
          <Button
            bgGradient={'none'}
            _hover={{
              bgGradient: 'none',
            }}
            onClick={onClose}
            isSubmitting={false}
            mr={3}
            text={t('Close')}
          />
          <Button
            onClick={() => handleSubmit()}
            isSubmitting={isPendingMutation}
            isDisabled={isDisabled}
            text={
              <Flex alignItems={'center'} gap={1}>
                Update
                <HiUpload />
              </Flex>
            }
          />
        </ModalFooter>
      </ModalContent>
    </FormikProvider>
  );
};

export { EventUpdateModalForm };
