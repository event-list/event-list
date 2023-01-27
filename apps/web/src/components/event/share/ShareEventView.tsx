import { Box, Flex, FormControl, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
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
} from '@event-list/ui';

import type { ShareEventMutation, ShareEventMutation$data } from '../../../../__generated__/ShareEventMutation.graphql';
import { ShareEvent } from './ShareEventMutation';

type ShareEventParams = yup.InferType<typeof ShareEventSchema>;

const ShareEventSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Password is required'),
  label: yup.string().required('Label is required'),
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

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

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
          label: values.label,
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
          enqueueSnackbar('Something was wrong');
          return;
        }

        if (CreateEventMutation?.error) {
          enqueueSnackbar(CreateEventMutation.error);
          return;
        }

        enqueueSnackbar(CreateEventMutation?.success);

        router.push('/');
        closeSnackbar();
      },
    };

    EventShareEvent(config);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      label: '',
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
      <Flex rounded={'xl'} p={{ base: 4, sm: 6, md: 8 }} justifyContent="center">
        <Stack spacing={8} mx={'auto'} maxW={'6xl'} px={6}>
          <Stack align={'center'}>
            <TextDecorated fontSize={'6xl'} fontWeight={'bold'} textAlign={'center'}>
              Share your Event
            </TextDecorated>
            <Text fontSize={'lg'} color={'gray.500'}>
              to propagate your cool events ✌️
            </Text>
          </Stack>
          <Box as={'form'} rounded={'lg'}>
            <Stack spacing={4}>
              <HStack>
                <Box w="full">
                  <FormControl id="title" isRequired>
                    <InputField name="title" label="Title:" placeholder="Event name" labelProps={{ fontSize: 'xl' }} />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="label" isRequired>
                    <InputField
                      name="label"
                      label="Label:"
                      placeholder="Organizer label"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="price" isRequired>
                    <InputField name="price" label="Price:" placeholder="00,00" labelProps={{ fontSize: 'xl' }} />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="date" isRequired>
                    <InputDate labelProps={{ fontSize: 'xl' }} label="Date:" name="date" />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="eventOpenAt" isRequired>
                    <InputHours
                      labelProps={{ fontSize: 'xl' }}
                      name="eventOpenAt"
                      label="Event Open At:"
                      placeholder="20:00"
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="eventEndAt" isRequired>
                    <InputHours
                      labelProps={{ fontSize: 'xl' }}
                      name="eventEndAt"
                      label="Event End At:"
                      placeholder="04:00"
                    />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="listAvailableAt" isRequired>
                    <InputHours
                      labelProps={{ fontSize: 'xl' }}
                      name="listAvailableAt"
                      label="List Available At:"
                      placeholder="23:00"
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="classification" isRequired>
                    <InputAge labelProps={{ fontSize: 'xl' }} name="classification" label="Classification:" />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="place" isRequired>
                    <InputMaps
                      name="place"
                      apiKey={googleMapsApiToken}
                      label="Place:"
                      placeholder="Event place"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="description" isRequired>
                <InputArea
                  name="description"
                  label="Description:"
                  placeholder="Describe your event"
                  labelProps={{ fontSize: 'xl' }}
                />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="flyer" isRequired>
                    <InputFile
                      name="flyer"
                      label="Flyer:"
                      labelProps={{ fontSize: 'xl' }}
                      onChange={handleFileChange}
                    />
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
                  type="submit"
                  onClick={() => handleSubmit()}
                  disabled={isDisabled}
                  text={'Send Event'}
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
