import {
  Box,
  FormControl,
  HStack,
  Image,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useRouter } from 'next/router';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import {
  InputFile,
  InputArea,
  InputField,
  Button,
  InputMaps,
  InputDate,
  InputAge,
  InputPrice,
  ContainerPage,
  TextDecorated,
} from '@event-list/ui';

import type { ShareEventMutation, ShareEventMutation$data } from '../../../../__generated__/ShareEventMutation.graphql';
import { ShareEvent } from './mutations/ShareEventMutation';

type ShareEventParams = yup.InferType<typeof ShareEventSchema>;

const ShareEventSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().min(12, 'Your description must have min 12 characters').required('Description is required'),
  place: yup.string().required('Place is required'),
  dateStart: yup.string().required('Date Start is required'),
  dateEnd: yup.string().required('Date End is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  price: yup.string().required('Price is required'),
  flyer: yup.string().required('Flyer is required'),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const EventInformationRow = ({ title, text }) => {
  return (
    <Flex alignItems={'center'} gap={1}>
      <TextDecorated fontSize={'sm'} fontWeight={'bold'}>
        {title}
      </TextDecorated>
      <Text fontSize={'sm'} fontFamily={'Noto Sans'}>
        {text}
      </Text>
    </Flex>
  );
};

export default function ShareEventForm() {
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    const { url } = await uploadToS3(file);

    await setFieldValue('flyer', url);
  };

  const onSubmit = (values: ShareEventParams) => {
    const config = {
      variables: {
        input: {
          title: values.title,
          description: values.description,
          dateStart: values.dateStart,
          place: values.place,
          dateEnd: values.dateEnd,
          listAvailableAt: values.listAvailableAt,
          classification: values.classification,
          price: values.price,
          flyer: values.flyer,
        },
      },
      onCompleted: ({ CreateEventMutation }: ShareEventMutation$data) => {
        if (typeof CreateEventMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (CreateEventMutation?.error) {
          toast({
            title: CreateEventMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: CreateEventMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.push('/events');
      },
    };

    EventShareEvent(config);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dateStart: '',
      dateEnd: '',
      place: '',
      listAvailableAt: '',
      classification: '',
      price: '',
      flyer: '',
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <ContainerPage title={'Share an Event'}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Heading>
                <TextDecorated>Event Confirmation</TextDecorated>
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>Do you confirm all these data? You will not be able to change some information after sharing!</Box>
              <Stack mt={4}>
                <EventInformationRow title={'Title: '} text={values.title} />
                <EventInformationRow title={'Place: '} text={values.place} />
                <EventInformationRow title={'Price: '} text={values.price} />
                <EventInformationRow title={'Date Start: '} text={values.dateStart} />
                <EventInformationRow title={'Date End: '} text={values.dateEnd} />
                <EventInformationRow title={'List Available At: '} text={values.listAvailableAt} />
                <EventInformationRow title={'Classification: '} text={values.classification} />
                <EventInformationRow title={'Description: '} text={values.description} />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  handleSubmit();
                  onClose();
                }}
                isSubmitting={false}
                text={'Send'}
              />
              <Button onClick={onClose} isSubmitting={false} text={'Close'} />
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box as={'form'} rounded={'lg'}>
          <Stack spacing={8}>
            <HStack spacing={8}>
              <Box w="full">
                <FormControl id="title" isRequired>
                  <InputField name="title" label="Title:" placeholder="Event name" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="place" isRequired>
                  <InputMaps name="place" apiKey={googleMapsApiToken} label="Place:" placeholder="Event place" />
                </FormControl>
              </Box>
            </HStack>
            <HStack spacing={8}>
              <Box w="full">
                <FormControl id="price" isRequired>
                  <InputPrice name="price" label="Price:" labelProps={{ tooltip: 'Informative event price' }} />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="dateStart" isRequired>
                  <InputDate label="Date Start:" name="dateStart" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="dateEnd" isRequired>
                  <InputDate label="Date End:" name="dateEnd" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="listAvailableAt" isRequired>
                  <InputDate name="listAvailableAt" label="List Available At:" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="classification" isRequired>
                  <InputAge name="classification" label="Classification:" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="description" isRequired>
              <InputArea
                name="description"
                label="Description:"
                placeholder="Describe your event, the attractions, the place..."
              />
            </FormControl>
            <HStack>
              <Box>
                <FormControl id="flyer" isRequired>
                  <InputFile name="flyer" label="Flyer:" onChange={handleFileChange} />
                </FormControl>
              </Box>
              {values.flyer && (
                <Box maxW="100px">
                  <Image src={values.flyer} alt="flyer-preview" borderRadius="10px" />
                </Box>
              )}
            </HStack>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                onClick={() => onOpen()}
                disabled={isDisabled}
                text={'Share Event'}
                isSubmitting={isPending}
              />
            </Stack>
          </Stack>
        </Box>
      </ContainerPage>
    </FormikProvider>
  );
}
