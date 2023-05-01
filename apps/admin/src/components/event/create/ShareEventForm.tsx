import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  FormControl,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useS3Upload } from 'next-s3-upload';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import { ConnectionHandler, useMutation } from 'react-relay';
import { ROOT_ID } from 'relay-runtime';
import * as yup from 'yup';

import {
  InputArea,
  InputField,
  Button,
  InputMaps,
  InputDate,
  InputAge,
  InputPrice,
  Hero,
  TextFormLabel,
  TextDecorated,
  InputSwitch,
  InputImage,
} from '@event-list/ui';

import { ShareEvent } from './mutations/ShareEventMutation';
import { ShareEventPreview } from './ShareEventPreview';
import type { ShareEventMutation, ShareEventMutation$data } from '../../../../__generated__/ShareEventMutation.graphql';

type ShareEventParams = yup.InferType<typeof ShareEventSchema>;

const ShareEventSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().min(12, 'Your description must have min 12 characters').required('Description is required'),
  place: yup.string().required('Place is required'),
  dateStart: yup.string().required('Date Start is required'),
  dateEnd: yup.string().required('Date End is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  batches: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required('Batch title is required'),
        value: yup.string().required('Batch value is required'),
        date: yup.string().required('Batch date is required'),
        visible: yup.boolean().notRequired(),
      }),
    )
    .required('Batches ate required')
    .max(6, 'Maximum of 6 batches'),
  flyer: yup.string().required('Flyer is required'),
  private: yup.boolean().notRequired(),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ShareEventForm() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const onSubmit = (values: ShareEventParams) => {
    const connectionId = ConnectionHandler.getConnectionID(ROOT_ID, 'Events_myEvents');

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
          batches: values.batches,
          flyer: values.flyer,
          private: values.private,
        },
        connections: [connectionId],
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
      batches: [
        {
          date: '',
          title: '',
          value: '',
          visible: true,
        },
      ],
      flyer: '',
      private: false,
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  useEffect(() => {
    const batchesLength = values.batches.length;
    setFieldValue(`batches.${batchesLength - 1}.date`, values.dateEnd);
    setFieldValue(`batches.${batchesLength - 1}.visible`, true);
  }, [values.dateEnd, values.batches.length]);

  return (
    <FormikProvider value={formik}>
      <Hero
        title={'Share an Event'}
        description={
          'Fill in all the fields and share your event in the best way. Only a few fields can be edited later, check all data before sharing, such as date, price and batches.'
        }
      >
        <Box as={'form'} rounded={'lg'} border={'1px'} borderColor={'gray.700'} p={10} boxShadow={'2xl'}>
          <Stack spacing={6}>
            <HStack spacing={8}>
              <Box w="full">
                <InputField name="title" label="Title:" placeholder="Event name" />
              </Box>
              <Box w="full">
                <InputMaps name="place" apiKey={googleMapsApiToken} label="Place:" placeholder="Event place" />
              </Box>
              <Box>
                <InputSwitch
                  colorScheme={'red'}
                  name={'private'}
                  label="Private:"
                  labelProps={{
                    tooltip: 'Defines whether your event will appear in the catalog',
                  }}
                />
              </Box>
            </HStack>
            <InputArea
              name="description"
              label="Description:"
              placeholder="Describe your event, the attractions, the place..."
            />
            <HStack spacing={8}>
              <Box w="full">
                <InputDate label="Date Start:" name="dateStart" />
              </Box>
              <Box w="full">
                <InputDate label="Date End:" name="dateEnd" />
              </Box>
              <Box w="full">
                <InputDate name="listAvailableAt" label="List Available At:" />
              </Box>
              <Box w="full">
                <InputAge name="classification" label="Classification:" />
              </Box>
            </HStack>
            <HStack alignItems={'stretch'} spacing={8}>
              <Box w={'full'}>
                <InputImage
                  name="flyer"
                  label="Flyer:"
                  description={`Upload a ${values.flyer ? 'new' : ''} Flyer`}
                  uploadedDescription="See your uploaded flyer below"
                />
              </Box>
              <FieldArray
                name="batches"
                render={(arrayHelpers) => (
                  <Stack w={'full'} spacing={8}>
                    <FormControl id={'batches'} isRequired>
                      <TextFormLabel mt={'2'} label={'Batches:'} />
                      {values.batches.map((batch, index) => (
                        <HStack spacing={5} key={index}>
                          <InputField
                            name={`batches.${index}.title`}
                            labelProps={{
                              fontSize: '13px',
                              fontWeight: 'medium',
                            }}
                            label="Batch Title:"
                            placeholder="First batch"
                          />
                          <InputPrice
                            name={`batches.${index}.value`}
                            labelProps={{
                              fontSize: '13px',
                              fontWeight: 'medium',
                            }}
                            label="Batch Price:"
                          />
                          <InputDate
                            name={`batches.${index}.date`}
                            labelProps={{
                              tooltip:
                                index === values.batches.length - 1
                                  ? 'Last batch date is defined by event end date'
                                  : 'Define batch date available',
                              fontSize: '13px',
                              fontWeight: 'medium',
                            }}
                            label="Batch Date:"
                            color={index === values.batches.length - 1 ? 'gray.600' : 'white'}
                            readOnly={index === values.batches.length - 1}
                          />
                          <InputSwitch
                            colorScheme={'red'}
                            labelProps={{
                              fontSize: '13px',
                              fontWeight: 'medium',
                            }}
                            isReadOnly={index === values.batches.length - 1}
                            name={`batches.${index}.visible`}
                            label="Batch Visible:"
                          />
                          <Box>
                            <TextFormLabel fontSize={'13px'} fontWeight={'medium'} label={'Actions'} />
                            <Flex gap={1}>
                              <Button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                                isDisabled={values.batches.length <= 1}
                                text={<BsFillTrashFill />}
                                isSubmitting={false}
                              />
                              <Button
                                type="button"
                                isDisabled={values.batches.length > 5}
                                onClick={() =>
                                  arrayHelpers.insert(index + 1, {
                                    date: '',
                                    title: '',
                                    value: '',
                                  })
                                }
                                text={<BsPlusCircleFill />}
                                isSubmitting={false}
                              />
                            </Flex>
                          </Box>
                        </HStack>
                      ))}
                    </FormControl>
                  </Stack>
                )}
              />
            </HStack>
            <Stack spacing={10} pt={2}>
              <Button
                mt={8}
                size="lg"
                onClick={() => router.push('#share-event-preview')}
                text={
                  <Flex alignItems={'center'}>
                    Continue <AiOutlineArrowDown />
                  </Flex>
                }
                isSubmitting={false}
              />
            </Stack>
          </Stack>
        </Box>
        <Stack spacing={4}>
          <TextDecorated fontSize={'3xl'} fontWeight={'bold'}>
            Preview
          </TextDecorated>
          <Text color={'gray.200'}>
            Confirm all event data, your event will look like this when shared and some information cannot be changed
          </Text>
          <Box
            rounded={'lg'}
            border={'1px'}
            borderColor={'gray.700'}
            p={10}
            boxShadow={'2xl'}
            id={'share-event-preview'}
          >
            <ShareEventPreview
              title={values.title}
              listAvailableAt={values.listAvailableAt}
              description={values.description}
              place={values.place}
              price={values.batches[0].value}
              dateStart={values.dateStart}
              dateEnd={values.dateEnd}
              classification={values.classification}
              flyer={values.flyer}
            />
            <Stack spacing={10} pt={2}>
              <Button
                mt={8}
                loadingText="Submitting"
                size="lg"
                onClick={onOpen}
                isDisabled={isDisabled}
                text={'Share Event'}
                isSubmitting={isPending}
              />
              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Share Event
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure about all the data you filled in? some data cannot be changed
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button onClick={onClose} isSubmitting={false} text={'Cancel'} />
                      <Button
                        onClick={() => handleSubmit()}
                        ml={3}
                        loadingText="Submitting"
                        isSubmitting={isPending}
                        isDisabled={isDisabled}
                        text={'Share Event'}
                      />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Stack>
          </Box>
        </Stack>
      </Hero>
    </FormikProvider>
  );
}
