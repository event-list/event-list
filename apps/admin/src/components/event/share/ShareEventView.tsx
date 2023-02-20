import { Box, Flex, FormControl, HStack, Image, Stack, useToast, Tooltip } from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useRouter } from 'next/router';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import {
  InputFile,
  InputArea,
  TextDecorated,
  InputField,
  Button,
  InputMaps,
  InputDate,
  InputHours,
  InputAge,
  InputPrice,
} from '@event-list/ui';

import type { ShareEventMutation, ShareEventMutation$data } from '../../../../__generated__/ShareEventMutation.graphql';
import { ShareEvent } from './ShareEventMutation';

type ShareEventParams = yup.InferType<typeof ShareEventSchema>;

const ShareEventSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().min(12, 'Your description must have min 12 characters').required('Description is required'),
  place: yup.string().required('Place is required'),
  date: yup.string().required('Date is required'),
  eventOpenAt: yup.string().required('Event open at is required'),
  eventEndAt: yup.string().required('Event end at is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  price: yup.string().required('Price is required'),
  flyer: yup.string().required('Flyer is required'),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ShareEventView() {
  const { uploadToS3 } = useS3Upload();

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const router = useRouter();

  const toast = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const { url } = await uploadToS3(file);

    values.flyer = url;
  };

  const onSubmit = (values: ShareEventParams) => {
    const config = {
      variables: {
        input: {
          title: values.title,
          description: values.description,
          date: values.date,
          place: values.place,
          eventOpenAt: values.eventOpenAt,
          eventEndAt: values.eventEndAt,
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

        router.push('/');
      },
    };

    EventShareEvent(config);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      place: '',
      eventOpenAt: '',
      eventEndAt: '',
      listAvailableAt: '',
      classification: '',
      price: '',
      flyer: '',
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <Flex rounded={'xl'} p={{ base: 4, sm: 6, md: 8 }}>
        <Stack spacing={8} mx={'auto'} w={'100%'} px={20}>
          <Stack align={'center'}>
            <TextDecorated fontSize={'6xl'} fontWeight={'bold'} textAlign={'center'}>
              Share my Event
            </TextDecorated>
          </Stack>
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
                    <InputPrice name="price" label="Price:" />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="date" isRequired>
                    <InputDate label="Date:" name="date" />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="eventOpenAt" isRequired>
                    <InputHours name="eventOpenAt" label="Event Open At:" placeholder="20:00" />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="eventEndAt" isRequired>
                    <InputHours name="eventEndAt" label="Event End At:" placeholder="04:00" />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="listAvailableAt" isRequired>
                    <InputHours name="listAvailableAt" label="List Available At:" placeholder="23:00" />
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
                  onClick={() => handleSubmit()}
                  disabled={isDisabled}
                  text={'Share Event'}
                  isSubmitting={isPending}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </FormikProvider>
  );
}
