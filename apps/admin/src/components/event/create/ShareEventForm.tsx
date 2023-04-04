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
  Image,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useS3Upload } from 'next-s3-upload';
import { useEffect, useRef } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import { RiFolderUploadFill } from 'react-icons/ri';
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
  TextFormLabel,
  TextDecorated,
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
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ShareEventForm() {
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    const { url } = await uploadToS3(file);

    console.log(url);

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
          batches: values.batches,
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
      batches: [
        {
          date: '',
          title: '',
          value: '',
          visible: true,
        },
      ],
      flyer: '',
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  useEffect(() => {
    const batchesLength = values.batches.length;
    setFieldValue(`batches.${batchesLength - 1}.date`, values.dateEnd);
  }, [values.dateEnd]);

  return (
    <FormikProvider value={formik}>
      <ContainerPage
        title={'Share an Event'}
        description={
          'Fill in all the fields and share your event in the best way. Only a few fields can be edited later, check all data before sharing, such as date, price and batches.'
        }
      >
        <Box as={'form'} rounded={'lg'} border={'1px'} borderColor={'gray.700'} p={10} boxShadow={'2xl'}>
          <Stack spacing={10}>
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
            <FormControl id="description" isRequired>
              <InputArea
                name="description"
                label="Description:"
                placeholder="Describe your event, the attractions, the place..."
              />
            </FormControl>
            <HStack spacing={8}>
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
            <HStack alignItems={'stretch'} spacing={8}>
              <Box w={'full'}>
                <Box display={'none'}>
                  <InputFile name="flyer" id={'flyer-input'} onChange={handleFileChange} />
                </Box>
                <FormControl id="flyer" isRequired>
                  <TextFormLabel mt={'2'} label={'Flyer:'} />
                  <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    gap={2}
                    cursor={'pointer'}
                    mt={6}
                    onClick={() => document.getElementById('flyer-input')?.click()}
                  >
                    <RiFolderUploadFill size={'2.5rem'} />
                    <Text fontSize={'lg'} fontWeight={'bold'}>
                      Upload a new Flyer
                    </Text>
                  </Flex>
                </FormControl>
              </Box>
              <FieldArray
                name="batches"
                render={(arrayHelpers) => (
                  <Stack w={'full'} spacing={8}>
                    <FormControl id={'batches'} isRequired>
                      <TextFormLabel mt={'2'} label={'Batches:'} />
                      {values.batches.map((batch, index) => (
                        <HStack spacing={5} key={index}>
                          <FormControl id={`batches.${index}.title`} isRequired>
                            <InputField
                              name={`batches.${index}.title`}
                              labelProps={{
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              label="Batch Title:"
                            />
                          </FormControl>
                          <FormControl id={`batches.${index}.value`} isRequired>
                            <InputPrice
                              name={`batches.${index}.value`}
                              labelProps={{
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              label="Batch Price:"
                            />
                          </FormControl>
                          <FormControl id={`batches.${index}.date`} isRequired>
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
                          </FormControl>
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
      </ContainerPage>
    </FormikProvider>
  );
}
